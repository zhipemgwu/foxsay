const fs = require('fs');
const data = JSON.parse(fs.readFileSync('C:/FoxSay/rewrite_tabbar.json', 'utf8'));
for (const [file, content] of Object.entries(data)) {
  fs.writeFileSync(file, content, 'utf8');
}
