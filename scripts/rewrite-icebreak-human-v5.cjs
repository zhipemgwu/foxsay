const fs = require('fs');
const path = require('path');

const BANK_PATH = path.join(__dirname, '..', 'src', 'data', 'quizBank.ts');
const MARKER = 'export const QUIZ_BANK: Question[] = ';
const END_MARKER = ';\n\nexport function getQuestionById';
const LETTERS = ['A', 'B', 'C', 'D'];

function loadBank() {
  const source = fs.readFileSync(BANK_PATH, 'utf8');
  const start = source.indexOf(MARKER);
  if (start < 0) throw new Error('QUIZ_BANK marker not found');
  const jsonStart = start + MARKER.length;
  const end = source.indexOf(END_MARKER, jsonStart);
  if (end < 0) throw new Error('QUIZ_BANK end marker not found');
  return { bank: JSON.parse(source.slice(jsonStart, end)), tail: source.slice(end + 2) };
}

function makeOption(text, isCorrect, explain = '') {
  const finalExplain = textLen(explain) < 18 ? `${explain}这会让第一次互动变得有压力。` : explain;
  return { text, isCorrect, explain: isCorrect ? '' : `❌ ${finalExplain}` };
}

function textLen(text) {
  return Array.from(String(text || '').replace(/\s+/g, '')).length;
}

function correctLetter(options) {
  return LETTERS[options.findIndex(option => option.isCorrect)] || 'A';
}

function distributeAnswer(options, questionIndex) {
  const targetIndexes = [2, 0, 3, 1];
  const targetIndex = targetIndexes[questionIndex % targetIndexes.length];
  const correctOption = options.find(option => option.isCorrect);
  const wrongOptions = options.filter(option => !option.isCorrect);
  let wrongIndex = 0;
  return options.map((_, index) => {
    if (index === targetIndex) return { ...correctOption };
    return { ...wrongOptions[wrongIndex++] };
  });
}

function makeOverall(item, options) {
  const correct = options.find(option => option.isCorrect);
  return `正确答案：${correctLetter(options)}。这题练的是破冰里的低压力感。最稳的回应是“${correct.text}”它对的地方在于：先借当前场景里的具体细节开口，让对方有话可接，也保留对方不继续聊的空间。破冰不是抢着证明自己会聊天，而是让第一次互动自然、安全、轻一点。`;
}

function topicHint(scenario) {
  if (/咖啡|冷萃|豆子/.test(scenario)) return '咖啡';
  if (/书店|菜谱|旅行书|书名/.test(scenario)) return '书';
  if (/Livehouse|乐队|海报|安可/.test(scenario)) return '演出';
  if (/展|照片|明信片/.test(scenario)) return '展览';
  if (/甜品|聚餐|桌游|朋友/.test(scenario)) return '朋友局';
  if (/羽毛球|球|新手拍/.test(scenario)) return '球局';
  if (/午餐|午饭|米线|餐厅/.test(scenario)) return '午饭';
  if (/办公|打印机|会议|米线/.test(scenario)) return '办公区';
  if (/夜跑|能量饮料/.test(scenario)) return '夜跑';
  if (/猫|头像|猫包/.test(scenario)) return '猫';
  if (/香薰|蜡烛|市集|雪松/.test(scenario)) return '市集';
  if (/便利店|热饮|雨/.test(scenario)) return '热饮';
  if (/讲座|同学|嘉宾/.test(scenario)) return '讲座';
  return '刚才的话题';
}

function thingHint(scenario) {
  if (/咖啡|冷萃|豆子/.test(scenario)) return '好喝的豆子';
  if (/书店|菜谱|旅行书|书名/.test(scenario)) return '书名';
  if (/Livehouse|乐队|海报|安可/.test(scenario)) return '演出消息';
  if (/展|照片|明信片/.test(scenario)) return '展览信息';
  if (/甜品|聚餐|桌游|朋友/.test(scenario)) return '桌游局';
  if (/羽毛球|球|新手拍/.test(scenario)) return '球拍链接';
  if (/午餐|午饭|米线|餐厅/.test(scenario)) return '午饭店';
  if (/办公|打印机|会议/.test(scenario)) return '办公位';
  if (/夜跑|能量饮料/.test(scenario)) return '夜跑路线';
  if (/猫|头像|猫包/.test(scenario)) return '猫照';
  if (/香薰|蜡烛|市集|雪松/.test(scenario)) return '香味';
  if (/便利店|热饮|雨/.test(scenario)) return '热饮';
  if (/讲座|同学|嘉宾/.test(scenario)) return '讲座信息';
  return '刚才那件事';
}

function addInsideSentence(text, addition) {
  if (text.includes(addition)) return text;
  if (/[。！？!?]$/.test(text)) return text.replace(/([。！？!?])$/, `${addition}$1`);
  return `${text}${addition}`;
}

function flawedContinuation(question, option, round) {
  const topic = topicHint(question.scenario);
  const thing = thingHint(question.scenario);
  const text = option.text;
  const pools = [];
  if (/微信|加个|留一下/.test(text)) pools.push([`，以后看到新的${thing}也能互相发`, `，刚才聊到一半断了我觉得有点可惜`, `，下次发现新的也可以互相推荐`]);
  if (/别走|别急|等一下|等会儿/.test(text)) pools.push([`，我还有一个细节想问清楚`, `，刚才那个点我还没听你讲完`, `，我还想听你再说两句`]);
  if (/到家|担心|安全/.test(text)) pools.push([`，虽然刚认识但我还是想确认一下`, `，刚才人多我总觉得还是问一句比较好`, `，不问一下我会一直惦记着`]);
  if (/现在才回|这么晚|以为|等了/.test(text)) pools.push([`，所以刚才有点不知道该不该再发`, `，我还在想是不是自己开场太突然`, `，刚才这几个小时我确实有点没底`]);
  if (/晚点|还想问|还想听|还想知道/.test(text)) pools.push([`，刚才那几个点我还没听全`, `，我怕晚点就接不上了`, `，这会儿刚好还能接着说`]);
  if (/下次|以后|带你|约你|一起/.test(text)) pools.push([`，刚才聊到这里还挺有意思`, `，不然只聊这一次有点可惜`, `，也算是给今天这个偶遇留个后续`]);
  if (/我来吧|我帮|我可以|我给你/.test(text)) pools.push([`，这个我刚才已经研究明白了`, `，省得你继续在这里耗时间`, `，我处理这个还算比较快`]);
  if (/你平时|经常|一般|一个人/.test(text)) pools.push([`，我只是想大概了解一下你的习惯`, `，这样以后聊起来也不至于没方向`, `，刚才听你说完我有点好奇`]);
  if (/气质|特别|品味|温柔|可爱|身材|眼缘/.test(text)) pools.push([`，所以刚才才会想多说两句`, `，我不是随便这么夸人的`, `，这种感觉还挺少见的`]);
  if (!pools.length) pools.push([`，刚才聊到这里还挺有意思`, `，我怕晚点就接不上了`, `，所以才会多问一句`]);
  const flat = pools.flat();
  return flat[round % flat.length];
}

function balanceIcebreakOptions(question) {
  const options = question.options.map(option => ({ ...option }));
  const added = new Map();
  for (let round = 0; round < 10; round++) {
    const lengths = options.map(option => textLen(option.text));
    const correctIndex = options.findIndex(option => option.isCorrect);
    const correctLen = lengths[correctIndex];
    const wrongIndexes = options.map((option, index) => option.isCorrect ? -1 : index).filter(index => index >= 0);
    const wrongLens = wrongIndexes.map(index => lengths[index]);
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    const wrongMax = Math.max(...wrongLens);
    if (correctLen - wrongMax < 12 && maxLen / Math.max(1, minLen) < 1.8 && maxLen - minLen < 35) break;
    let targetIndex = wrongIndexes[wrongLens.indexOf(Math.max(...wrongLens))];
    if (maxLen / Math.max(1, minLen) >= 1.8 || maxLen - minLen >= 35) {
      targetIndex = lengths.indexOf(minLen);
    }
    const count = added.get(targetIndex) || 0;
    if (count >= 2) break;
    options[targetIndex].text = addInsideSentence(options[targetIndex].text, flawedContinuation(question, options[targetIndex], round + targetIndex));
    added.set(targetIndex, count + 1);
  }
  return { ...question, options };
}

const questionItems = [
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '咖啡店排队时，她看着菜单犹豫很久，店员刚推荐了一杯桂花冷萃；你也正好没喝过这一款',
    prompt: '你想自然搭第一句话，哪句最不冒犯？',
    options: [
      makeOption('我也在纠结这杯桂花冷萃，刚才店员说得挺认真，你之前喝过吗？', true),
      makeOption('刚才排队就注意到你了，感觉你气质挺特别，方便认识一下吗？', false, '第一句直接落到“认识你”，目的感太强，容易让对方先防备。'),
      makeOption('你一个人来买咖啡吗，要不要等会儿一起坐一会儿？', false, '刚开口就问独处和邀约，越过了陌生人的安全距离。'),
      makeOption('这杯我觉得不太适合你，我平时喝咖啡还挺懂的', false, '上来就评价和指导，会显得自以为是，不像轻松破冰。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '书店料理区，你们同时拿起同一本家常菜谱，她笑了一下把书让给了你',
    prompt: '第一句话怎么说更像自然聊天？',
    options: [
      makeOption('这本看来挺抢手，我也是被封面那道番茄炖牛腩吸引过来的', true),
      makeOption('你也喜欢做饭啊，那你平时一个人住还是跟家里人住？', false, '从菜谱直接跳到居住情况，问题太私人，像查户口。'),
      makeOption('这么巧拿同一本书，感觉我们应该挺有缘的', false, '缘分感上得太快，会把轻场景聊成关系暗示。'),
      makeOption('你要是想学做菜，我可以教你几道比较拿手的', false, '还没建立互动就摆出指导姿态，容易显得油。'),
    ],
  },
  {
    difficulty: 3,
    angle: '上前第一句',
    scenario: 'Livehouse 散场后，周边摊前只剩几个人，她一直在比较两枚乐队徽章',
    prompt: '你想搭一句话，哪句更自然？',
    options: [
      makeOption('这两枚我也看了半天，左边那枚更像今晚安可那首歌的感觉', true),
      makeOption('刚才演出的时候我就看到你了，你也站前排吧？', false, '强调自己早就看到她，会让人有被盯着的感觉。'),
      makeOption('你喜欢这个乐队多久了，要不要加个微信以后一起看？', false, '第一句就要联系方式，目的感太满。'),
      makeOption('一个人来看 Livehouse 还挺酷的，你经常自己来吗？', false, '把焦点放到对方是不是一个人，安全感不够。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '摄影展出口，她在明信片墙前停住，手里拿着一张雾气很重的街景照片',
    prompt: '哪句开场最像顺着现场聊？',
    options: [
      makeOption('你拿的这张雾气街景我也喜欢，像电影停在一个很安静的镜头里', true),
      makeOption('你审美还挺特别的，一看就不是普通女生', false, '夸法太用力，还带比较感，会显得不真诚。'),
      makeOption('你看展一般都一个人来吗，我觉得你挺适合聊艺术的', false, '一上来问习惯和身份，话题太大也太私人。'),
      makeOption('这张其实构图一般，我推荐你看旁边那张', false, '开口就否定对方选择，会破坏轻松感。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '朋友聚餐刚开场，她坐在甜品旁边，一边看菜单一边问哪道不太甜',
    prompt: '你要加入聊天，哪句话最稳？',
    options: [
      makeOption('我刚问过店员，柠檬挞会比提拉米苏清爽一点，你如果怕甜可以先看那个', true),
      makeOption('女生不是都喜欢甜的吗，你怎么还怕甜？', false, '用刻板印象开玩笑，容易让人不舒服。'),
      makeOption('你坐这里挺安静的，是不是跟大家都不太熟？', false, '直接点破社交状态，会让对方尴尬。'),
      makeOption('我也不爱太甜，我们口味应该挺像的', false, '从一个偏好直接拉近关系，显得有点急。'),
    ],
  },
  {
    difficulty: 3,
    angle: '上前第一句',
    scenario: '羽毛球新手局换场休息，她刚接丢一个球，自己笑着说反应慢半拍',
    prompt: '哪句接话既轻松又不冒犯？',
    options: [
      makeOption('刚才那个球我也会漏，新手局能接到一半就很不错了', true),
      makeOption('你确实反应有点慢，不过多练几次就好了', false, '虽然像建议，但先确认她慢，会让玩笑变成评价。'),
      makeOption('你这样打还挺可爱的，要不要下次跟我一组？', false, '把运动场景突然转成暧昧评价，容易显得油。'),
      makeOption('你以前是不是很少运动，所以接球不太稳？', false, '追问能力来源会让对方有被评判的感觉。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '共享办公区打印机卡纸，她站在机器前翻说明，你刚好也碰到过同样问题',
    prompt: '你想帮忙开口，哪句更舒服？',
    options: [
      makeOption('这台机器刚才也卡过我一次，要不要我帮你把纸盒抽出来试试？', true),
      makeOption('你是不是不会用这个，我来吧', false, '语气像否定能力，容易让好意变成冒犯。'),
      makeOption('我观察你弄半天了，其实这里有个小技巧', false, '“观察你弄半天”会让人不自在。'),
      makeOption('我帮你弄好，你请我喝杯咖啡就行', false, '第一次互动就要回报，会让帮忙带上交易感。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '夜跑活动结束后，她在补给桌前研究两种能量饮料，你也刚跑完同一条路线',
    prompt: '哪句开场最轻松？',
    options: [
      makeOption('我刚拿了柠檬味，喝起来没那么甜，你如果纠结可以避开葡萄味', true),
      makeOption('刚才跑步的时候我注意到你配速挺稳的，加个好友交流一下？', false, '直接说注意她配速并要好友，容易显得目的明确。'),
      makeOption('你看起来不像经常跑步的人，今天跑完还好吗？', false, '听起来像评价身体状态，不适合破冰。'),
      makeOption('你一个人来夜跑吗，晚上回去安全吗？', false, '关心来得太早，会让关系越级。'),
    ],
  },
  {
    difficulty: 3,
    angle: '上前第一句',
    scenario: '宠物店门口，她抱着猫包等车，猫在里面一直扒拉拉链',
    prompt: '你想自然开口，哪句最好？',
    options: [
      makeOption('这只猫看起来很想亲自决定回家的路线，这一路应该挺热闹的吧？', true),
      makeOption('你家猫真可爱，可以让我摸一下吗？', false, '陌生人直接提出摸宠物，边界太近。'),
      makeOption('养猫的女生一般都挺温柔的，我猜得准吗？', false, '把宠物和性格绑定，像套路夸人。'),
      makeOption('你一个人带猫出门挺辛苦的，要不要我陪你等车？', false, '刚开口就提出陪伴，会给对方压力。'),
    ],
  },
  {
    difficulty: 2,
    angle: '上前第一句',
    scenario: '手作市集香薰摊前，她反复闻两款蜡烛，摊主也在等她决定',
    prompt: '第一句话怎么说更自然？',
    options: [
      makeOption('右边木质味更明显，左边更像洗完澡的味道', true),
      makeOption('你选东西好认真，感觉生活应该挺精致的', false, '评价生活方式太快，会显得像刻意夸人。'),
      makeOption('要不我帮你选吧，我对香味还挺有判断的', false, '还没被邀请就替对方决定，压迫感太强。'),
      makeOption('你也喜欢香薰啊，那我们兴趣还挺像的', false, '从一个摊位选择直接拉相似感，有点急。'),
    ],
  },

  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '咖啡店里，她听完你的开场后说“我也是第一次喝这家的冷萃”',
    prompt: '她已经回了一句，你下一句怎么接更自然？',
    options: [
      makeOption('那我们都算盲选了，等会儿谁先踩雷谁先提醒对方', true),
      makeOption('那你平时都喜欢喝什么，工作日一般几点来这边？', false, '连续问偏好和行程，刚破冰就像查资料。'),
      makeOption('这么巧，我们连第一次喝都一样，真的有点缘分', false, '把巧合上升成缘分太快，轻松感会变重。'),
      makeOption('我对咖啡其实懂一点，你可以听我的推荐', false, '马上展示自己懂，会让聊天变成单方面指导。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '书店里，她回你“我就是被封面骗过来的，内容还没看”',
    prompt: '怎么接能让话题继续，又不像硬聊？',
    options: [
      makeOption('那这个封面算赢了，我刚才也是先被那张餐桌照片骗停下来的', true),
      makeOption('那你平时看书多吗，一个月能看几本？', false, '问题突然变成阅读考核，对方要费力回答。'),
      makeOption('我也是，看来我们审美还挺一致的', false, '共鸣可以有，但马上说一致显得拉近太快。'),
      makeOption('封面只是营销，真正好书还是要看内容', false, '上来纠正对方的轻松说法，会让气氛变硬。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回了一句后的接话',
    scenario: 'Livehouse 门口，她说“刚才安可那首比录音版好听好多”',
    prompt: '你怎么接更有来有回？',
    options: [
      makeOption('对，现场那个鼓点一出来我也愣了一下，录音版反而没那么冲', true),
      makeOption('你喜欢这首啊，那你应该也会喜欢我歌单里的几首', false, '太快把话题拉到自己身上，对方刚给的现场感被打断。'),
      makeOption('你听得还挺细的，感觉不像普通粉丝', false, '夸法带比较和评价，容易显得刻意。'),
      makeOption('那下次他们演出我们一起去吧，别错过', false, '第二句就约下次，推进太快。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '羽毛球馆休息区，她说“我真的老是接不到后场球”',
    prompt: '下一句怎么接不会像教练上身？',
    options: [
      makeOption('后场球对新手太不友好了，我刚才也有两个球是靠运气碰到的', true),
      makeOption('你就是步子没跟上，下次我教你怎么跑位', false, '马上纠正动作会让聊天变成指导。'),
      makeOption('没事，女生力量小一点也正常', false, '用性别解释能力，很容易冒犯。'),
      makeOption('你多和我打一打就会进步很快', false, '把帮助和自己绑定，显得有目的。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回了一句后的接话',
    scenario: '展览长椅旁，她说“这场展有点安静，走着走着会放慢下来”',
    prompt: '怎么接最贴着她的话？',
    options: [
      makeOption('是，会让人不太想急着拍照，反而想把每张图多看几秒', true),
      makeOption('你说话还挺有文艺感的，平时是不是也很感性？', false, '把对方一句感受上升成性格判断，容易显得油。'),
      makeOption('我觉得这展一般，主要是灯光做得还行', false, '直接否定她的感受，会让刚打开的话题变冷。'),
      makeOption('那你现在心情是不是也挺安静的？', false, '追问内心状态太快，关系还没到那一步。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '便利店门口，她说“我只是进来躲雨，结果买了杯热饮”',
    prompt: '你怎么接最像顺着聊天？',
    options: [
      makeOption('便利店就是这样，本来躲雨，最后总会买点东西', true),
      makeOption('那你平时下雨也会来这家便利店吗？', false, '从一句随口分享追问习惯，像在收集信息。'),
      makeOption('我们都被雨困在这里，还挺像电影情节的', false, '浪漫化太快，会让普通场景变尴尬。'),
      makeOption('我看你这杯挺好喝的，给我尝一口？', false, '刚认识就要尝对方饮料，边界感很差。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '共享办公区，她笑着说“我今天就是来找插座的，不像来工作的”',
    prompt: '下一句怎么接自然？',
    options: [
      makeOption('懂，这个座位最值钱的不是桌子，是墙上那个插孔', true),
      makeOption('你平时都在哪儿办公，可以互相推荐几个地方', false, '刚聊一句就索要日常地点，容易太快。'),
      makeOption('那你工作应该挺自由的吧，真羡慕', false, '直接推测工作状态，话题跳得太远。'),
      makeOption('我旁边还有空位，你可以一直坐我边上', false, '“一直坐我边上”压力太明显，容易让人不适。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '朋友聚会里，她说“我也是被朋友临时叫来的，很多人都不认识”',
    prompt: '你怎么接既轻松又不尴尬？',
    options: [
      makeOption('那我们都算临时成员，先从认清桌上菜开始', true),
      makeOption('那太好了，我们两个不熟的人可以单独聊', false, '把共同陌生感变成单独绑定，会让对方有压力。'),
      makeOption('你是不是比较慢热，所以才坐这边？', false, '直接判断性格，容易让对方被分析。'),
      makeOption('我可以带你认识大家，你跟着我就行', false, '好意太强势，像在接管对方社交。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回了一句后的接话',
    scenario: '手作市集摊位前，她说“这个香味有点像小时候家里的木柜”',
    prompt: '怎么接更有真实感？',
    options: [
      makeOption('你这么一说还真像，那种旧木头混一点干净衣服的味道', true),
      makeOption('你形容得好特别，感觉你应该是很有故事的人', false, '从一个香味联想到“很有故事”，夸得太用力。'),
      makeOption('那你小时候家里是什么样，可以讲讲吗？', false, '马上追问童年细节，隐私进得太快。'),
      makeOption('我就说这款适合你，你的气质就是这种木质调', false, '把香味和气质硬绑，像模板话术。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回了一句后的接话',
    scenario: '朋友把你们拉进同一个群，她回你“头像那只猫不是我家的，是楼下流浪猫”',
    prompt: '你下一句怎么接比较自然？',
    options: [
      makeOption('难怪它表情这么有江湖气，感觉已经把楼下那片管理明白了', true),
      makeOption('那你平时经常喂它吗，住在哪个小区附近？', false, '从猫直接问住处附近，边界感不够。'),
      makeOption('你这么有爱心，应该是很温柔的人吧', false, '用猫快速推断性格，显得套路。'),
      makeOption('那下次你带我去看看它吧，我也想认识一下这位楼下管理员', false, '刚加微信就提出线下同行，推进太快。'),
    ],
  },

  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '咖啡店取餐口，你们聊了几句酸味豆子，她的号码快被叫到了',
    prompt: '你想自然收尾，哪句最好？',
    options: [
      makeOption('你那杯快好了，我先不耽误你，回头如果踩到好喝的酸味豆子可以互相推荐', true),
      makeOption('那我们加个微信吧，我觉得我们刚才聊咖啡还挺合拍', false, '直接把短聊转成要微信，缺少轻量理由和退路。'),
      makeOption('你先别走，我还想问你平时都去哪家咖啡店', false, '把对方留下来继续回答，现场压力会变高。'),
      makeOption('你把微信给我，我以后把咖啡清单发你', false, '语气像索取，主动权全压到对方身上。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '书店收银台旁，你们聊了几句旅行书，她准备去结账',
    prompt: '怎样收尾最舒服？',
    options: [
      makeOption('你先去结账吧，那本海岛游记我记下了，下次看到类似的可以互相丢书名', true),
      makeOption('那加个微信吧，我之后可以带你去几家不错的书店', false, '从几句书聊直接提出带她去，关系推进太快。'),
      makeOption('你别急着走啊，我还想听你讲讲喜欢什么旅行方式', false, '把收尾变成挽留，会让对方需要拒绝你。'),
      makeOption('你把微信留一下，我整理几本旅行书单发你，之后也方便继续聊', false, '“留一下”像索取，缺少选择感。'),
    ],
  },
  {
    difficulty: 3,
    angle: '聊了两分钟后的收尾',
    scenario: 'Livehouse 周边摊前，你们聊了两分钟乐队海报，她朋友在门口叫她',
    prompt: '你想留下自然后续，哪句最好？',
    options: [
      makeOption('你朋友在等你，我不拖你了，刚才那张巡演海报如果我找到高清版可以发你', true),
      makeOption('那加微信吧，下次演出我们可以一起站前排', false, '下次一起看演出太快，刚聊两分钟会有压力。'),
      makeOption('你朋友等一下也没关系，我们再聊会儿这张海报', false, '忽视她朋友在等，会显得只顾自己聊天。'),
      makeOption('你把微信给我，我以后有票源可以叫你，下次演出还能一起抢前排', false, '用资源换联系方式，目的感太明显。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '桌游局中场休息，你们刚把规则聊顺，她准备回到另一桌',
    prompt: '怎么收尾不突兀？',
    options: [
      makeOption('你先回那桌吧，刚才那个规则我总算懂了，下次开局前我可以少拖后腿', true),
      makeOption('要不你换到我们这桌吧，我觉得跟你聊规则更有意思', false, '把对方从原本社交位置拉走，压力太强。'),
      makeOption('那加个微信，以后桌游局我都叫你', false, '后续承诺太重，短聊还没到这个程度。'),
      makeOption('你别走，我还有几个规则想问你', false, '用问题拖住对方，会让互动变成负担。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '摄影展明信片区，你们聊了几张照片，她准备去找同伴',
    prompt: '哪句收尾更有分寸？',
    options: [
      makeOption('你先去找朋友吧，那张蓝色楼梯我会再回去看一眼', true),
      makeOption('我们审美挺像的，加个微信以后一起看展吧', false, '把一次审美共鸣直接变成以后一起看展，推进偏快。'),
      makeOption('你朋友应该不急吧，我们再把剩下几张也聊完', false, '无视她要去找同伴，会让人不舒服。'),
      makeOption('你把微信给我，我以后给你发展览信息', false, '听起来像用信息换联系方式，缺少自然选择。'),
    ],
  },
  {
    difficulty: 3,
    angle: '聊了两分钟后的收尾',
    scenario: '共享办公区午休时，你们聊了附近午餐，她下午会议快开始了',
    prompt: '你想结束得自然，哪句更好？',
    options: [
      makeOption('你会议快到了，我不打扰了，刚才那家米线我午休去试试，踩雷再回来报备', true),
      makeOption('那加个微信吧，以后中午可以一起吃饭，附近好吃的店我还挺熟', false, '从附近午餐直接到一起吃饭，节奏太快。'),
      makeOption('你晚点会议结束再找我，我还想问几家店，附近还有几家我刚才没听清', false, '把后续责任交给对方，像安排她继续聊天。'),
      makeOption('我给你发几个餐厅，你先把微信给我，附近午饭我还挺会找的', false, '目的落在索取微信，容易让前面聊天变味。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '羽毛球馆门口，你们聊了几句新手拍，她约的车快到了',
    prompt: '怎么收尾最不油？',
    options: [
      makeOption('你车快到了，我先不耽误你，刚才你说的那款新手拍我回去搜一下', true),
      makeOption('那我们加个微信，下次我带你练后场球', false, '像借教学要联系方式，容易有目的感。'),
      makeOption('车到了也可以等一下，我再给你讲讲拍子怎么选', false, '把自己的输出放在她时间前面，压力很大。'),
      makeOption('你把微信给我，我把拍子链接发你', false, '语气像交换条件，不够自然。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '手作市集香薰摊前，你们聊了几句木质香，她准备去下一个摊位',
    prompt: '哪句收尾更像真人？',
    options: [
      makeOption('你先逛下一摊吧，刚才那款雪松味我应该会买，回头闻晕了再怪摊主', true),
      makeOption('我们品味挺像的，要不加个微信以后一起逛市集', false, '把一次香味偏好上升成以后一起逛，关系推进太快。'),
      makeOption('你先别走，我还想知道你家里都用什么香', false, '追问私人生活细节，容易不适。'),
      makeOption('你把微信给我，我之后给你推荐香薰', false, '“给我微信”太直，缺少轻松退路。'),
    ],
  },
  {
    difficulty: 3,
    angle: '聊了两分钟后的收尾',
    scenario: '雨天便利店门口，雨小了一点，你们刚聊完热饮口味，她准备往地铁口走',
    prompt: '你想自然收尾，哪句最好？',
    options: [
      makeOption('雨小了你先走吧，我也去地铁口，那杯姜茶下次应该会再买', true),
      makeOption('那加个微信吧，我觉得我们刚才等雨还挺合拍的', false, '把等雨短聊直接变成要微信，目的感太明显。'),
      makeOption('你先别急着走，我们可以再聊聊便利店还有什么好喝的', false, '雨小了还挽留对方，会让她承担拒绝压力。'),
      makeOption('你把微信给我，我以后给你推荐附近小店', false, '用推荐换联系方式，听起来像套路。'),
    ],
  },
  {
    difficulty: 2,
    angle: '聊了两分钟后的收尾',
    scenario: '校园讲座散场后，你们聊了几句嘉宾提到的书，她要去找同学汇合',
    prompt: '哪句收尾更自然？',
    options: [
      makeOption('你先去找同学吧，刚才那本书名我记下了，回去看完再判断嘉宾有没有夸张', true),
      makeOption('那加个微信吧，以后讲座我们可以一起听', false, '从一次讲座直接安排以后一起听，节奏偏快。'),
      makeOption('你同学等一下没事，我还想听你怎么看嘉宾观点', false, '忽视她的原安排，会显得不体贴。'),
      makeOption('把微信给我，我整理讲座笔记发你', false, '像用笔记换联系方式，目的感太直。'),
    ],
  },

  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '朋友把你们拉进同一个微信群，你看到她头像是一只趴在键盘上的橘猫',
    prompt: '刚加微信，第一条怎么发更自然？',
    options: [
      makeOption('我是群里新加你的那个，你头像这只橘猫像键盘管理员', true),
      makeOption('终于加上你了，刚才在群里就觉得你挺特别', false, '刚加上就夸特别，情绪浓度太高。'),
      makeOption('你现在方便聊两句吗，我想认识你一下', false, '第一条就请求聊天，压力直接给到对方。'),
      makeOption('可以发张自拍看看吗，我怕只看头像认不出你', false, '刚加微信要自拍，边界感很差。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '咖啡店里你们交换了豆子名字，分开后刚加上微信',
    prompt: '第一条消息怎么发不突兀？',
    options: [
      makeOption('我是刚才在咖啡店排队纠结冷萃的那个，已经把桂花那杯列入下次尝试名单', true),
      makeOption('刚才见到你就觉得很有眼缘，所以还是想加你聊聊', false, '把开场落在眼缘和想聊，目的感太明显。'),
      makeOption('你到家了吗，刚认识但我还是有点担心', false, '关系还浅就关心到家，容易越界。'),
      makeOption('以后你喝咖啡可以问我，我懂的还挺多', false, '第一条就摆出专家姿态，不像平等聊天。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '书店里你们聊过一本菜谱，临走前互相加了微信',
    prompt: '刚加上后第一条怎么发？',
    options: [
      makeOption('我是刚才书店里一起抢菜谱的那个，回去路上我已经开始想番茄炖牛腩了', true),
      makeOption('终于加上你了，刚才就觉得你跟别人不太一样，回去路上还一直有点惦记', false, '夸得太泛太重，刚加微信容易让对方后撤。'),
      makeOption('你平时都自己做饭吗，住得离书店远不远？', false, '第一条就问生活和住处，隐私进得太快。'),
      makeOption('下次我可以教你做几道菜，你肯定会喜欢', false, '还没建立熟悉感就安排下次，推进太快。'),
    ],
  },
  {
    difficulty: 3,
    angle: '刚加微信第一句',
    scenario: 'Livehouse 散场后，你们因为同一张巡演海报交换了微信',
    prompt: '第一条消息怎么发更像延续刚才的话题？',
    options: [
      makeOption('我是周边摊前聊海报的那个，那张配色比 T 恤好看', true),
      makeOption('刚才就想说你很有气质，现场灯光下特别明显', false, '突然转向外貌夸奖，会让话题变味。'),
      makeOption('你安全到家了吗，今晚人多我有点担心你', false, '刚认识就用保护式关心，关系越级。'),
      makeOption('下次演出我叫你，我们可以一起站前排', false, '第一条就安排下次一起看，压力过大。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '朋友生日局结束后，你们因为桌游规则加了微信',
    prompt: '第一条怎么发比较自然？',
    options: [
      makeOption('我是刚才没搞懂规则的那个，回家路上终于反应过来了', true),
      makeOption('今天见到你挺开心的，希望以后还能多见面', false, '情绪表达太满，刚加微信会显得急。'),
      makeOption('你到家了吗，我刚才一直想问但没好意思', false, '刚认识就持续关心到家，关系感太重。'),
      makeOption('下次桌游局我只想跟你一队，感觉会很有默契', false, '把一次朋友局上升成默契，容易油。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '健身房拉伸区，你们因为同一个训练视频聊了两句后加了微信',
    prompt: '第一条消息怎样不尴尬？',
    options: [
      makeOption('我是刚才拉伸区跟着同一个视频乱练的那个，那个肩颈动作比看起来难多了', true),
      makeOption('刚才看你练得挺认真，感觉你身材管理应该很好', false, '评价身材会让健身场景变得不安全。'),
      makeOption('以后我可以带你练，进步会快很多', false, '上来就指导和安排，压迫感强。'),
      makeOption('你平时都几点去健身房，我可以配合你时间', false, '第一条就问固定时间并配合，目的感太明显。'),
    ],
  },
  {
    difficulty: 3,
    angle: '刚加微信第一句',
    scenario: '共享办公区午休时，你们因为附近餐厅聊了几句，离开前加了微信',
    prompt: '刚加微信第一句怎么发？',
    options: [
      makeOption('我是刚才共享办公区讨论午饭的那个，我已经把你说的米线店标星了', true),
      makeOption('今天跟你聊天很舒服，感觉我们挺聊得来', false, '第一条就给关系评价，会让对方有压力。'),
      makeOption('你明天还来这边办公吗，我可以给你占座', false, '刚加微信就打听行程并提供占座，太快。'),
      makeOption('你到家了吗，今天工作应该挺累吧', false, '关系还浅，关心工作疲惫容易越界。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '摄影展出口，你们因为一张蓝色楼梯照片聊过，之后加了微信',
    prompt: '第一条发什么最像自然延续？',
    options: [
      makeOption('我是刚才在蓝色楼梯照片前聊了几句的那个，我后来又回去看了一遍那张', true),
      makeOption('刚才看你看展的样子挺安静，感觉你很特别', false, '把对方“看展的样子”拿来评价，会显得观察过度。'),
      makeOption('下次有展我约你，我们可以一起慢慢看，我还挺想听你怎么选照片', false, '第一条就约下次，压力明显。'),
      makeOption('你平时是不是经常一个人看展，还是更喜欢跟朋友一起慢慢逛？', false, '开局就问个人习惯，容易像查户口。'),
    ],
  },
  {
    difficulty: 2,
    angle: '刚加微信第一句',
    scenario: '羽毛球新手局结束，你们因为新手拍选择互相加了微信',
    prompt: '第一条怎么发更自然？',
    options: [
      makeOption('我是刚才一起研究新手拍的那个，我回去看了眼价格，果然比我想象中复杂', true),
      makeOption('以后我可以陪你练球，你会进步很快', false, '把自己放进她的练习计划里，推进太快。'),
      makeOption('刚才看你打球挺可爱的，下次还想看', false, '从运动表现转成外貌式评价，容易油。'),
      makeOption('你一般什么时候打球，我以后也那个时间去', false, '直接跟随对方时间，会让人警觉。'),
    ],
  },
  {
    difficulty: 3,
    angle: '刚加微信第一句',
    scenario: '手作市集上，你们因为同一款雪松蜡烛聊过，临走前加了微信',
    prompt: '第一条消息怎么发不生硬？',
    options: [
      makeOption('我是刚才雪松摊前那个，最后还是被木头味说服了', true),
      makeOption('刚才就觉得你品味很好，想多了解一下你', false, '“想多了解你”太直，容易让破冰变成搭讪目的。'),
      makeOption('你家里是不是也布置得很有氛围感？', false, '一上来想象对方家里，边界感不够。'),
      makeOption('下次市集我们可以一起逛，你帮我挑香味', false, '刚加微信就安排下次同行，节奏偏快。'),
    ],
  },

  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '咖啡店加微信后，她隔了几个小时才回“刚才手机没电了”',
    prompt: '你怎么接最不尴尬？',
    options: [
      makeOption('没事，我刚才也在忙，那杯桂花冷萃我喝完了，香味比甜味更明显', true),
      makeOption('我还以为你是客气一下才加的，差点以为自己想多了', false, '把迟回解释成不想理你，会让对方背上安抚压力。'),
      makeOption('你现在才回啊，我刚才还一直在想你是不是不准备聊了', false, '刚认识就强调等待，会显得需求感太强。'),
      makeOption('没关系，你忙你的，我就不打扰你了', false, '受伤式退场会把聊天直接断掉。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '书店加微信后，她晚上才回“刚到家，书也买了”',
    prompt: '下一句怎么接最自然？',
    options: [
      makeOption('买了就好，我后来也翻了那本菜谱，番茄炖牛腩那页确实很会骗人', true),
      makeOption('你怎么这么晚才回，我还以为你忘了我是谁', false, '让对方为迟回解释，容易尴尬。'),
      makeOption('到家就好，我刚才其实一直有点担心', false, '刚加微信就一直担心，关系越级。'),
      makeOption('那你明天做给我看看吧，我还挺想知道这本菜谱到底靠不靠谱', false, '把轻松话题变成要求，对方会有压力。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回复很慢',
    scenario: 'Livehouse 散场后，你们加了微信，她隔了几个小时才回“刚才路上信号很差”',
    prompt: '怎么把聊天接回来最自然？',
    options: [
      makeOption('没事，我刚才也在回味安可，那首现场版比我想象中还上头', true),
      makeOption('你过几个小时才回，我还以为你对刚才聊天没兴趣了', false, '把迟回解释成没兴趣，会让对方背上安抚压力。'),
      makeOption('要是现在不忙，我们可以把刚才那张海报接着说完', false, '刚恢复消息就索要继续聊，节奏还是有点黏。'),
      makeOption('哈哈你不会已经忘了我是刚才周边摊前那个人吧', false, '用玩笑催对方记住你，仍然给了她压力。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回复很慢',
    scenario: '雨天便利店门口加微信后，她隔了几个小时才回“刚才一路都在躲雨”',
    prompt: '怎么接既自然又不黏？',
    options: [
      makeOption('没事，我后来也被雨卡了一会儿，那杯热饮挺救场', true),
      makeOption('我只是想确认你是不是到家了，刚才雨挺大的', false, '关心和查状态混在一起，会让刚认识的人有压力。'),
      makeOption('要是现在不忙，我还想问问你那杯热饮到底甜不甜', false, '刚恢复消息就要求继续聊，会让轻松感变重。'),
      makeOption('哈哈你不会已经忘了我是便利店门口那个人吧', false, '让对方证明没忘，会增加尴尬感。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '羽毛球新手局后，她晚上才回“刚才回去路上太累了”',
    prompt: '怎么接最舒服？',
    options: [
      makeOption('正常，今天后场球太折磨了，我回去路上也觉得腿不是自己的', true),
      makeOption('你现在才回，我还以为你不想继续聊', false, '把迟回和态度绑定，会让对方马上防御。'),
      makeOption('那你早点休息吧，我不打扰了', false, '太快退场，话题没有被自然接住。'),
      makeOption('累的话下次我带你练，体力会好很多', false, '又回到指导姿态，不像平等聊天。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '摄影展加微信后，她过了很久才回“刚才跟朋友吃饭去了”',
    prompt: '你怎么接更松弛？',
    options: [
      makeOption('刚好，我后来把那张蓝色楼梯又看了一遍，越看越像电影空镜', true),
      makeOption('你是不是不太想聊，所以才这么晚回', false, '直接猜测她不想聊，会让对方需要解释。'),
      makeOption('没事，那我就不继续打扰你了', false, '受伤式客气会让聊天很快断掉。'),
      makeOption('吃饭怎么不叫我，下次可以一起', false, '玩笑过界，刚认识不适合插入她的社交。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回复很慢',
    scenario: '共享办公区加微信后，她晚上回“下午会议开到现在”',
    prompt: '怎么接不会显得追问？',
    options: [
      makeOption('辛苦了，今天那家米线我真去试了，汤比名字看起来靠谱', true),
      makeOption('你怎么这么忙，那以后是不是很难约到你', false, '从忙直接跳到约她，会显得目的太明显。'),
      makeOption('我还以为你下午不想回我了', false, '把迟回变成态度问题，会给对方压力。'),
      makeOption('那你现在有空了吗，我们可以继续聊午饭', false, '马上索要继续聊天时间，节奏不够松。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '朋友聚会加微信后，她第二天才回“昨天回去直接睡着了”',
    prompt: '怎么接比较自然？',
    options: [
      makeOption('能理解，昨天那桌信息量太大了，我回去还在想谁赢了桌游', true),
      makeOption('我还以为你只是礼貌加一下，差点不敢发第二句', false, '把自己的不安交给对方处理，会让聊天变重。'),
      makeOption('你睡得还好吗，我昨晚其实有点担心你', false, '刚认识就担心睡眠，关系越级。'),
      makeOption('那今天有空吗，我们可以单独出来聊聊', false, '从朋友局刚加微信直接单独约，推进太快。'),
    ],
  },
  {
    difficulty: 2,
    angle: '对方回复很慢',
    scenario: '微信群加好友后，她隔了很久才回“刚才一直在开会”',
    prompt: '怎么接头像猫的话题更自然？',
    options: [
      makeOption('没事，我刚才又看了眼你头像，那只猫的表情很像在主持会议', true),
      makeOption('你现在才回，我还以为你不想理群里新加的人', false, '把迟回解释成不想理你，会让对方尴尬。'),
      makeOption('开会辛苦了，你公司平时都这么忙吗？', false, '刚加微信就问工作强度，话题偏私人。'),
      makeOption('那你现在方便好好聊一会儿吗？', false, '直接索要聊天时间，压力明显。'),
    ],
  },
  {
    difficulty: 3,
    angle: '对方回复很慢',
    scenario: '手作市集加微信后，她晚上才回“刚才一路拿东西，没看手机”',
    prompt: '你怎么接最不刻意？',
    options: [
      makeOption('没事，我后来也拎着那袋蜡烛一路后悔，早知道少闻两款就不会上头', true),
      makeOption('我等你回消息等了挺久，还以为你忘了', false, '强调等待会显得需求感很重。'),
      makeOption('那你买了哪些东西，拍给我看看吧', false, '刚认识就要照片式分享，索取感偏强。'),
      makeOption('你要是不忙，我们可以继续聊香薰', false, '像模板式续聊邀请，不够具体也不够松弛。'),
    ],
  },
];

function buildQuestions() {
  return questionItems.map((item, index) => {
    const options = item.options.map(option => ({ ...option }));
    const question = {
      id: `q-icebreak-${String(index + 1).padStart(3, '0')}`,
      category: 'icebreak',
      difficulty: item.difficulty,
      type: 'single',
      scenario: `${item.scenario}；${item.angle}`,
      prompt: `${item.prompt}\n当前情境：${item.scenario}\n训练角度：${item.angle}`,
      options,
      overallExplain: '',
      tags: ['破冰搭讪', item.angle],
      relatedLevelKid: 'L001',
    };
    const balanced = balanceIcebreakOptions(question);
    const distributedOptions = distributeAnswer(balanced.options, index);
    return {
      ...balanced,
      options: distributedOptions,
      overallExplain: makeOverall(item, distributedOptions),
    };
  });
}

function validate(questions) {
  const errors = [];
  const scenarios = new Set();
  const optionTexts = new Set();
  const answerCounts = [0, 0, 0, 0];
  const banned = /我主要是想借刚才这个话题|我就是顺口问一句|不耽误你聊|顺着雨天躲雨|雨天躲雨|我有点不知道怎么绕|你要是不赶时间|句号后|顺着现场|相关的东西|比较直接一点|话题话题|再聊办公区/;
  for (const question of questions) {
    if (scenarios.has(question.scenario)) errors.push(`${question.id}: duplicate scenario`);
    scenarios.add(question.scenario);
    if (question.options.filter(option => option.isCorrect).length !== 1) errors.push(`${question.id}: expected one correct option`);
    const correctIndex = question.options.findIndex(option => option.isCorrect);
    if (correctIndex >= 0) answerCounts[correctIndex]++;
    const correct = question.options.find(option => option.isCorrect);
    if (correct?.explain) errors.push(`${question.id}: correct explain should be empty`);
    const lengths = question.options.map(option => textLen(option.text));
    const maxLen = Math.max(...lengths);
    const minLen = Math.min(...lengths);
    if (maxLen / Math.max(1, minLen) >= 2.25) errors.push(`${question.id}: option length spread too wide (${minLen}-${maxLen})`);
    for (const option of question.options) {
      if (banned.test(option.text)) errors.push(`${question.id}: banned phrase in option: ${option.text}`);
      if (/[。！？!?].+$/.test(option.text.replace(/[。！？!?]$/, ''))) errors.push(`${question.id}: option has appended sentence: ${option.text}`);
      if (optionTexts.has(option.text)) errors.push(`${question.id}: duplicate option text: ${option.text}`);
      optionTexts.add(option.text);
      if (!option.isCorrect && textLen(option.explain) < 18) errors.push(`${question.id}: weak wrong explain`);
    }
  }
  if (questions.length !== 50) errors.push(`expected 50 icebreak questions, got ${questions.length}`);
  if (Math.max(...answerCounts) - Math.min(...answerCounts) > 1) {
    errors.push(`answer distribution is uneven: ${JSON.stringify(Object.fromEntries(LETTERS.map((letter, index) => [letter, answerCounts[index]])))}`);
  }
  if (errors.length) throw new Error(errors.slice(0, 80).join('\n'));
}

function main() {
  const { bank, tail } = loadBank();
  const icebreakQuestions = buildQuestions();
  validate(icebreakQuestions);
  let icebreakIndex = 0;
  const updated = bank.map(question => {
    if (question.category !== 'icebreak') return question;
    const replacement = icebreakQuestions[icebreakIndex++];
    if (!replacement) throw new Error('more icebreak slots than replacements');
    return replacement;
  });
  if (icebreakIndex !== icebreakQuestions.length) throw new Error(`replaced ${icebreakIndex}, expected ${icebreakQuestions.length}`);
  const source = [
    '/**',
    ' * FoxSay 微练习题库',
    ' * 8 大主题 x 50 题；破冰搭讪模块已重写为独立生活场景，选项不使用后补尾句。',
    ' */',
    '',
    "import type { Question } from '../services/quiz';",
    '',
    `export const QUIZ_BANK: Question[] = ${JSON.stringify(updated, null, 2)};`,
    '',
    tail.trimStart(),
  ].join('\n');
  fs.writeFileSync(BANK_PATH, source, 'utf8');
  console.log('ICEBREAK_V5_REWRITTEN');
  console.log('TOTAL_ICEBREAK=' + icebreakQuestions.length);
  console.log('WROTE=' + BANK_PATH);
}

main();