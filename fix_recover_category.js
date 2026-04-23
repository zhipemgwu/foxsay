import fs from 'fs';
import path from 'path';

const filepath = 'C:\\FoxSay\\src\\services\\quiz.ts';
let content = fs.readFileSync(filepath, 'utf8');

// Fix formatting of the union type addition
content = content.replace(
  /\| 'refuse'\s*\/\/\s*拒绝 \/ 退出练习\s*\|\s*'recover';\s*\/\/\s*挽回练习/,
  "| 'refuse'        // 拒绝 / 退出练习\n  | 'recover';       // 挽回练习"
);

// Add CATEGORY_META entry if missed
if (!content.includes("'recover':")) {
  content = content.replace(
    /'refuse':\s*{\s*label:\s*'拒绝练习',\s*emoji:\s*'🛡️',\s*color:\s*'#95E1D3',\s*desc:\s*'体面说不\s*\/\s*退出关系'\s*},/g,
    "'refuse':        { label: '拒绝练习',   emoji: '🛡️', color: '#95E1D3', desc: '体面说不 / 退出关系' },\n    'recover':       { label: '挽回前任',   emoji: '🩹', color: '#B39DDB', desc: '复联策略 / 二次吸引' },"
  );
}

fs.writeFileSync(filepath, content, 'utf8');
