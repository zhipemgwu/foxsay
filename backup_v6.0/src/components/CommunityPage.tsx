import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, MessageCircle, Share2, X, Send, Bookmark, Lock, ChevronLeft, Eye } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { IconBubble, IcFire, IcChat, IcHeartSpark, IcMask, IcTrophy, IcPen, IcSparkle, IcHeart as IcHeartIcon, IcShield, IcBook, gradients } from './CuteIcons';
import { useUser } from '../context/UserContext';

/* ======= 认证徽章 SVG ======= */
function CertifiedBadge({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1l2.39 3.66L18.5 3.5l-1.16 4.11L21 10.5l-3.66 2.39L18.5 17l-4.11-1.16L12 19.5l-2.39-3.66L5.5 17l1.16-4.11L3 10.5l3.66-2.39L5.5 4l4.11 1.16L12 1z" fill="url(#certGrad)" />
      <path d="M9 11l2 2 4-4" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="certGrad" x1="3" y1="1" x2="21" y2="19">
          <stop offset="0%" stopColor="#FFD54F" />
          <stop offset="100%" stopColor="#FFA726" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ======= 头像 ======= */
const avatarImages = [
  '/avatars/face1.jpg',
  '/avatars/face2.png',
  '/avatars/face3.png',
  '/avatars/face4.png',
  '/avatars/face5.webp',
  '/avatars/face6.png',
];
const commentAvatars = [
  '/avatars/face1.jpg',
  '/avatars/face2.png',
  '/avatars/face3.png',
  '/avatars/face4.png',
  '/avatars/face5.webp',
  '/avatars/face6.png',
];
const avatarBorders = [gradients.coral, gradients.sky, gradients.rose, gradients.golden];

function UserAvatar({ src, size = 38, borderGradient }) {
  return (
    <div className="flex-shrink-0 p-[2px] rounded-full" style={{ background: borderGradient || 'rgba(245,239,232,0.1)' }}>
      <div className="rounded-full overflow-hidden" style={{ width: size, height: size }}>
        <ImageWithFallback src={src} alt="avatar" className="w-full h-full object-cover" />
      </div>
    </div>
  );
}

/* ======= 认证导师数据 ======= */
const bloggers = [
  { id: 'b1', name: '汪俊豪', avatarIdx: 0, followers: '12.8k', articles: 46, desc: '国家二级心理咨询师' },
  { id: 'b2', name: '余水', avatarIdx: 1, followers: '9.5k', articles: 37, desc: '恋爱导师 · 全关卡通关者' },
  { id: 'b3', name: '占方剑', avatarIdx: 2, followers: '15.2k', articles: 52, desc: '两性沟通专家' },
  { id: 'b4', name: '窦国立', avatarIdx: 3, followers: '7.3k', articles: 28, desc: '情感博主 · 通关认证导师' },
];

/* ======= 20 篇情感指导文章 ======= */
const articles = [
  {
    id: 1, title: '初次约会的10个黄金法则',
    author: '汪俊豪', authorIdx: 0, isPaid: false, price: 0, likes: 342, reads: 5280, time: '2天前', tag: '约会攻略',
    preview: '第一次约会往往决定了两个人未来的可能性。掌握这10个法则，让你的初次见面留下完美印象。',
    paragraphs: [
      '第一次约会，是两个人从线上走到线下的第一步。无论你们是通过朋友介绍、社交软件还是偶然相遇，初次约会的表现往往决定了是否会有"下一次"。很多人因为紧张而表现失常，但其实只要掌握一些基本原则，你就能自然地展现最好的自己。',
      '法则一：选择你熟悉的场所。在你熟悉的环境里，你会更加从容自信。咖啡馆、你常去的餐厅、或者一个你了解的展览都是不错的选择。熟悉感会让你减少焦虑，把更多注意力放在对方身上。',
      '法则二：提前到达，不要迟到。准时是最基本的尊重。建议比约定时间提前10分钟到达，这样你可以调整好自己的状态，选一个好位置，也能在对方到来时从容地迎接。',
      '法则三：手机静音并放到一边。这个小动作传递的信息是："在这段时间里，你是我最重要的人。"没有什么比一边聊天一边看手机更扫兴的了。',
      '法则四：学会提问而不是独白。好的约会是双向的对话。准备几个开放式问题，让对方有机会表达自己。',
      '法则五：真诚地倾听。当对方说话时，看着对方的眼睛，适时点头回应。不要急着想下一句该说什么，而是真正理解对方在表达什么。',
      '法则六：适度的肢体语言。微笑、保持开放的姿态、适当的身体前倾都是积极信号。但不要过于刻意，自然就好。',
      '法则七：分享而不是炫耀。真正吸引人的是你的态度和真诚，而不是你的成就清单。',
      '法则八：注意对方的舒适度。如果感觉对方在某个话题上不太自在，灵活地换一个话题。',
      '法则九：不要在第一次约会谈前任。初次约会应该是关于你们两个人此刻的连接，而不是过去的感情包袱。',
      '法则十：结束时表达感谢。无论结果如何，真诚地感谢对方抽出时间来见面。',
    ],
  },
  {
    id: 2, title: '如何读懂对方的微表情',
    author: '占方剑', authorIdx: 2, isPaid: true, price: 9.9, likes: 578, reads: 8420, time: '3天前', tag: '沟通技巧',
    preview: '微表情是心理真实状态的"泄密者"。学会解读这些转瞬即逝的面部信号，让你在感情中更加敏锐。',
    paragraphs: [
      '你有没有过这样的经历：明明对方嘴上说着"没关系"，但你就是觉得哪里不对劲？这种直觉其实是有科学依据的——你的潜意识捕捉到了对方的微表情。微表情是持续时间不到半秒的面部表情，它们往往是真实情感的自然流露。',
      '首先我们要了解7种基本微表情：高兴、惊讶、悲伤、恐惧、愤怒、厌恶和轻蔑。每一种都有对应的肌肉运动模式。在恋爱关系中，最需要关注的是以下几种情况。',
      '当对方嘴角短暂下撇时，通常意味着不满或不同意。即使随后马上恢复微笑，那一瞬间的下撇才是真实反应。',
      '眉头微皱加上瞬间眯眼，通常代表困惑或不信任。如果你在表达某个观点时看到对方有这样的反应，可能需要更清楚地解释你的意思。',
      '真正的开心和假笑有一个关键区别：真正的笑会带动眼周的肌肉，产生所谓的"鱼尾纹效应"。如果对方笑的时候只有嘴巴在动，眼睛没有变化，那很可能是礼貌性的假笑。',
      '注意对方的身体朝向。当一个人对你感兴趣时，他们的脚尖、膝盖和身体都会不自觉地朝向你。',
      '瞳孔是最诚实的器官。当人看到喜欢的东西或人时，瞳孔会不自觉地放大。',
      '频繁的嘴唇触碰既可能是紧张的表现，也可能是被吸引的信号。结合整体情境来判断。',
      '最后要强调：微表情解读不是读心术，它只是帮助你更好地理解对方。最好的沟通方式还是直接、温柔地和对方交流。',
    ],
  },
  {
    id: 3, title: '聊天总是冷场？这5招教你破冰',
    author: '余水', authorIdx: 1, isPaid: false, price: 0, likes: 891, reads: 12600, time: '1天前', tag: '聊天技巧',
    preview: '聊天冷场是很多人的噩梦，但掌握了正确的方法，你也能成为聊天高手。',
    paragraphs: [
      '你是不是经常遇到这样的场景：聊天聊着聊着就没话说了，然后尴尬地沉默？别担心，聊天冷场并不代表你们不合适，很可能只是你还没掌握正确的方法。',
      '第一招：使用"信息扩展法"。当对方说一句话时，不要只是简单回应，而是从中提取信息并扩展。比如对方说"我周末去爬山了"，你可以回应多个接话点。',
      '第二招：储备"话题弹药"。关注一些有趣的新闻、综艺、电影或者生活小趣事。在冷场时能自然地抛出一个话题。',
      '第三招：善用"二选一"提问法。给出选项降低了回答的难度，也容易引发讨论。',
      '第四招：学会"自我暴露"。适度地分享自己的小秘密、小习惯或者小尴尬，让人忍不住想接话。',
      '第五招：用"情感共鸣"代替"信息交换"。试着分享感受而不只是交换信息，感受类的分享更容易引起共鸣。',
      '记住，聊天的目的不是永远不冷场，而是让两个人都感到舒适和愉快。',
    ],
  },
  {
    id: 4, title: '恋爱中的情绪管理：如何控制嫉妒心',
    author: '汪俊豪', authorIdx: 0, isPaid: true, price: 12.9, likes: 267, reads: 4150, time: '4天前', tag: '情绪管理',
    preview: '嫉妒是恋爱中最常见也最具破坏力的情绪。学会管理它，才能让感情更加健康。',
    paragraphs: [
      '嫉妒是一种非常正常的人类情感。适度的嫉妒甚至可以是爱的表现。但当嫉妒失控时，它就变成了一颗定时炸弹。',
      '首先要区分"正常的不安"和"病态的嫉妒"。当你的伴侣和异性朋友出去，你感到一点点不舒服——这是正常的。但如果你因此检查对方手机、限制对方的社交，那就需要认真对待了。',
      '嫉妒的根源往往不是"对方做了什么"，而是你内心的不安全感。问问自己：我害怕失去什么？',
      '当嫉妒情绪来临时，试试"暂停-呼吸-思考"三步法。首先暂停你想做的反应，然后做几次深呼吸，最后理性地思考。',
      '沟通是最好的解药。用"我感觉"而不是"你总是"来开头。',
      '建立自己的安全感。拥有自己的爱好、朋友圈和追求，当你的生活足够丰富时，嫉妒自然就会减少。',
      '如果发现嫉妒已经严重影响了你的生活，不要羞于寻求专业帮助。',
    ],
  },
  {
    id: 5, title: '表白的最佳时机：别太早也别太晚',
    author: '窦国立', authorIdx: 3, isPaid: false, price: 0, likes: 1024, reads: 18900, time: '1周前', tag: '表白攻略',
    preview: '表白不是赌博，而是水到渠成的确认。掌握时机，让你的表白更有把握。',
    paragraphs: [
      '很多人把表白当成一场豪赌。但事实上，表白的成功率和"时机"的关系远大于"勇气"。',
      '什么是"太早"？当你们才刚认识不久，还没建立足够的信任时，急着表白反而会给对方压力。',
      '什么是"太晚"？当你们已经暧昧了很久，对方多次给出积极信号，你却迟迟不表态。',
      '最佳时机是：已经有过多次愉快的单独相处；对方会主动联系你；你们之间有了一些只属于两个人的默契。',
      '表白的方式也很重要。不需要大场面的惊喜，一个安静的只有两个人的场合反而更好。',
      '好的表白不是突然袭击，而是在两个人都心知肚明的时候，由你来说出那句确认的话。',
      '最后，即使被拒绝了也不要太沮丧。被拒绝不代表你不够好，只是此刻双方的感觉不同步。',
    ],
  },
  {
    id: 6, title: '长距离恋爱生存指南',
    author: '占方剑', authorIdx: 2, isPaid: true, price: 9.9, likes: 456, reads: 6800, time: '5天前', tag: '恋爱经营',
    preview: '距离不是感情的终点，而是另一种形式的考验。这份指南帮你跨越距离的障碍。',
    paragraphs: [
      '异地恋被无数人定义为"感情的坟墓"，但数据告诉我们，大约60%的异地恋最终成功走到了一起。',
      '第一是建立沟通节奏。不需要24小时在线，但要有固定的时间。',
      '第二是创造共同体验。线上一起看电影、一起打游戏、一起做饭都是好选择。',
      '第三是真诚沟通负面情绪。异地恋中最大的敌人不是距离，而是"报喜不报忧"。',
      '第四是保持各自的生活质量。一个充实的你，才能带给对方更多的正能量。',
      '第五是明确未来的方向。异地恋需要一个共同的终点。',
      '如果答案是TA值得，那就一起努力，让距离变成你们的勋章。',
    ],
  },
  {
    id: 7, title: '约会穿搭：第一印象的秘密武器',
    author: '余水', authorIdx: 1, isPaid: false, price: 0, likes: 723, reads: 10200, time: '3天前', tag: '约会攻略',
    preview: '研究表明，人类形成第一印象只需要7秒。穿搭是这7秒中最重要的因素之一。',
    paragraphs: [
      '心理学研究表明，人类形成第一印象只需7秒。而在这短暂的7秒里，你的穿着打扮占了55%以上的权重。',
      '约会穿搭的基本原则是"比日常好一点"。太随意会让对方觉得你不重视，太隆重又会给人压力。',
      '颜色的选择也有讲究。深蓝色给人可靠和沉稳的感觉，白色显得干净清爽。避免超过三种颜色。',
      '注意细节：干净的鞋子、整洁的指甲、没有褶皱的衣服、淡淡的香水。',
      '最重要的一点：穿你自己穿着舒服的衣服。在你的风格范围内做到最好版本的自己就够了。',
      '最后一个建议：准备一件有故事的配饰，它不仅能点亮你的造型，更能在聊天冷场时成为一个天然的话题。',
    ],
  },
  {
    id: 8, title: '分手后如何优雅地走出来',
    author: '汪俊豪', authorIdx: 0, isPaid: true, price: 15.9, likes: 389, reads: 7600, time: '1周前', tag: '情绪管理',
    preview: '分手是一种丧失，允许自己悲伤，但也要学会向前走。',
    paragraphs: [
      '分手后的那段时间，很多人形容为"失去了一部分自己"。承认这种丧失感是走出来的第一步。',
      '不要急着"走出来"。刚分手就拼命社交、喝酒——这些都是止痛药而不是药方。给自己充分的时间去感受悲伤。',
      '但"允许悲伤"不等于"沉溺悲伤"。给自己设一个限期，之后开始重建日常生活。',
      '删除还是保留对方的联系方式？建议是先屏蔽或不要看，等你真正释怀的时候再决定。',
      '记录你的"成长日记"——每天写下一件让你微笑的事、一个学到的教训。',
      '不要美化或妖魔化过去。真相通常在中间。',
      '准备好了再开始新的感情。当你想到前任时不再痛苦而是平静——你就准备好了。',
    ],
  },
  {
    id: 9, title: '如何成为一个好的倾听者',
    author: '窦国立', authorIdx: 3, isPaid: false, price: 0, likes: 612, reads: 9300, time: '2天前', tag: '沟通技巧',
    preview: '倾听不只是"听见"，更是"让对方感到被理解"。掌握倾听的艺术，你的关系将迎来质的飞跃。',
    paragraphs: [
      '在所有的沟通技巧中，倾听是最被低估的一种。大多数人在"听"的时候，其实是在"等着说"。',
      '真正的倾听从"清空自己"开始。放下你的判断、你的建议。完全把注意力放在对方身上。',
      '一个实用的技巧是"复述确认"。用你自己的话复述一遍核心内容，让对方感受到你真的在听。',
      '另一个关键是回应情绪而非事实。大多数时候，人们分享的不是信息，而是情感。',
      '学会容忍沉默。有时候，安静的陪伴比任何言语都更有力量。',
      '最后，不要急着给建议。除非对方明确要求，否则大多数情况下他们只是需要被听见。',
    ],
  },
  {
    id: 10, title: '线上聊天到线下见面的完美过渡',
    author: '余水', authorIdx: 1, isPaid: true, price: 6.9, likes: 445, reads: 7100, time: '4天前', tag: '约会攻略',
    preview: '认识了一个不错的人，聊得也很开心，但怎么自然地约出来见面？',
    paragraphs: [
      '在这个社交媒体时代，很多感情的开始都是线上聊天。聊天再投机，不见面就只是"网友"。',
      '第一步：从聊天中捕捉"见面信号"。当对方开始分享自己常去的地方，这些都是潜在的邀请信号。',
      '第二步：从线上的"共同兴趣"出发约见面。把见面回归到"一起做一件想做的事"。',
      '第三步：选择一个"低压力"的场景。白天的咖啡馆、热闹的市集都是好选择。',
      '第四步：见面前做好"预期管理"。线上的TA和线下的TA可能会有一些不同。',
      '第五步：见面后及时反馈。如果见面很开心，当天就可以发消息。',
      '从线上到线下的过渡要自然，不要强求。',
    ],
  },
  {
    id: 11, title: '恋爱中的边界感：爱不等于失去自我',
    author: '占方剑', authorIdx: 2, isPaid: true, price: 12.9, likes: 534, reads: 8900, time: '6天前', tag: '恋爱经营',
    preview: '健康的爱情需要"在一起"和"独立"之间找到平衡。建立恋爱中的健康边界。',
    paragraphs: [
      '很多人谈恋爱后，整个人都会"融化"在关系里。这看起来很"投入"，但实际上是非常危险的。',
      '失去边界的恋爱表面上是"爱得深"，实际上是在把关系建立在不稳定的基础上。',
      '健康的边界意味着：你可以有自己的时间、朋友圈子，可以对某些要求说"不"。',
      '建立边界的第一步是认识自己的底线。什么事情你能接受，什么不能？',
      '设立边界不是不爱对方。只有当你是一个完整的个体时，你才能给出健康的爱。',
      '如果对方不尊重你的边界，第一次温柔提醒，第二次认真谈话。反复越界就需要认真考虑这段关系了。',
    ],
  },
  {
    id: 12, title: '吵架后的破冰话术大全',
    author: '窦国立', authorIdx: 3, isPaid: false, price: 0, likes: 876, reads: 14500, time: '2天前', tag: '沟通技巧',
    preview: '吵架不可怕，可怕的是冷战。这些破冰话术帮你打破沉默，修复感情。',
    paragraphs: [
      '情侣吵架是再正常不过的事。真正决定一段关系质量的，不是吵不吵架，而是吵架后如何修复。',
      '核心原则：不要等对方来破冰。主动缓和关系的人不是"认输"，而是在说"你比这次争吵更重要"。',
      '温柔型破冰："我知道你现在可能不想理我，但我还是想告诉你，我很在乎你的感受。"',
      '幽默型破冰：适当的幽默可以化解紧张的气氛，但不要用在很严肃的问题上。',
      '行动型破冰：送一杯对方爱喝的奶茶、做一顿饭，行动的力量有时比话语更强大。',
      '书信型破冰：写一段话表达你的感受和你对这段关系的珍惜。',
      '等对方回应后，"复盘但不翻旧账"——达成共识后就翻篇。',
    ],
  },
  {
    id: 13, title: '社交恐惧？教你从零建立自信',
    author: '汪俊豪', authorIdx: 0, isPaid: false, price: 0, likes: 967, reads: 16800, time: '5天前', tag: '自我提升',
    preview: '社交恐惧不是性格缺陷，而是可以通过训练改善的。一步步走出舒适区。',
    paragraphs: [
      '先给你一个安慰：社交恐惧比你想象的普遍得多。超过60%的年轻人承认自己在某些社交场合会感到焦虑。',
      '社交恐惧的核心是"过度在意别人的评价"。而大多数人都在忙着担心自己的表现，根本没空评判你。',
      '训练自信的第一步：从小挑战开始。从对便利店店员微笑说谢谢开始，每一次小小的突破都在积累信心。',
      '第二步：准备好你的"社交工具箱"。准备几个万能话题，当你"有备而来"时，焦虑会显著降低。',
      '第三步：关注他人而不是自己。当你真正对他人产生兴趣时，自我意识就会减弱。',
      '第四步：接受"不完美"。完美主义是社交恐惧的帮凶，当你允许自己犯错时，你反而会更加自然。',
      '自信不是"确定自己一定会表现好"，而是"即使表现不好也没关系"。',
    ],
  },
  {
    id: 14, title: '恋爱里的安全感从哪里来',
    author: '占方剑', authorIdx: 2, isPaid: true, price: 9.9, likes: 445, reads: 7200, time: '3天前', tag: '恋爱经营',
    preview: '安全感不是对方给你的，而是你们一起建立的。理解安全感的本质。',
    paragraphs: [
      '"你能给我安全感吗？"大多数人理解错了——安全感不是一个人"给"另一个人的礼物，而是两个人共同营造的氛围。',
      '安全感的本质是"可预测性"。当你知道对方的行为模式是一致的、TA说的话是算数的——这就是安全感。',
      '建立安全感的第一个关键：言行一致。说了什么就做到，做不到就提前说明。',
      '第二个关键：稳定的情绪和回应。如果你心情不好，说出来比莫名其妙地冷淡对方好一万倍。',
      '第三个关键：展示脆弱。适度展示脆弱更能建立深层的信任。',
      '如果你的安全感更多来自童年经历的影响，建议你认真审视这个部分。认识到这一点，是真正解决问题的开始。',
    ],
  },
  {
    id: 15, title: '如何让TA对你刮目相看的说话艺术',
    author: '余水', authorIdx: 1, isPaid: true, price: 6.9, likes: 523, reads: 8100, time: '6天前', tag: '沟通技巧',
    preview: '会说话的人，不是口若悬河的人，而是让人感觉舒服和被重视的人。',
    paragraphs: [
      '有些人说话就像一阵春风，让人如沐其中。区别不在于声音好不好听，而在于有没有"让人舒服"的说话习惯。',
      '第一：记住别人提过的小事。这个简单的行为传递的信息是：我在认真地对待你说的每一句话。',
      '第二：赞美"具体的事"而不是"笼统的人"。"你今天衣服的颜色和你气质特别搭"比"你很好看"更打动人。',
      '第三：用"名字"称呼对方。心理学研究表明，人最喜欢听到的声音之一就是自己的名字。',
      '第四：说话留白，给对方空间。每说一两分钟就停一停，给对方接话的机会。',
      '第五：在指出问题时使用"三明治法"。先肯定好的，再说需要改进的，最后再鼓励。',
      '说话的艺术归根结底：把注意力放在对方身上，而不是自己身上。',
    ],
  },
  {
    id: 16, title: '被拒绝了怎么办？情感韧性修炼指南',
    author: '汪俊豪', authorIdx: 0, isPaid: false, price: 0, likes: 634, reads: 9800, time: '1周前', tag: '自我提升',
    preview: '被拒绝是痛苦的，但它不是终点，而是通往更好关系的必经之路。',
    paragraphs: [
      '被拒绝的那一刻，大脑激活的区域和身体疼痛是一样的。所以被拒绝后"心痛"不是矫情。',
      '但要区分"被拒绝"和"被否定"。TA拒绝的是"这段关系的可能性"，而不是"你这个人"。',
      '被拒绝后最常见的反应是"反刍思维"。当你发现自己在反刍时，做点需要注意力的事情打断循环。',
      '建立一个"拒绝免疫系统"。每周主动给自己制造一些"安全的被拒绝体验"。',
      '利用被拒绝后的时间客观复盘"下次我可以怎么做得更好"。',
      '"被拒绝的次数不重要，被接受的那一次才重要。"你只需要找到那个和你互相欣赏的人。',
    ],
  },
  {
    id: 17, title: '恋爱中的金钱观：该不该AA',
    author: '窦国立', authorIdx: 3, isPaid: false, price: 0, likes: 789, reads: 13200, time: '4天前', tag: '恋爱经营',
    preview: '金钱问题是情侣吵架的第二大原因。早点谈开，比吵了再谈要好得多。',
    paragraphs: [
      '在恋爱中回避谈钱是很多情侣的默契——感觉谈钱伤感情。但金钱问题是仅次于"信任"的第二大分手原因。',
      'AA制没有标准答案，关键是双方都感到舒适和公平。在关系早期就开诚布公地讨论这个话题。',
      '一个实际的方式是"弹性分担"——具体方式不重要，双方都觉得公平才重要。',
      '不要用金钱来追踪"谁付出更多"。恋爱不是做生意。',
      '关于送礼物：量力而行的心意，比超出预算的昂贵礼物要珍贵得多。',
      '最终极的建议：找一个金钱观和你相近的伴侣。',
    ],
  },
  {
    id: 18, title: '深度解析：TA为什么不回你的消息',
    author: '占方剑', authorIdx: 2, isPaid: true, price: 9.9, likes: 1245, reads: 22100, time: '1天前', tag: '聊天技巧',
    preview: '不回消息可能有100种原因。学会分辨哪些需要担心，哪些不需要。',
    paragraphs: [
      '已读不回——被称为现代恋爱中的"刑罚"。但在你开始胡思乱想之前，我们先理性地分析。',
      '最常见的原因：忙。不是所有人都能随时看手机、随时回复。',
      '第二种情况："不知道怎么回"。这种不回复反而说明TA在认真对待你的消息。',
      '第三种情况："社交电量耗尽"。不是针对你，而是对所有人回复速度都会下降。',
      '什么时候需要担心？当对方只对你一个人回复变慢、持续超过一周、伴随其他冷淡信号。',
      '不要连发N条消息追问。这种行为只会把对方从"暂时没回"推向"真的不想回"。',
      '正确做法：给对方空间，过一两天自然地开启另一个话题。',
    ],
  },
  {
    id: 19, title: '认识真正的自己：恋爱前的必修课',
    author: '汪俊豪', authorIdx: 0, isPaid: true, price: 15.9, likes: 378, reads: 5900, time: '1周前', tag: '自我提升',
    preview: '不了解自己的人很难建立健康的关系。认识真实的自己，是遇见对的人的第一步。',
    paragraphs: [
      '我见过太多在恋爱中不断受挫的人。需要停下来问自己：是运气不好，还是有什么自己的模式在重复？',
      '认识自己的第一步是了解"依恋类型"。你的依恋类型在很大程度上决定了你在亲密关系中的行为模式。',
      '焦虑型的人容易患得患失，回避型的人一旦关系变得亲密就想逃跑。了解这些模式才能有意识地调整。',
      '第二步是审视你的"择偶标准"。写下理想伴侣的10个特质，然后圈出最重要的3个。',
      '第三步是复盘过去的感情经历。客观地分析每段关系中的规律。',
      '第四步是学会享受独处。能够自在地跟自己相处的人，在恋爱中才不会变得依赖。',
      '恋爱是两个本来就完整的人选择分享彼此的生活。先把自己变成完整的人。',
    ],
  },
  {
    id: 20, title: '情侣必做的30件小事清单',
    author: '窦国立', authorIdx: 3, isPaid: false, price: 0, likes: 1567, reads: 25600, time: '3天前', tag: '恋爱经营',
    preview: '伟大的爱情都藏在平凡的小事里。这份清单帮你们在日常中积累甜蜜和默契。',
    paragraphs: [
      '恋爱不是只有生日和纪念日才需要仪式感。最打动人的，往往是那些不经意间的小事。你们完成了几件？',
      '1-5：一起做一顿饭；一起看日出；一起逛菜市场；互相写一封手写信；给对方拍100张照片然后选一张最丑的设为头像。',
      '6-10：一起淋一场雨然后喝热可可；凌晨12点准时送上生日祝福；一起拼1000块拼图；为对方学一首歌；一起养一盆植物并给它取名字。',
      '11-15：一起看对方喜欢但你不懂的电影；在陌生城市一起迷路；一起做志愿者；互相换手机壁纸；一起完成30天挑战。',
      '16-20：录一段两人的对话做纪念；一起去游乐场坐最刺激的过山车；准备不超过50块的走心礼物；一起看対方小时候的照片；给累了的TA按摩10分钟。',
      '21-25：创造只有你们知道的暗号；列出"认识你之后我改变的3件事"；一起夜跑；看到好笑的事马上分享；一起规划一次旅行。',
      '26-30：在对方不知情时买回TA心仪的东西；一起追完一整季电视剧；互相取专属昵称；吵架和好后一起吃大餐；每天睡前说"今天最开心的事"。',
      '不需要一次完成所有，慢慢来，每做完一件就打个勾。',
    ],
  },
];

const articleTags = {
  '约会攻略': { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' },
  '沟通技巧': { bg: 'rgba(100,181,246,0.12)', color: '#64B5F6' },
  '聊天技巧': { bg: 'rgba(78,205,196,0.18)', color: '#4ECDC4' },
  '情绪管理': { bg: 'rgba(206,147,216,0.18)', color: '#CE93D8' },
  '表白攻略': { bg: 'rgba(255,217,61,0.18)', color: '#FFD93D' },
  '恋爱经营': { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' },
  '自我提升': { bg: 'rgba(155,126,222,0.18)', color: '#9B7EDE' },
};

/* ======= 讨论帖子数据 ======= */
const discussionPosts = [
  {
    id: 1, user: '恋爱小达人', avatarIdx: 0, time: '2小时前', level: 'Lv.15',
    content: '今天用 AI 陪练了「咖啡馆搭讪」场景，真的有用！本来不知道怎么开口，现在感觉自信多了～',
    likes: 42, comments: 8, tag: '练习心得', liked: false, saved: false,
  },
  {
    id: 2, user: '温柔男孩', avatarIdx: 1, time: '5小时前', level: 'Lv.20',
    content: '分享一个小技巧：约会前先做 3 分钟「情绪共鸣」练习，效果拔群！对方说我特别有耐心 ud83dude0a',
    likes: 78, comments: 15, tag: '技巧分享', liked: true, saved: false,
  },
  {
    id: 3, user: '甜甜圈', avatarIdx: 2, time: '昨天', level: 'Lv.25',
    content: '连续打卡 30 天了！从「恋爱小白」升到「恋爱达人」，感觉整个人的表达能力都提升了～',
    likes: 156, comments: 23, tag: '成长记录', liked: false, saved: true,
  },
  {
    id: 4, user: '阳光少年', avatarIdx: 3, time: '昨天', level: 'Lv.8',
    content: '求助！第一次约会应该聊什么话题？好紧张啊 ud83dude30 有没有经验丰富的前辈给些建议？',
    likes: 34, comments: 45, tag: '求助', liked: false, saved: false,
  },
];

const discussionTags = {
  '练习心得': { bg: 'rgba(255,217,61,0.18)', color: '#FFD93D' },
  '技巧分享': { bg: 'rgba(100,181,246,0.12)', color: '#64B5F6' },
  '成长记录': { bg: 'rgba(78,205,196,0.18)', color: '#4ECDC4' },
  '求助': { bg: 'rgba(155,126,222,0.18)', color: '#9B7EDE' },
};

/* ======= 主页面组件 ======= */
export function CommunityPage() {
  const user = useUser();
  const [mainTab, setMainTab] = useState('column');
  const [readingArticle, setReadingArticle] = useState(null);
  const [unlockedArticles, setUnlockedArticles] = useState(new Set());

  // 评论区状态
  const [postData, setPostData] = useState(discussionPosts);
  const [showCompose, setShowCompose] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [showComments, setShowComments] = useState(null);
  const [commentInput, setCommentInput] = useState('');
  const [discFilter, setDiscFilter] = useState(0);

  const discFilters = ['全部', '练习心得', '技巧分享', '成长记录', '求助'];

  const toggleLike = (id) => {
    setPostData(prev => prev.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
  };
  const toggleSave = (id) => {
    setPostData(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  const filteredDisc = postData.filter(p => discFilter === 0 || p.tag === discFilters[discFilter]);

  const handleUnlock = (id) => {
    setUnlockedArticles(prev => new Set(prev).add(id));
  };

  /* -- 文章阅读页 -- */
  if (readingArticle) {
    const art = readingArticle;
    const isUnlocked = !art.isPaid || unlockedArticles.has(art.id);
    const freeCount = art.isPaid ? 3 : art.paragraphs.length;
    const visibleParas = isUnlocked ? art.paragraphs : art.paragraphs.slice(0, freeCount);
    const tc = articleTags[art.tag] || { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' };

    return (
      <div className="px-5 pt-6 pb-8">
        <motion.button className="flex items-center gap-1 mb-5" onClick={() => setReadingArticle(null)}
          whileTap={{ scale: 0.95 }} style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px' }}>
          <ChevronLeft size={18} /> 返回
        </motion.button>

        <span className="inline-block px-2.5 py-1 mb-3" style={{ background: tc.bg, color: tc.color, fontSize: '11px', fontWeight: 600, borderRadius: 6 }}>{art.tag}</span>

        <h1 style={{ color: '#f5efe8', fontSize: '24px', fontWeight: 700, lineHeight: 1.3, marginBottom: 16 }}>{art.title}</h1>

        <div className="flex items-center gap-3 mb-6">
          <UserAvatar src={avatarImages[art.authorIdx]} size={36} borderGradient={avatarBorders[art.authorIdx]} />
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{art.author}</span>
              <CertifiedBadge size={16} />
              <span className="px-1.5 py-0.5" style={{ background: 'rgba(255,217,61,0.18)', borderRadius: 4, color: '#FFD54F', fontSize: '9px', fontWeight: 700 }}>认证导师</span>
            </div>
            <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px' }}>{art.time} · {art.reads.toLocaleString()} 阅读</p>
          </div>
          {art.isPaid && !isUnlocked && (
            <span className="flex items-center gap-1 px-2 py-1" style={{ background: 'rgba(255,217,61,0.18)', borderRadius: 6 }}>
              <Lock size={10} color="#FFD93D" />
              <span style={{ color: '#FFD93D', fontSize: '11px', fontWeight: 600 }}>¥{art.price}</span>
            </span>
          )}
          {art.isPaid && isUnlocked && (
            <span className="px-2 py-1" style={{ background: 'rgba(78,205,196,0.18)', borderRadius: 6, color: '#4ECDC4', fontSize: '11px', fontWeight: 600 }}>已解锁</span>
          )}
        </div>

        <div className="flex flex-col gap-4 mb-6">
          {visibleParas.map((p, i) => (
            <p key={i} style={{ color: 'rgba(245,239,232,0.82)', fontSize: '15px', lineHeight: 1.75 }}>{p}</p>
          ))}
        </div>

        {art.isPaid && !isUnlocked && (
          <div className="relative">
            <div style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom, transparent, #2b2535)', pointerEvents: 'none' }} />
            <motion.div className="p-[1px] mb-6" style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,217,61,0.4), rgba(255,138,128,0.2), rgba(155,126,222,0.2))' }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="p-6 flex flex-col items-center" style={{ background: '#453a60', borderRadius: 15 }}>
                <IconBubble size={48} bg={gradients.golden} glow className="mb-4">
                  <Lock size={20} color="#fff" />
                </IconBubble>
                <p style={{ color: '#f5efe8', fontSize: '16px', fontWeight: 700, marginBottom: 4 }}>剩余 {art.paragraphs.length - freeCount} 段精彩内容</p>
                <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '13px', marginBottom: 16, textAlign: 'center' }}>
                  解锁后可查看全文，优质内容助你提升恋爱力
                </p>
                <motion.button className="w-full py-3.5 flex items-center justify-center gap-2"
                  style={{ background: gradients.golden, borderRadius: 14, color: '#2b2535', fontSize: '15px', fontWeight: 700 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleUnlock(art.id)}>
                  <Lock size={14} /> 解锁全文 · ¥{art.price}
                </motion.button>
                <p style={{ color: 'rgba(245,239,232,0.35)', fontSize: '11px', marginTop: 8 }}>解锁后永久可读</p>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(245,239,232,0.10)' }}>
          <div className="flex items-center gap-5">
            <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.85 }}>
              <Heart size={16} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>{art.likes}</span>
            </motion.button>
            <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.85 }}>
              <MessageCircle size={16} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>评论</span>
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }}>
              <Share2 size={16} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
            </motion.button>
          </div>
          <motion.button whileTap={{ scale: 0.85 }}>
            <Bookmark size={16} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
          </motion.button>
        </div>
      </div>
    );
  }

  /* -- 主页面 -- */
  return (
    <>
      <div className="px-5 pt-8 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={{
          height: 200,
          background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(155,126,222,0.15) 0%, rgba(255,138,128,0.12) 30%, transparent 100%)',
        }} />

        <div className="flex items-center justify-between mb-5">
          <div>
            <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '14px', marginBottom: 4 }}>恋爱社区</p>
            <h1 style={{ color: '#f5efe8', fontSize: '28px', fontWeight: 700, letterSpacing: '0.196px', lineHeight: 1.14, margin: 0 }}>一起成长</h1>
          </div>
          {mainTab === 'discuss' && (
            <motion.button
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{ background: gradients.coral }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowCompose(true)}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
            >
              <IcPen size={18} color="#fff" />
            </motion.button>
          )}
        </div>

        {/* Main Tabs */}
        <div className="flex items-center gap-1 p-1 mb-5 relative" style={{ background: '#453a60', borderRadius: 12 }}>
          {[{ key: 'column', label: '专栏' }, { key: 'discuss', label: '讨论' }].map((tab, i) => (
            <button key={tab.key} onClick={() => setMainTab(tab.key)}
              className="flex-1 py-2.5 flex flex-col items-center justify-center gap-1.5 relative"
              style={{
                background: mainTab === tab.key ? '#574d72' : 'transparent',
                borderRadius: 10,
                color: mainTab === tab.key ? '#f5efe8' : 'rgba(245,239,232,0.55)',
                fontSize: '14px',
                fontWeight: mainTab === tab.key ? 600 : 400,
                transition: 'all 0.2s',
              }}>
              <div className="flex items-center gap-1.5">
                {tab.key === 'column' ? <IcBook size={14} color={mainTab === tab.key ? '#f5efe8' : 'rgba(245,239,232,0.55)'} /> : <IcChat size={14} color={mainTab === tab.key ? '#f5efe8' : 'rgba(245,239,232,0.55)'} />}
                {tab.label}
              </div>
              {mainTab === tab.key && (
                <motion.div
                  layoutId="communityTabIndicator"
                  className="absolute bottom-1"
                  style={{ width: 20, height: 3, borderRadius: 2, background: '#FF8A80' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          ))}
        </div>

        {/* ========= 专栏 Tab ========= */}
        {mainTab === 'column' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {/* Certified bloggers */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-3">
                <span style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 600 }}>认证导师</span>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '12px' }}>查看全部</span>
              </div>
              <div className="flex gap-3 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                {bloggers.map((b, bIdx) => (
                  <motion.div key={b.id} className="flex-shrink-0 flex flex-col items-center p-3" style={{ background: '#453a60', borderRadius: 14, width: 100 }}
                    whileTap={{ scale: 0.97 }}>
                    <div className="relative mb-2">
                      <UserAvatar src={avatarImages[b.avatarIdx]} size={44} borderGradient={avatarBorders[b.avatarIdx]} />
                      <div className="absolute -bottom-1 -right-1">
                        <CertifiedBadge size={18} />
                      </div>
                    </div>
                    <span style={{ color: '#f5efe8', fontSize: '12px', fontWeight: 600, marginBottom: 2 }}>{b.name}</span>
                    <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: '10px' }}>{b.followers} 关注</span>
                    {bIdx === 2 && <span style={{ color: '#FF8A80', fontSize: '9px', fontWeight: 600, marginTop: 2, background: 'rgba(255,138,128,0.15)', padding: '1px 6px', borderRadius: 4 }}>🔥 热门</span>}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Articles */}
            <div className="flex flex-col gap-3">
              {articles.map((art, idx) => {
                const tc = articleTags[art.tag] || { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' };
                const isFeatured = idx === 0;
                return (
                  <motion.button key={art.id} className="w-full text-left"
                    style={{ borderRadius: 16, border: isFeatured ? '1px solid rgba(255,138,128,0.15)' : '1px solid rgba(245,239,232,0.06)' }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.04 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => setReadingArticle(art)}>
                    <div className="p-4" style={{ background: isFeatured ? 'linear-gradient(135deg, rgba(255,138,128,0.06), #453a60)' : '#453a60', borderRadius: 16 }}>
                      {isFeatured && (
                        <div className="flex items-center gap-1.5 mb-3 px-2 py-1 w-fit" style={{ background: 'rgba(255,138,128,0.12)', borderRadius: 6 }}>
                          <IcFire size={10} color="#FF8A80" />
                          <span style={{ color: '#FF8A80', fontSize: '10px', fontWeight: 600 }}>编辑精选</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <UserAvatar src={avatarImages[art.authorIdx]} size={24} borderGradient={avatarBorders[art.authorIdx]} />
                          <span style={{ color: 'rgba(245,239,232,0.75)', fontSize: '12px', fontWeight: 500 }}>{art.author}</span>
                          <CertifiedBadge size={13} />
                        </div>
                        <div className="flex items-center gap-2">
                          {art.isPaid ? (
                            <span className="flex items-center gap-1 px-1.5 py-0.5" style={{ background: 'rgba(255,217,61,0.18)', borderRadius: 4 }}>
                              <Lock size={9} color="#FFD93D" />
                              <span style={{ color: '#FFD93D', fontSize: '10px', fontWeight: 600 }}>¥{art.price}</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5" style={{ background: 'rgba(78,205,196,0.15)', borderRadius: 4, color: '#4ECDC4', fontSize: '10px', fontWeight: 600 }}>免费</span>
                          )}
                        </div>
                      </div>
                      <h3 style={{ color: '#f5efe8', fontSize: '15px', fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{art.title}</h3>
                      <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{art.preview}</p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1" style={{ color: 'rgba(245,239,232,0.35)', fontSize: '11px' }}>
                          <Heart size={11} /> {art.likes}
                        </span>
                        <span className="flex items-center gap-1" style={{ color: 'rgba(245,239,232,0.35)', fontSize: '11px' }}>
                          <Eye size={11} /> {art.reads.toLocaleString()}
                        </span>
                        <span style={{ color: 'rgba(245,239,232,0.35)', fontSize: '11px' }}>{art.time}</span>
                        <span className="ml-auto px-2 py-0.5" style={{ background: tc.bg, color: tc.color, fontSize: '10px', fontWeight: 600, borderRadius: 4 }}>{art.tag}</span>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* ========= 讨论 Tab ========= */}
        {mainTab === 'discuss' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
            {/* Hot topics */}
            <div className="flex gap-2 overflow-x-auto mb-4" style={{ scrollbarWidth: 'none' }}>
              {[
                { icon: <IcFire size={14} color="#fff" />, bg: gradients.coral, label: '约会攻略', count: '2.3k' },
                { icon: <IcChat size={14} color="#fff" />, bg: gradients.purple, label: '开场白大全', count: '1.8k' },
                { icon: <IcHeartSpark size={14} color="#fff" />, bg: gradients.rose, label: '表白成功', count: '960' },
                { icon: <IcMask size={14} color="#fff" />, bg: gradients.mint, label: '社恐自救', count: '1.2k' },
              ].map(t => (
                <motion.button key={t.label} className="flex-shrink-0 flex items-center gap-2 px-3 py-2.5"
                  style={{ background: '#453a60', borderRadius: 12 }} whileTap={{ scale: 0.97 }}>
                  <IconBubble size={26} bg={t.bg}>{t.icon}</IconBubble>
                  <div className="text-left">
                    <span style={{ color: '#f5efe8', fontSize: '12px', fontWeight: 600, display: 'block' }}>{t.label}</span>
                    <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '10px' }}>{t.count} 讨论</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Anonymous */}
            <motion.button className="w-full p-4 mb-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, rgba(155,126,222,0.18), rgba(78,205,196,0.08))', borderRadius: 14, border: '1px solid rgba(155,126,222,0.15)' }}
              whileTap={{ scale: 0.98 }}>
              <IconBubble size={32} bg={gradients.purple}><IcMask size={14} color="#fff" /></IconBubble>
              <div className="flex-1 text-left">
                <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>匿名树洞</span>
                <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px', marginTop: 2 }}>说出你不敢说的心里话</p>
              </div>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke="rgba(245,239,232,0.38)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>

            {/* Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {discFilters.map((t, i) => (
                <button key={t} onClick={() => setDiscFilter(i)} className="flex-shrink-0 px-3.5 py-2"
                  style={{ background: discFilter === i ? '#FF8A80' : '#453a60', borderRadius: 980, color: discFilter === i ? '#2b2535' : 'rgba(245,239,232,0.58)', fontSize: '13px', fontWeight: discFilter === i ? 600 : 400 }}>
                  {t}
                </button>
              ))}
            </div>

            {/* Posts */}
            {filteredDisc.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="flex flex-col gap-3">
                {filteredDisc.map((post, idx) => {
                  const tc = discussionTags[post.tag] || { bg: 'rgba(255,138,128,0.18)', color: '#FF8A80' };
                  return (
                    <motion.div key={post.id} className="p-[1px]"
                      style={{ borderRadius: 16, background: 'linear-gradient(135deg, rgba(255,138,128,0.1), transparent, transparent)' }}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: idx * 0.06 }}>
                      <div className="p-5" style={{ background: '#453a60', borderRadius: 15 }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <UserAvatar src={avatarImages[post.avatarIdx]} size={36} borderGradient={avatarBorders[post.avatarIdx]} />
                            <div>
                              <div className="flex items-center gap-2">
                                <span style={{ color: '#f5efe8', fontSize: '14px', fontWeight: 600 }}>{post.user}</span>
                                <span className="px-1.5 py-0.5" style={{ background: 'rgba(155,126,222,0.2)', borderRadius: 4, color: '#9B7EDE', fontSize: '10px', fontWeight: 600 }}>{post.level}</span>
                              </div>
                              <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>{post.time}</p>
                            </div>
                          </div>
                          <span style={{ background: tc.bg, color: tc.color, fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 6 }}>{post.tag}</span>
                        </div>
                        <p style={{ color: 'rgba(245,239,232,0.8)', fontSize: '14px', lineHeight: 1.6, marginBottom: 14, whiteSpace: 'pre-line' }}>{post.content}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.85 }} onClick={() => toggleLike(post.id)}>
                              <motion.div animate={post.liked ? { scale: [1, 1.4, 0.9, 1.1, 1], rotate: [0, -15, 15, 0] } : {}} transition={{ duration: 0.45 }}>
                                <Heart size={14} color={post.liked ? '#FF8A80' : 'rgba(245,239,232,0.32)'} fill={post.liked ? '#FF8A80' : 'transparent'} strokeWidth={1.8} />
                              </motion.div>
                              <span style={{ color: post.liked ? '#FF8A80' : 'rgba(245,239,232,0.32)', fontSize: '12px' }}>{post.likes}</span>
                            </motion.button>
                            <motion.button className="flex items-center gap-1.5" whileTap={{ scale: 0.85 }} onClick={() => setShowComments(post.id)}>
                              <MessageCircle size={14} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
                              <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '12px' }}>{post.comments}</span>
                            </motion.button>
                            <motion.button whileTap={{ scale: 0.85 }}>
                              <Share2 size={14} color="rgba(245,239,232,0.55)" strokeWidth={1.8} />
                            </motion.button>
                          </div>
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => toggleSave(post.id)}>
                            <motion.div animate={post.saved ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
                              <Bookmark size={14} color={post.saved ? '#FFD93D' : 'rgba(245,239,232,0.32)'} fill={post.saved ? '#FFD93D' : 'transparent'} strokeWidth={1.8} />
                            </motion.div>
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Compose */}
      <AnimatePresence>
        {showCompose && (
          <motion.div className="fixed inset-0 z-[55] flex flex-col" style={{ background: '#2b2535' }}
            initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
            <div style={{ paddingTop: 'env(safe-area-inset-top, 44px)' }}>
              <div className="flex items-center justify-between px-5 h-14">
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => { if (composeText.trim() && !window.confirm('放弃编辑？已输入的内容将不会保存')) return; setComposeText(''); setShowCompose(false); }} style={{ color: 'rgba(245,239,232,0.65)', fontSize: '14px' }}>取消</motion.button>
                <span style={{ color: '#f5efe8', fontSize: '16px', fontWeight: 600 }}>发布动态</span>
                <motion.button className="px-4 py-1.5"
                  style={{ background: composeText.trim() ? gradients.coral : '#574d72', borderRadius: 980, color: composeText.trim() ? '#fff' : 'rgba(245,239,232,0.38)', fontSize: '14px', fontWeight: 600 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (composeText.trim()) {
                      setPostData(prev => [{ id: Date.now(), user: user.name, avatarIdx: 2, time: '刚刚', level: `Lv.${user.level}`, content: composeText, likes: 0, comments: 0, tag: '练习心得', liked: false, saved: false }, ...prev]);
                      setComposeText(''); setShowCompose(false);
                    }
                  }}>
                  发布
                </motion.button>
              </div>
            </div>
            <div className="flex-1 px-5 py-4">
              <textarea autoFocus value={composeText} onChange={e => setComposeText(e.target.value)}
                placeholder="分享你的练习心得或恋爱感悟..." className="w-full h-48 bg-transparent outline-none resize-none"
                style={{ color: '#f5efe8', fontSize: '15px', lineHeight: 1.6 }} />
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)' }}>
                {['练习心得', '技巧分享', '求助'].map(t => (
                  <button key={t} className="px-2.5 py-1" style={{ background: '#453a60', borderRadius: 6, color: 'rgba(245,239,232,0.58)', fontSize: '11px' }}>#{t}</button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comments */}
      <AnimatePresence>
        {showComments !== null && (
          <motion.div className="fixed inset-0 z-[55] flex flex-col" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} onClick={() => setShowComments(null)} />
            <motion.div className="relative mt-auto w-full overflow-hidden"
              style={{ maxWidth: 430, margin: '0 auto', background: '#453a60', borderRadius: '20px 20px 0 0', maxHeight: '65vh' }}
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(245,239,232,0.10)' }}>
                <span style={{ color: '#f5efe8', fontSize: '16px', fontWeight: 600 }}>评论</span>
                <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowComments(null)} aria-label="关闭评论">
                  <X size={20} color="rgba(245,239,232,0.5)" />
                </motion.button>
              </div>
              <div className="px-5 py-4 overflow-y-auto" style={{ maxHeight: 'calc(65vh - 120px)' }}>
                {[
                  { user: '元气少女', avatarIdx: 0, text: '说得太好了！我也要去试试', time: '1小时前' },
                  { user: '勇敢小鸟', avatarIdx: 1, text: '确实有用，AI陪练比我想象中更自然', time: '2小时前' },
                  { user: '暖阳', avatarIdx: 2, text: '收藏了！下次约会前复习一下', time: '3小时前' },
                ].map((c, i) => (
                  <div key={i} className="flex gap-3 mb-4">
                    <UserAvatar src={commentAvatars[c.avatarIdx]} size={28} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span style={{ color: '#f5efe8', fontSize: '13px', fontWeight: 600 }}>{c.user}</span>
                        <span style={{ color: 'rgba(245,239,232,0.55)', fontSize: '11px' }}>{c.time}</span>
                      </div>
                      <p style={{ color: 'rgba(245,239,232,0.75)', fontSize: '13px', lineHeight: 1.4 }}>{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 px-5 py-3" style={{ borderTop: '1px solid rgba(245,239,232,0.10)', paddingBottom: 'env(safe-area-inset-bottom, 12px)' }}>
                <input value={commentInput} onChange={e => setCommentInput(e.target.value)} placeholder="说点什么..."
                  className="flex-1 h-10 px-4 bg-transparent outline-none"
                  style={{ background: '#574d72', borderRadius: 20, color: '#f5efe8', fontSize: '13px' }} />
                <motion.button className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ background: commentInput.trim() ? gradients.coral : '#574d72' }} whileTap={{ scale: 0.9 }}>
                  <Send size={14} color={commentInput.trim() ? '#fff' : 'rgba(245,239,232,0.38)'} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* 空状态占位 */
function EmptyState() {
  return (
    <motion.div className="flex flex-col items-center justify-center py-16"
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <div className="relative mb-5">
        <IconBubble size={72} bg="rgba(255,138,128,0.08)" glow glowColor="#FF8A80">
          <IcHeartIcon size={32} color="rgba(255,138,128,0.35)" />
        </IconBubble>
        <motion.div className="absolute -top-1 -right-1" animate={{ y: [0, -4, 0], rotate: [0, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
          <IcSparkle size={14} color="rgba(255,217,61,0.5)" />
        </motion.div>
        <motion.div className="absolute -bottom-1 -left-2" animate={{ y: [0, -3, 0], rotate: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}>
          <IcSparkle size={10} color="rgba(155,126,222,0.4)" />
        </motion.div>
      </div>
      <p style={{ color: 'rgba(245,239,232,0.58)', fontSize: '15px', fontWeight: 500, marginBottom: 4 }}>
        这里还没有内容
      </p>
      <p style={{ color: 'rgba(245,239,232,0.55)', fontSize: '13px' }}>
        成为第一个分享的人吧
      </p>
    </motion.div>
  );
}
