const fs = require('fs');
const filepath = 'C:\\FoxSay\\src\\services\\quiz.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Hard fix for the syntax
content = content.replace(/\|\s*'refuse'\s*\/\/\s*拒绝 \/ 退出练习\s*\|\s*'recover';\s*\/\/\s*挽回练习/, 
  "| 'refuse'\n  | 'recover';"
);

// Hard fix for META
content = content.replace(/'refuse':(.*)/, 
  "'refuse':$1\n    'recover':       { label: '挽回前任', emoji: '🩹', color: '#B39DDB', desc: '复联策略 / 二次吸引' },"
);

fs.writeFileSync(filepath, content, 'utf8');
