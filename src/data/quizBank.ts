/**
 * FoxSay 微练习题库 (AutoGen via Node)
 * 纯独立情境，无冗长剧情，无前后文耦合
 */

import type { Question } from '../services/quiz';

export const QUIZ_BANK: Question[] = [
  {
    "id": "q-anti-pua-001",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-002",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-003",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-004",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-005",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-006",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-007",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-008",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-009",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-010",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-011",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-012",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-013",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-014",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-015",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-016",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-017",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-018",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-019",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-020",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-021",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-022",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-023",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-024",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-025",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-026",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-027",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-028",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-029",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-030",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-031",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-032",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-033",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-034",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-035",
    "category": "anti-pua",
    "difficulty": 3,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-036",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-037",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-038",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-039",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-040",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-041",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-042",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-043",
    "category": "anti-pua",
    "difficulty": 4,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-044",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-045",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-046",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们在一起几个月，你指出他没履行约会承诺",
    "prompt": "他说：“我对谁都这样，你别多想，就你事多。”",
    "options": [
      {
        "text": "你是不是对别的女生也这样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你怎么能这样说我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那我不多想了。我只是想知道，在你这里我的感受重要吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "是我不好，我太敏感了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-047",
    "category": "anti-pua",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常贬低你的工作成果",
    "prompt": "他说：“你这个项目拿不到奖是因为你太笨了，别人随随便便就做好了。”",
    "options": [
      {
        "text": "别人做的也没多好。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以不认同我的成果，但请停止人身攻击。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我真的很笨吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那你来帮我做啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-048",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "你表达了在聚会时被冷落的难过",
    "prompt": "他说：“别人都没觉得我冷落你，怎么就你觉得？你太能找事了。”",
    "options": [
      {
        "text": "那以后我都不去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "可能我真的太在意你了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人的感受我管不着。作为伴侣，我感受到被冷落，这就值得沟通。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "别人肯定是骗你的！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-049",
    "category": "anti-pua",
    "difficulty": 1,
    "type": "single",
    "scenario": "他忘了你的生日，你很失落",
    "prompt": "他说：“你能不能不要这么幼稚？每天这么多事，谁能记住破生日？”",
    "options": [
      {
        "text": "那我也忘了你的生日！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就是不在乎我！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对不起，我确实不该要求太多。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "生日对我不幼稚。你可以忘记，但这不代表我的失落是错的。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-anti-pua-050",
    "category": "anti-pua",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现他偷偷看你手机",
    "prompt": "他说：“要是你没鬼，怕什么被看？这也是关心你啊。”",
    "options": [
      {
        "text": "关心不需要靠偷看获得。我们之间至少应该有基础的隐私尊重。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以看我手机，但我很生气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你要看可以光明正大看啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "(默认允许并转移话题)",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【anti-pua】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-051",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-052",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-053",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-054",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-055",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-056",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-057",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-058",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-059",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-060",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-061",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-062",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-063",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-064",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-065",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-066",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-067",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-068",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-069",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-070",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-071",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-072",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-073",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-074",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-075",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-076",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-077",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-078",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-079",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-080",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-081",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-082",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-083",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-084",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-085",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-086",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-087",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-088",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-089",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-090",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-091",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-092",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-093",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-094",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-095",
    "category": "icebreak",
    "difficulty": 2,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-096",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友局上认识了新朋友，加了微信",
    "prompt": "你第一句话想打开话题，最自然的是？",
    "options": [
      {
        "text": "在吗？吃了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天那家的烤肉真的绝了，你也喜欢吃这家吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你好，可以认识一下吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天很高兴认识你哦",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-097",
    "category": "icebreak",
    "difficulty": 1,
    "type": "single",
    "scenario": "在咖啡店排队，前面的人戴着你很喜欢的乐队周边帽子",
    "prompt": "你想搭讪认识一下，怎么说最不突兀？",
    "options": [
      {
        "text": "哇，这顶帽子是去年巡演的限量款吧？我也是他们的死忠粉！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你可以把帽子链接发我吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你好，加个微信好吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你的帽子在哪买的？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-098",
    "category": "icebreak",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚进新的兴趣社群，群里正在热聊最近热门的一部电影",
    "prompt": "你想参与进去并树立一个好印象，怎么说？",
    "options": [
      {
        "text": "这部电影的结局反转确实惊艳，我也刚去刷完！大家觉得男主的动机是什么？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "能发给我一份资源吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "电影一般般吧，没觉得好看。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "大家好，新来的多多关照。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-099",
    "category": "icebreak",
    "difficulty": 4,
    "type": "single",
    "scenario": "相亲局后第一次微信聊天",
    "prompt": "你想自然地推进关系，发什么最好？",
    "options": [
      {
        "text": "下班了吗？要不要出来吃夜宵？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "今天听你说你很喜欢滑雪，周末刚好有个室内滑雪体验课，不知道你感不感兴趣？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "今天见你感觉很不错，做我女朋友吧？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "晚上好，你在干嘛？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-icebreak-100",
    "category": "icebreak",
    "difficulty": 5,
    "type": "single",
    "scenario": "公司别的部门新来了一个同事，刚好坐在你隔壁",
    "prompt": "你该如何破冰？",
    "options": [
      {
        "text": "嘿，加个微信？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你谈恋爱了吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你好，你一个月工资多少？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "新环境还习惯吗？以后打印机有啥不懂的尽管问我哈哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【icebreak】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-101",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-102",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-103",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-104",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-105",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-106",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-107",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-108",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-109",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-110",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-111",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-112",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-113",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-114",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-115",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-116",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-117",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-118",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-119",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-120",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-121",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-122",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-123",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-124",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-125",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-126",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-127",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-128",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-129",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-130",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-131",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-132",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-133",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-134",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-135",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-136",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-137",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-138",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-139",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-140",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-141",
    "category": "ambiguous",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-142",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-143",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-144",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-145",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-146",
    "category": "ambiguous",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们经常一起打游戏，他今天突然说",
    "prompt": "“如果以后每天都能跟你这么开心打游戏就好了。”",
    "options": [
      {
        "text": "他就是随口客套，毫无意义。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种隐晦的好感表达，他在试探你们之间建立长期关系的可能性。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是想找个固定的游戏搭子，别多想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他肯定对每个一起玩游戏的人都这么说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-147",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "下雨了，你们都没伞，他把外套脱下来举在你们头顶",
    "prompt": "他看着你说：“幸好有这件大外套。”他这举动说明什么？",
    "options": [
      {
        "text": "创造身体接触和保护感，这是极其明显的暧昧升级信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是刚好觉得热把外套脱了而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "仅仅是处于朋友之间的基本礼貌。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他怕自己的衣服被淋湿得更透。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-148",
    "category": "ambiguous",
    "difficulty": 5,
    "type": "single",
    "scenario": "你生病了，他立刻跑来给你送药，什么也没说就走了",
    "prompt": "这种行为暗示了什么？",
    "options": [
      {
        "text": "行动胜过言语，他在用实际付出来证明对你超级在意，这是深层暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他只是顺路买药而已。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "朋友之间也有可能做到这样，不能说明什么。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "可能他觉得无聊想出门走走。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-149",
    "category": "ambiguous",
    "difficulty": 4,
    "type": "single",
    "scenario": "聊天时他总是有意无意提到他的未来规划里有你",
    "prompt": "他说：“等我攒够钱买了车，就可以带你去你一直想去的那家海边餐厅了。”",
    "options": [
      {
        "text": "这说明他现在很穷，暂时不想谈恋爱。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是将你纳入未来的长远规划，是非常强烈的定心丸式暧昧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得那家餐厅只有开车去才方便罢了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他只是在吹牛炫耀自己的买车计划。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-ambiguous-150",
    "category": "ambiguous",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们对视时，他总是先移开目光，但过一会又会偷偷看你",
    "prompt": "这种眼神互动代表着：",
    "options": [
      {
        "text": "典型的害羞与在意，他在确认你的目光，同时又不敢过度表露。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他觉得你脸上长了奇怪的东西。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他单纯是眼睛不舒服或者近视看不清。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他对你毫无感觉，只是发呆。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【ambiguous】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-151",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-152",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-153",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-154",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-155",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-156",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-157",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-158",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-159",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-160",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-161",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-162",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-163",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-164",
    "category": "love",
    "difficulty": 4,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-165",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-166",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-167",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-168",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-169",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-170",
    "category": "love",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-171",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-172",
    "category": "love",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-173",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-174",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-175",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-176",
    "category": "love",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-177",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-178",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-179",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-180",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-181",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-182",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-183",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-184",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-185",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-186",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-187",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-188",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-189",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-190",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-191",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-192",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-193",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-194",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-195",
    "category": "love",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-196",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣最近工作繁重回家倒头就睡，你们很久没交流",
    "prompt": "你感到有些疏远，你会怎样开启沟通？",
    "options": [
      {
        "text": "既然你这么累，那以后我们就各过各的吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "最近看你回来得都好晚好累，我热了杯牛奶，要不要靠着我休息一会？有什么压力都可以跟我说哦。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你每天回来就睡，这家里还有我的位置吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你到底是要工作还是要我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-197",
    "category": "love",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们在买家具时意见不合",
    "prompt": "伴侣喜欢现代简约，你喜欢复古原木，最后你会怎么妥协？",
    "options": [
      {
        "text": "不如我们在大件家具上选现代简约，在小装饰和区域角落做点复古摆件混搭怎么样？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你这种品味我真的受不了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "要是你不选复古的我就自己住出去了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "行行行，都听你的，免得说我不讲理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-198",
    "category": "love",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣做了一顿饭，但味道真的挺一般的",
    "prompt": "看到他期待的眼神，你会怎么说？",
    "options": [
      {
        "text": "哇，这色泽看起来很不错！虽然这个菜对我来说淡了一点点，但你愿意为我做饭我超级开心！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "太难吃了，下次还是我来做吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这厨艺真的是没救了，以后别进厨房了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "勉强咽下去，什么都不说假装全盘接受，但心里憋屈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-199",
    "category": "love",
    "difficulty": 5,
    "type": "single",
    "scenario": "你发现伴侣情绪忽然低落，但问他他又说没事",
    "prompt": "这个时候怎样做更体贴？",
    "options": [
      {
        "text": "轻轻抱抱他或者默默倒杯水陪伴：“我知道你现在不想说，没关系，如果想聊了，我随时都在。”",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "既然没事那赶紧把昨天的衣服洗洗吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你爱说不说，我还懒得问呢。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你一直憋在心里到底想干嘛？赶紧交代了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-love-200",
    "category": "love",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣给你准备了一个纪念日惊喜，但不是你喜欢的类型",
    "prompt": "你怎么回应能照顾他的心意又不让自己受委屈？",
    "options": [
      {
        "text": "我不喜欢，你拿去退掉吧。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "强颜欢笑假装自己非常喜欢，以后一直收到这种不喜欢的惊喜。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你怎么连我喜欢什么都搞不清楚？交往这么久了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "很感谢你花心思准备这些，我能感受到你的用心。以后如果还能收到我梦想中的那种风格我会更兴奋！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【love】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-201",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-202",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-203",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-204",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-205",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-206",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-207",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-208",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-209",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-210",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-211",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-212",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-213",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-214",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-215",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-216",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-217",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-218",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-219",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-220",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-221",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-222",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-223",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-224",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-225",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-226",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-227",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-228",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-229",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-230",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-231",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-232",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-233",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-234",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-235",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-236",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-237",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-238",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-239",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-240",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-241",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-242",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-243",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-244",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-245",
    "category": "redflag",
    "difficulty": 4,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-246",
    "category": "redflag",
    "difficulty": 3,
    "type": "single",
    "scenario": "刚确立关系两周，他就反复要求看你所有社交账号密码",
    "prompt": "这种行为属于什么性质危险信号？",
    "options": [
      {
        "text": "这是一种极强的控制欲和不信任感，属于典型的红色警告信号。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这是他太爱你在乎你的表现，是正常的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只要光明正大，给他看也无所谓不是吗？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "男人有点占有欲也是可以理解的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-247",
    "category": "redflag",
    "difficulty": 2,
    "type": "single",
    "scenario": "每次你们发生争执，不管起因是什么，最终他总能绕到让你觉得是你的错",
    "prompt": "这种沟通模式是：",
    "options": [
      {
        "text": "典型的习惯性推脱责任和操控认知（Gaslighting），是必须警惕的危险标志。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "说明他的逻辑能力强，辩论比你厉害。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明确实是你每次都有错在先。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这只是情侣间常见的小打小闹不必当真。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-248",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常在你面前故意贬低他的前任，说前任像个疯子",
    "prompt": "听到这种言论你应该觉得：",
    "options": [
      {
        "text": "你应该感到庆幸他终于遇到了优秀的你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "极度危险，一个总是完全贬低前任且不承担任何责任的人，未来也会这样对待你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这证明他现在满心满眼只有你。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "说明他前任真的太糟糕了，他是个受害者。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-249",
    "category": "redflag",
    "difficulty": 1,
    "type": "single",
    "scenario": "他对餐厅服务员、外卖员态度极度恶劣甚至大呼小叫",
    "prompt": "这种举动透露出什么深层信息？",
    "options": [
      {
        "text": "这说明他有领导气质和气场。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "缺乏同理心和尊重差异的人格底色，当他认为自己处于高位时就会暴露出极其刻薄的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "服务员可能确实犯错了，骂几句没事。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "只是因为他今天心情不好，平时不这样。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-redflag-250",
    "category": "redflag",
    "difficulty": 5,
    "type": "single",
    "scenario": "他经常阻止你和你的某些老朋友交往，认为那些朋友会带坏你",
    "prompt": "这是一种什么样的表现？",
    "options": [
      {
        "text": "社交圈隔离，这是控制性关系初期的典型标志，目的是斩断你的外界支持体系。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "听他的就好，毕竟他现在才是最亲密的人。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他眼光毒辣，是帮你筛选优质朋友圈。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "他这是在关心你的成长环境。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【redflag】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-251",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-252",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-253",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-254",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-255",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-256",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-257",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-258",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-259",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-260",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-261",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-262",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-263",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-264",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-265",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-266",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-267",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-268",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-269",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-270",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-271",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-272",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-273",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-274",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-275",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-276",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-277",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-278",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-279",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-280",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-281",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-282",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-283",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-284",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-285",
    "category": "emotion-catch",
    "difficulty": 5,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-286",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-287",
    "category": "emotion-catch",
    "difficulty": 1,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-288",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-289",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-290",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-291",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-292",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-293",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-294",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-295",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-296",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "朋友丢了工作，非常难过地给你打电话",
    "prompt": "朋友哭诉：“我都这么努力了，为什么还是我？”你在这个时候怎么回应最接得住情绪？",
    "options": [
      {
        "text": "那是公司没眼光，别哭了别哭了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这点小事有啥好哭的，赶紧写简历找下一家啊！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "其实你也有做得不好的地方，下次吸取教训。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的太不公平了。你付出的我全看在眼里，你现在肯定特别委屈，我过去陪陪你吧。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-297",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "同事抱怨老板今天无缘无故批评他",
    "prompt": "同事怒气冲冲：“老板真是不可理喻！”你会说什么？",
    "options": [
      {
        "text": "你是不是哪里做错了你自己没察觉啊？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "听起来今天真的是受够气了，他那个脾气确实让人很崩啊！要不要出去喝杯奶茶降降火？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "老板都是这样的啦，忍忍就过了。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "算了不说这个了，中午吃什么？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-298",
    "category": "emotion-catch",
    "difficulty": 4,
    "type": "single",
    "scenario": "伴侣晚上回家长吁短叹，说今天客户多难缠",
    "prompt": "伴侣说：“我真的不想干了，太心累了。”你的第一反应应该是？",
    "options": [
      {
        "text": "我觉得那个客户可能就是急了点，你别太玻璃心。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "那个客户这也太离谱了吧。你今天一定熬坏了，先别想了，过来让我抱抱。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想干就辞职啊，这么大个人了还天天抱怨。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不干我们房贷怎么办，成熟一点行不行？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-299",
    "category": "emotion-catch",
    "difficulty": 3,
    "type": "single",
    "scenario": "闺蜜因为失恋每天把自己关在房间",
    "prompt": "你去看望她时，她哭着说：“我是不是很差劲才会被抛弃？”你最好说：",
    "options": [
      {
        "text": "其实你们分手也有你的责任的，你想想。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "被伤害的时候产生这种自我怀疑很正常。但在我心里你一直闪闪发光，错的永远是不懂珍惜你的人。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "哎呀下一个更乖，别想这个渣男了！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "对啊你天天这样哭丧着脸，谁受得了啊？赶紧振作！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-emotion-catch-300",
    "category": "emotion-catch",
    "difficulty": 2,
    "type": "single",
    "scenario": "孩子（或者弟弟妹妹）因为考试考砸了躲在角落不吃饭",
    "prompt": "你走过去应该怎么开导？",
    "options": [
      {
        "text": "我就知道你这样肯定考不好，平时看你都没好好学。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "别人都能考好怎么就你不行，多找找自己原因。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "考成这样还好意思不吃饭？赶紧给我过来！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "考坏了心里很难受对不对？分数不理想不代表你不行，这只是一次失误，不论成绩如何我们都爱你。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【emotion-catch】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-301",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-302",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-303",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-304",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-305",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-306",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-307",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-308",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-309",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-310",
    "category": "refuse",
    "difficulty": 2,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-311",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-312",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-313",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-314",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-315",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-316",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-317",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-318",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-319",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-320",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-321",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-322",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-323",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-324",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-325",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-326",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-327",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-328",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-329",
    "category": "refuse",
    "difficulty": 2,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-330",
    "category": "refuse",
    "difficulty": 2,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-331",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-332",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-333",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-334",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-335",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-336",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-337",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-338",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-339",
    "category": "refuse",
    "difficulty": 2,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-340",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-341",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-342",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-343",
    "category": "refuse",
    "difficulty": 3,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-344",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-345",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-346",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "朋友找你借一笔金额不小的钱，但你最近手头也很紧",
    "prompt": "你心里不想借但又怕伤和气，怎么说最得体？",
    "options": [
      {
        "text": "我没钱，你找别人吧！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好吧，我想想办法凑一点给你（自己内心崩溃）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "真的很抱歉，我最近刚好有大笔开销手头周转不开，不然我一定会帮你的。看看能不能帮你想想其他办法？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你怎么连这么点钱都没有，早干嘛去了？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-347",
    "category": "refuse",
    "difficulty": 4,
    "type": "single",
    "scenario": "同事趁快下班又给你塞一个不属于你的任务",
    "prompt": "同事说：“这个你比较熟练，你今晚顺手帮我做了吧？”你应该如何拒绝？",
    "options": [
      {
        "text": "行吧我就帮你这一次（结果变成无数次）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我今晚手头上的活都没结清排满了呢，这个可能赶不出来了，麻烦你找下项目主管协调下人手哈。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "你不觉得你太过分了吗？自己工作让我做！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "假装没看见没听见，明天再说。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-348",
    "category": "refuse",
    "difficulty": 1,
    "type": "single",
    "scenario": "饭局上有人一直劝你喝酒，但你真的不想喝了",
    "prompt": "对方起哄：“不喝就是不给我面子啊！”你怎么挡回去？",
    "options": [
      {
        "text": "你这人怎么这样强迫人啊，真没素质！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "我就不喝！你能拿我怎样？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "我是真的对酒精过敏身体吃不消了，绝对不是不给面子呀，这杯我以茶代酒敬您个大局！",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "好吧好吧，就喝这一口（结果被一直灌）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-349",
    "category": "refuse",
    "difficulty": 2,
    "type": "single",
    "scenario": "亲戚托你帮忙找工作，但这真的越界了而且麻烦",
    "prompt": "亲戚说：“你在这个公司肯定有门路的，帮帮你表弟吧。”你该说：",
    "options": [
      {
        "text": "我很想帮忙，但我们公司招人完全走硬性流程，我真没那个权力干涉啊，我可以帮忙看看公开的岗位信息发你们。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "我不帮，太烦了这种事！",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好的舅妈，我去问问领导（硬着头皮去得罪人）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "表弟水平那么差，进不来我们公司的。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-refuse-350",
    "category": "refuse",
    "difficulty": 5,
    "type": "single",
    "scenario": "周末想宅家休息，但闺蜜突然打电话叫你立刻出门逛街",
    "prompt": "你实在不想动弹，怎么拒绝不伤感情？",
    "options": [
      {
        "text": "亲爱的，我这周这几天真是累瘫了感觉要散架，今天实在出不去了。下次这顿饭我请，补偿可以吗？",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！这是理智而正确的回应方式。"
      },
      {
        "text": "不想去，烦死了别叫我。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "好...好呀（极不情愿地出门导致全程臭脸）。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "你就不能自己去逛吗，非要拉着我？",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【refuse】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-351",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-352",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-353",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-354",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-355",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-356",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-357",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-358",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-359",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-360",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-361",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-362",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-363",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-364",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-365",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-366",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-367",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-368",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-369",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-370",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-371",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-372",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-373",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-374",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-375",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-376",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-377",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-378",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-379",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-380",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-381",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-382",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-383",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-384",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-385",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-386",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-387",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-388",
    "category": "recover",
    "difficulty": 2,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-389",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-390",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-391",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-392",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-393",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-394",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-395",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "挽回初期，前任回复你的消息总是很慢，字数也很少",
    "prompt": "面对这种冷淡反应，你正确的理解和做法是？",
    "options": [
      {
        "text": "一气之下直接也玩消失互删。毁掉了好不容易建立的弱联系。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "这是必然的回撤期，他依然带有防备。你也降低频率，偶尔分享生活日常，不索要情绪回应。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "拼命发搞笑段子或者长语音试图讨好他。会激起对方更高逆反心理。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "疯狂质问：“你为什么对我这么冷淡？是不是有别人了？”只会加速对方想要逃离。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-396",
    "category": "recover",
    "difficulty": 1,
    "type": "single",
    "scenario": "你们相约复联后第一次线下见面吃饭",
    "prompt": "饭桌上，你展示出哪种状态最有利于挽回推进？",
    "options": [
      {
        "text": "疯狂试探：“你最近有没有新情况？我们可能吗？”过于急躁暴露目的性。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "故意跟异性暧昧发消息气他。这种打压式试探往往弄巧成拙激怒对方。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "全程痛哭流涕细数曾经的美好回忆。只会让他重温以前的压力和压抑感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "轻松自然，聊聊最近各自的改变和趣事，像个有边界感的熟人，展现自己提升后阳光的一面。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-397",
    "category": "recover",
    "difficulty": 3,
    "type": "single",
    "scenario": "前任突然发消息对你说：“我觉得我们做朋友挺好的。”",
    "prompt": "这句话背后的深层含义及最优解是？",
    "options": [
      {
        "text": "“好啊，正好我最近也有新接触的人了。”——毫无逻辑的自爆激将法，反而葬送机会。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“我不！我不要只做朋友，我要你回来！”——立刻陷入情绪崩溃，导致防备感激增。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "对方在试探并确立缓冲地带，你应当顺水推舟：“是啊我也觉得现在这样轻松很多。”从而降低防备感再次吸引。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "完全不回。逃避正面交锋，会失去沟通节点。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-398",
    "category": "recover",
    "difficulty": 4,
    "type": "single",
    "scenario": "你们因为一些琐事吵架分手，你立刻选择了断联一周",
    "prompt": "对方终于忍不住发了一句“你最近怎么样”，你如何恰当回复？",
    "options": [
      {
        "text": "过了三天回个极其冷漠的“嗯”。让本来主动的一方彻底失望退却。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "“怎么？现在想起我的好了？”这是防御性攻击，不利于挽回重建。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "秒回并长文倾诉：“我过得好惨，每天都在想你。”瞬间回到弱势地位。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“挺好的呀，最近在忙着健身和搞项目。你呢？”——简短热情但没有复合要求，建立吸引力。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-399",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "分手后复联第一周，对方突然发朋友圈说自己生病了",
    "prompt": "你看到了这条状态，最恰当的做法是？",
    "options": [
      {
        "text": "发小作文大篇幅表达心痛。会让对方觉得有很强的压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "立刻打连环夺命电话问情况，甚至买药冲过去照顾。这是典型暴雷需求感。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "完全无视并在自己的朋友圈发出去玩的照片。显得太刻意赌气。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。这种回应可能引发更多防卫。"
      },
      {
        "text": "点个赞或者简单的评论一句“好好吃药早点休息”，保持框架，不要长篇大论暴露过度关心。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  },
  {
    "id": "q-recover-400",
    "category": "recover",
    "difficulty": 5,
    "type": "single",
    "scenario": "你想跟前任重新建立联系，目前处于刚加回好友阶段",
    "prompt": "你复联的第一句开场白哪种最好？",
    "options": [
      {
        "text": "“我今天看到一只猫长得很像你。”——显得太轻挑和莫名其妙。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“最近好吗？我还很想你。”——直接暴露极高需求感和压力。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      },
      {
        "text": "“之前那家咖啡店的积分卡好像还在你那，我朋友想借用一下，方便把卡号发我吗？”——用合理的客观事由破冰。",
        "isCorrect": true,
        "explain": "✅ 恭喜答对！展现了极好的边界感和高价值态。"
      },
      {
        "text": "“在吗？其实我都知道错了。”——进入低姿态祈求模式，打破平衡。",
        "isCorrect": false,
        "explain": "❌ 这里有问题。有些暴露了低姿态需求感。"
      }
    ],
    "overallExplain": "这是关于【recover】的典型情境。关键在于把握好自己的框架和情绪，不要落入对方的节奏。面对不合理预期时，要温和坚定地表明态度。"
  }
];


export function getQuestionById(id: string): Question | undefined {
  return QUIZ_BANK.find(q => q.id === id);
}

export function getByCategory(category: string): Question[] {
  return QUIZ_BANK.filter(q => q.category === category);
}
