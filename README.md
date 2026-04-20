# 🦊 FoxSay - 恋爱能力提升平台

一站式恋爱服务APP，从AI辅助到真人实战，完整提升聊天与情感能力。

## 🎨 设计特色

- **低饱和莫兰迪色系** - 淡紫色主色 + 温柔配色
- **全圆角轻拟物** - 16px 统一圆角，柔和小阴影
- **超大留白治愈** - 宽松布局，减少视觉压迫
- **平滑动效** - Hover 上浮、点击缩放、页面过渡
- **响应式移动端** - 375px 标准宽度

## 📱 功能页面

1. **首页 (Home)** - 功能总览、数据展示、快速开始
2. **聊天训练场 (Train)** - 剧情模式 + 挑战模式、评分规则
3. **AI聊天助手 (AI)** - 6大功能、个性化键盘
4. **真人体验 (Real)** - 3步流程、体验官列表、实时匹配
5. **我的 (Profile)** - 用户信息、能力评分、道具成就

## 🚀 快速开始

### 安装依赖

```bash
cd C:/FoxSay
npm install
```

### 开发服务器

```bash
npm run dev
```

自动打开浏览器: http://localhost:5173

### 生产构建

```bash
npm run build
```

## 🛠 技术栈

- **框架**: React 18 + React Router 6
- **样式**: Tailwind CSS 3 + 自定义动效
- **构建**: Vite 5 + PostCSS + Autoprefixer
- **运行时**: Node.js

## 📁 项目结构

```
FoxSay/
├── src/
│   ├── pages/
│   │   ├── Home.jsx        # 首页
│   │   ├── Train.jsx       # 训练场
│   │   ├── AI.jsx          # AI助手
│   │   ├── Real.jsx        # 真人体验
│   │   └── Profile.jsx     # 个人资料
│   ├── components/
│   │   ├── Navigation.jsx  # 顶部导航
│   │   └── BottomNav.jsx   # 底部导航
│   ├── App.jsx             # 主应用
│   ├── main.jsx            # 入口
│   └── index.css           # 全局样式
├── tailwind.config.js      # Tailwind配置
├── vite.config.js          # Vite配置
├── postcss.config.js       # PostCSS配置
├── index.html              # HTML模板
└── package.json            # 依赖配置
```

## 🎯 交互特性

- ✨ **页面切换** - 平滑淡入动效
- 🎪 **卡片Hover** - 上浮阴影效果
- 👆 **按钮点击** - 缩放反馈动效
- 📊 **进度条** - 平滑过渡动画
- 🔄 **状态展开** - 可展开的功能详情
- 📱 **底部导航** - 持久化选中状态

## 🎨 设计系统

### 色彩方案

```javascript
- 主色: #D8C4E6 (淡紫色)
- 辅助蓝: #D8E8F5
- 辅助绿: #E0F5E8
- 辅助桃: #F5DCC8
- 辅助粉: #F5D8E8
- 文字深: #3D3D3D
- 文字浅: #999999
```

### 间距系统

```javascript
- xs: 12px  | sm: 16px | md: 20px | lg: 24px
- xl: 32px | 2xl: 40px | 3xl: 64px
```

### 排版规则

- 标题: 24px-40px (fontWeight: 600)
- 正文: 14px-16px (fontWeight: 400)
- 标签: 12px-14px (fontWeight: 400)
- 行高: 1.2-1.5

## 📜 许可证

©2026 狐说 版权所有

---

💜 用心打造的恋爱提升平台 - 让聊天变得更温暖
