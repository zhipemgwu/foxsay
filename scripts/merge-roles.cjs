/**
 * 合并 5 批角色卡 -> C:/FoxSay/data/role-cards.json
 */
const fs = require('fs');
const path = require('path');

const batch1 = JSON.parse(fs.readFileSync('C:/FoxSay/data/roles-batch1.json', 'utf-8')).roles;
const batch2 = require('./gen-roles-2.cjs');
const batch3 = require('./gen-roles-3.cjs');
const batch4 = require('./gen-roles-4.cjs');
const batch5 = require('./gen-roles-5.cjs');

const allRoles = { ...batch1, ...batch2, ...batch3, ...batch4, ...batch5 };

const finalData = {
  version: '2.0',
  schema: 'enhanced-v2',
  updated_at: new Date().toISOString(),
  fields_schema: {
    core: '基础身份 (kid/name/age/gender/identities/one_line_summary)',
    background: '成长经历 (growth_experience/family/education/key_events/trauma_or_scar)',
    appearance: '外貌细节 (overall/physique/facial/hair/distinguishing_marks)',
    personality: '人格 (core_traits/surface_traits/inner_traits/temperament/moral_bottom_line/biggest_fear/biggest_desire)',
    emotional_triggers: '情绪触发 (anger/soft/vulnerability)',
    communication: '沟通 (speak_style/voice/phrases/emoji/text/reply_speed)',
    habitual_mannerisms: '习惯性小动作',
    lifestyle: '生活 (clothing/accessories/hobbies/food/living)',
    attachment_style: '依恋风格 (type/description/in_conflict/when_safe)',
    love_language: '爱的语言 (giving/receiving/dealbreaker)',
    conflict_style: '冲突模式 (pattern/escalation_trigger/resolution_key)',
    attraction_triggers: '吸引/排斥点 (attracted_by/repelled_by)',
    social_media_behavior: '社交媒体 (posting/interaction/online_persona)',
    intimacy_stages: '5阶段亲密递进 (stage_1 到 stage_5)',
    relationships: '关系图谱',
    ai_instruction: 'AI 扮演指令 (do/dont)'
  },
  roles: allRoles
};

const outPath = 'C:/FoxSay/data/role-cards.json';
fs.writeFileSync(outPath, JSON.stringify(finalData, null, 2), 'utf-8');

const ids = Object.keys(allRoles).sort();
console.log('✅ 合并完成');
console.log(`📝 共 ${ids.length} 个角色：${ids.join(', ')}`);
console.log(`📁 输出到: ${outPath}`);
console.log(`📊 文件大小: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`);
