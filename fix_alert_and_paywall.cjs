const fs = require('fs');

// 1. Update App.jsx handlePracticeAction
const appJsxPath = 'C:\\FoxSay\\src\\App.jsx';
let appCode = fs.readFileSync(appJsxPath, 'utf8');

appCode = appCode.replace(
  /const handlePracticeAction = useCallback\(\(action\) => \{\s*setPracticeAction\(action\);\s*skipTabAnimRef\.current = true;\s*setActiveTab\(0\);\s*\}, \[\]\);/,
  `const handlePracticeAction = useCallback((action) => {
    if (action === 'go_vip' || action?.type === 'go_vip') {
      skipTabAnimRef.current = true;
      setActiveTab(3);
      return;
    }
    setPracticeAction(action);
    skipTabAnimRef.current = true;
    setActiveTab(0);
  }, []);`
);
fs.writeFileSync(appJsxPath, appCode, 'utf8');


// 2. Update MicroPracticePage.tsx
const microPagePath = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let microCode = fs.readFileSync(microPagePath, 'utf8');

// Fix startCategory bug
microCode = microCode.replace(
  /if \(qs\.length === 0\) \{\s*setPaywallFrom\(`\$\{CATEGORY_META\[cat\]\.label\} · 进阶题`\);\s*setShowPaywall\(true\);\s*return;\s*\}/,
  `if (qs.length === 0) {
      if (hasMicroVip) {
        alert('当前分类暂无题目，题库正在扩充中。');
        return;
      }
      setPaywallFrom(\`\${CATEGORY_META[cat].label} · 进阶题\`);
      setShowPaywall(true);
      return;
    }`
);

// Fix goOpenMembership alert
microCode = microCode.replace(
  /const goOpenMembership = \(\) => \{\s*setShowPaywall\(false\);\s*alert\('微练习权益已并入主会员，请前往“订购”页开通会员。'\);\s*\};/,
  `const goOpenMembership = () => {
    setShowPaywall(false);
    if (onPracticeAction) {
      onPracticeAction({ type: 'go_vip' });
    }
  };`
);

fs.writeFileSync(microPagePath, microCode, 'utf8');

console.log('Fixes applied.');
