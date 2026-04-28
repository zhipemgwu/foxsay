/**
 * FoxSay 后端代理服务
 * 转发前端请求到 DeepSeek API，保护 API Key 不暴露
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

const { getLevel, getRole, getPartner, listRoles, listPartners, listLevels, buildPromptForLevel, reloadAll } = require('./data-loader.cjs');

const API_KEY = process.env.DEEPSEEK_API_KEY;
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-reasoner';
const PORT = process.env.PORT || 3001;

if (!API_KEY) {
  console.error('❌ 缺少 DEEPSEEK_API_KEY，请在 .env 文件中配置');
  process.exit(1);
}

/**
 * POST /api/chat
 * Body: { messages: [...], stream?: boolean, temperature?, max_tokens? }
 * 
 * messages 格式同 OpenAI:
 *   [{ role: 'system', content: '...' }, { role: 'user', content: '...' }, ...]
 */
app.post('/api/chat', async (req, res) => {
  const { messages, stream = true, temperature, max_tokens, model } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages 字段必须是数组' });
  }

  // 白名单：允许前端指定 deepseek-chat（快）或 deepseek-reasoner（慢但聪明），其他一律用默认
  const allowedModels = ['deepseek-chat', 'deepseek-reasoner'];
  const useModel = allowedModels.includes(model) ? model : MODEL;

  const body = {
    model: useModel,
    messages,
    stream,
  };
  if (temperature !== undefined) body.temperature = temperature;
  if (max_tokens !== undefined) body.max_tokens = max_tokens;

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API 错误:', response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    if (stream) {
      // 流式响应 → SSE
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          res.write(chunk);
        }
      } catch (e) {
        console.error('流读取错误:', e.message);
      } finally {
        res.end();
      }
    } else {
      // 非流式 → 直接返回 JSON
      const data = await response.json();
      res.json(data);
    }
  } catch (err) {
    console.error('请求 DeepSeek 失败:', err.message);
    res.status(500).json({ error: '服务器内部错误: ' + err.message });
  }
});

/** 健康检查 */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', model: MODEL });
});

/**
 * POST /api/level-chat
 * Body: { levelKid: 'L001', history: [...], stream?: boolean }
 * 
 * 自动根据关卡 KID 加载角色卡和场景，拼装 system prompt
 */
app.post('/api/level-chat', async (req, res) => {
  const { levelKid, history = [], stream = true } = req.body;

  if (!levelKid) {
    return res.status(400).json({ error: '缺少 levelKid' });
  }

  let systemPrompt;
  try {
    systemPrompt = buildPromptForLevel(levelKid);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }

  const level = getLevel(levelKid);

  // 构造消息：system + 开场白(assistant) + 玩家对话历史
  const messages = [
    { role: 'system', content: systemPrompt },
  ];

  // 如果 history 为空，返回开场白
  if (history.length === 0) {
    return res.json({
      opening: level.dialogue.opening_message,
      choices: level.dialogue.opening_choices || [],
      levelTitle: level.meta.title,
    });
  }

  // 加入开场白作为 assistant 的第一条
  messages.push({ role: 'assistant', content: level.dialogue.opening_message });
  // 加入对话历史
  messages.push(...history);

  // 转发到 DeepSeek
  const body = { model: MODEL, messages, stream };

  try {
    const response = await fetch(`${BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('DeepSeek API 错误:', response.status, errText);
      return res.status(response.status).json({ error: errText });
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(decoder.decode(value, { stream: true }));
        }
      } catch (e) {
        console.error('流读取错误:', e.message);
      } finally {
        res.end();
      }
    } else {
      const data = await response.json();
      res.json(data);
    }
  } catch (err) {
    console.error('请求 DeepSeek 失败:', err.message);
    res.status(500).json({ error: '服务器内部错误: ' + err.message });
  }
});

/** 获取关卡信息（不调用 AI） */
app.get('/api/level/:kid', (req, res) => {
  const level = getLevel(req.params.kid);
  if (!level) return res.status(404).json({ error: '关卡不存在' });
  res.json(level);
});

/** 获取角色卡信息 */
app.get('/api/role/:kid', (req, res) => {
  const role = getRole(req.params.kid);
  if (!role) return res.status(404).json({ error: '角色不存在' });
  res.json(role);
});

/** 获取搭档卡信息 */
app.get('/api/partner/:kid', (req, res) => {
  const partner = getPartner(req.params.kid);
  if (!partner) return res.status(404).json({ error: '搭档不存在' });
  res.json(partner);
});

/** 列出所有关卡和角色 */
app.get('/api/manifest', (_req, res) => {
  res.json({ roles: listRoles(), partners: listPartners(), levels: listLevels() });
});

/** 热重载数据（开发用） */
app.post('/api/reload', (_req, res) => {
  reloadAll();
  res.json({ status: 'ok', message: '数据已重新加载' });
});

app.listen(PORT, () => {
  console.log(`🦊 FoxSay API 代理已启动`);
  console.log(`   端口: ${PORT}`);
  console.log(`   模型: ${MODEL}`);
  console.log(`   地址: http://localhost:${PORT}/api/chat`);
});
