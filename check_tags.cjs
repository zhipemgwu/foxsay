const fs = require('fs');
const txt = fs.readFileSync('C:\\FoxSay\\rebuild_ui2.cjs', 'utf8');
const block = txt.split('const newMiddleBlock = `')[1].split('`;')[0];
const lines = block.split('\n');
let d = 0;
lines.forEach((line, i) => {
  let prevd = d;
  const o = (line.match(/<div/gi)||[]).length;
  const c = (line.match(/<\/div>/gi)||[]).length;
  d += o - c;
  if (d !== prevd && o !== c) console.log(i, d, line.trim());
});
