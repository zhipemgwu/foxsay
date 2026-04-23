const fs = require('fs');
const path = 'C:\\FoxSay\\src\\data\\quizBank.ts';
let txt = fs.readFileSync(path, 'utf8');

const dummyMap = {
  "正确的回应策略（展现反PUA的高情商处理）": "既然你觉得我不对，那我们先各自冷静一下再沟通吧。",
  "正确的回应策略（展现沟通谈判的高情商处理）": "我明白你的顾虑，不如我们各退一步，找个折中的方法？",
  "正确的回应策略（展现冲突管理的高情商处理）": "这事我们都有责任，现在最重要是把问题解决好，而不是追究谁对谁错。",
  "正确的回应策略（展现日常维系的高情商处理）": "哇，今天真是太开心了，能跟你一起度过这段时间真好！",
  "正确的回应策略（展现建立吸引的高情商处理）": "原来你也喜欢这个呀？太巧了，下次要不要一起去看看？",
  "正确的回应策略（展现自我成长的优质应对）": "没关系，这次虽然没做好，但我知道下次该怎么改进了。",
  "正确的回应策略（展现脱单破冰的高情商处理）": "看你刚才一直不怎么说话，是因为觉得无聊吗？要不我们换个地方玩？",
  "正确的回应策略（展现挽回前任的成熟应对）": "我知道之前给你造成了不少困扰，现在我也只是想作为普通朋友关心一下你。",

  // and to cover if the category is slightly different:
  "正确的回应策略（展现anti-pua的高情商处理）": "我不接受你这种评判方式。如果你无法好好说话，我们可以停止对话。",
  "正确的回应策略（展现communication的高情商处理）": "你的意思是……对吗？我希望我们能在这一点上达成共识。",
  "正确的回应策略（展现conflict的高情商处理）": "我们现在的状态不太适合讨论，稍后大家都平复了再聊这事吧。",
  "正确的回应策略（展现daily的高情商处理）": "你今天看起来有点累，要不要我帮你分担点什么？",
  "正确的回应策略（展现attraction的高情商处理）": "你刚才认真的样子还挺迷人的，平时没发现呢。",
  "正确的回应策略（展现growth的优质应对）": "这段经历让我学到了很多，我也更清楚自己想要什么了。",
  "正确的回应策略（展现icebreaker的高情商处理）": "这周围有什么好玩的地方推荐吗？我看你好像挺熟悉这儿的。",
  "正确的回应策略（展现recover的成熟应对）": "很久没联系了，最近过得还好吗？只是看到一件熟悉的东西，想起了你。"
};

let replaced = 0;
for (const [dummy, specific] of Object.entries(dummyMap)) {
  const re = new RegExp(`"${dummy.replace(/[()]/g, '\\\\$&')}"`, "g");
  const match = txt.match(re);
  if (match) {
    replaced += match.length;
    txt = txt.replace(re, `"${specific}"`);
  }
}

// Just in case I missed exactly the string because it's slightly different
txt = txt.replace(/"正确的回应策略（展现[^"']*的高情商处理）"/g, '"我觉得我们还是坦诚沟通一下比较好，你说呢？"');
txt = txt.replace(/"正确的回应策略（展现[^"']*的成熟应对）"/g, '"经历了这些，我也想通了很多事情，希望你一切都好吧。"');
txt = txt.replace(/"正确的回应策略（展现[^"']*的优质应对）"/g, '"这是一个不错的成长契机，我会好好把握的。"');


fs.writeFileSync(path, txt, 'utf8');
console.log(`Replaced positive options! Initial hits: ${replaced}`);
