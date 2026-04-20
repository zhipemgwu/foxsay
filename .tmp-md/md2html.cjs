const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const inFile = process.argv[2];
const outFile = process.argv[3];
const md = fs.readFileSync(inFile, 'utf-8');
const body = marked.parse(md, { gfm: true, breaks: false });

const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>一站式恋爱宝典系统逻辑版本1.0</title>
<style>
body { font-family: "Microsoft YaHei","微软雅黑","PingFang SC",sans-serif; font-size: 11pt; line-height: 1.6; color:#222; }
h1 { font-size: 22pt; color:#2a2a8a; border-bottom:2px solid #6a5acd; padding-bottom:4px; }
h2 { font-size: 17pt; color:#4a3aa8; margin-top:18pt; border-bottom:1px solid #ccc; padding-bottom:2px; }
h3 { font-size: 14pt; color:#5a3aa8; margin-top:14pt; }
h4 { font-size: 12pt; color:#7a3aa8; }
table { border-collapse: collapse; margin:8pt 0; width: 100%; }
th,td { border:1px solid #999; padding:5pt 8pt; font-size:10.5pt; vertical-align: top; }
th { background:#EEE8FA; }
code { background:#f3f0fa; padding:1pt 4pt; border-radius:3px; font-family: "Consolas","Cascadia Mono",monospace; font-size:10pt; color:#b33771; }
pre { background:#1e1e2e; color:#d4d4d4; padding:10pt; border-radius:5px; font-family:"Consolas",monospace; font-size:10pt; overflow-x:auto; }
pre code { background:none; color:inherit; padding:0; }
blockquote { border-left:4px solid #7a3aa8; background:#f6f0fc; margin:6pt 0; padding:6pt 10pt; color:#555; }
ul, ol { margin: 4pt 0 4pt 18pt; }
li { margin-bottom: 2pt; }
hr { border:none; border-top:1px solid #ccc; margin:14pt 0; }
a { color:#5a3aa8; }
</style></head>
<body>
${body}
</body></html>`;

fs.writeFileSync(outFile, '\uFEFF' + html, 'utf-8');
console.log('HTML written:', outFile, html.length, 'chars');
