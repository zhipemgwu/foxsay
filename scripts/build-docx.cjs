/**
 * 把 docs/system-logic-v1.md 渲染成 docx。
 * 支持：# / ## / ### / #### 标题，段落，无序列表 (- )，有序列表 (1. )，
 *       | 表格 |，代码块 ```，行内 **加粗** `code`，引用 >。
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
} = require('docx');

const MD = fs.readFileSync(path.join(__dirname, '..', 'docs', 'system-logic-v1.md'), 'utf8');

// ---------- helpers ----------
function parseInline(line) {
  // support **bold**, `code`
  const runs = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0; let m;
  while ((m = regex.exec(line)) !== null) {
    if (m.index > last) runs.push(new TextRun({ text: line.slice(last, m.index), font: '微软雅黑' }));
    const tok = m[0];
    if (tok.startsWith('**')) {
      runs.push(new TextRun({ text: tok.slice(2, -2), bold: true, font: '微软雅黑' }));
    } else {
      runs.push(new TextRun({ text: tok.slice(1, -1), font: 'Consolas', color: 'C7254E' }));
    }
    last = m.index + tok.length;
  }
  if (last < line.length) runs.push(new TextRun({ text: line.slice(last), font: '微软雅黑' }));
  return runs.length ? runs : [new TextRun({ text: line, font: '微软雅黑' })];
}

function mkHeading(text, level) {
  const levelMap = {
    1: HeadingLevel.HEADING_1,
    2: HeadingLevel.HEADING_2,
    3: HeadingLevel.HEADING_3,
    4: HeadingLevel.HEADING_4,
  };
  return new Paragraph({
    heading: levelMap[level] || HeadingLevel.HEADING_4,
    spacing: { before: 260, after: 120 },
    children: [new TextRun({ text, bold: true, font: '微软雅黑', color: level === 1 ? '2F5496' : '1F3864' })],
  });
}

function mkParagraph(text) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 340 },
    children: parseInline(text),
  });
}

function mkBullet(text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 40, line: 320 },
    children: parseInline(text),
  });
}

function mkOrdered(text, idx) {
  return new Paragraph({
    numbering: undefined, // docx lib needs numbering config; keep as bullet fallback
    spacing: { before: 40, after: 40, line: 320 },
    children: [new TextRun({ text: `${idx}. `, bold: true, font: '微软雅黑' }), ...parseInline(text)],
  });
}

function mkCodeBlock(lines) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 300 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'F5F5F5' },
    border: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'DDDDDD' },
    },
    children: lines.map((l, i) => new TextRun({
      text: l, font: 'Consolas', size: 20, break: i === 0 ? 0 : 1,
    })),
  });
}

function mkQuote(text) {
  return new Paragraph({
    spacing: { before: 80, after: 80, line: 320 },
    indent: { left: 300 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FFF8E1' },
    children: parseInline(text),
  });
}

function mkTable(rows) {
  // rows: string[][]
  const numCols = Math.max(...rows.map(r => r.length));
  const tblRows = rows.map((cells, ri) => new TableRow({
    children: Array.from({ length: numCols }, (_, ci) => {
      const content = cells[ci] || '';
      return new TableCell({
        shading: ri === 0 ? { type: ShadingType.CLEAR, color: 'auto', fill: '2F5496' } : undefined,
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({
          spacing: { before: 20, after: 20 },
          children: [new TextRun({
            text: content,
            bold: ri === 0,
            color: ri === 0 ? 'FFFFFF' : '000000',
            font: '微软雅黑',
            size: 20,
          })],
        })],
      });
    }),
  }));
  return new Table({
    rows: tblRows,
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

// ---------- parse ----------
const children = [];
const lines = MD.split(/\r?\n/);
let i = 0;
while (i < lines.length) {
  const line = lines[i];

  // code block
  if (/^```/.test(line)) {
    const buf = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
    i++; // skip closing
    children.push(mkCodeBlock(buf));
    continue;
  }

  // table
  if (/^\|.+\|$/.test(line) && i + 1 < lines.length && /^\|[\s:|-]+\|$/.test(lines[i + 1])) {
    const rows = [];
    const header = line.split('|').slice(1, -1).map(s => s.trim());
    rows.push(header);
    i += 2;
    while (i < lines.length && /^\|.+\|$/.test(lines[i])) {
      rows.push(lines[i].split('|').slice(1, -1).map(s => s.trim()));
      i++;
    }
    children.push(mkTable(rows));
    children.push(new Paragraph({ text: '' })); // spacer
    continue;
  }

  // heading
  const h = line.match(/^(#{1,4})\s+(.+)$/);
  if (h) { children.push(mkHeading(h[2], h[1].length)); i++; continue; }

  // quote
  if (/^>\s?/.test(line)) { children.push(mkQuote(line.replace(/^>\s?/, ''))); i++; continue; }

  // unordered list
  if (/^[-*]\s+/.test(line)) {
    children.push(mkBullet(line.replace(/^[-*]\s+/, '')));
    i++; continue;
  }

  // ordered list
  const ol = line.match(/^(\d+)\.\s+(.+)$/);
  if (ol) { children.push(mkOrdered(ol[2], ol[1])); i++; continue; }

  // blank
  if (!line.trim()) { i++; continue; }

  // horizontal rule
  if (/^-{3,}$/.test(line.trim())) {
    children.push(new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'BFBFBF' } },
      spacing: { before: 80, after: 80 },
    }));
    i++; continue;
  }

  // paragraph
  children.push(mkParagraph(line));
  i++;
}

// ---------- build doc ----------
const doc = new Document({
  creator: 'FoxSay',
  title: 'FoxSay 系统逻辑 v1.0',
  styles: {
    default: {
      document: { run: { font: '微软雅黑', size: 22 } },
    },
  },
  sections: [{
    properties: { page: { margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 } } },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [new TextRun({ text: 'FoxSay 一站式恋爱宝典', bold: true, size: 44, font: '微软雅黑', color: '2F5496' })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        children: [new TextRun({ text: '系统逻辑文档 v1.0', bold: true, size: 30, font: '微软雅黑', color: '1F3864' })],
      }),
      ...children,
    ],
  }],
});

const outDir = 'C:/Users/jay/Desktop/升级吧老实人/一站式恋爱宝典系统逻辑版本';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, '系统逻辑1.0.docx');

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log('Written:', outPath, 'size=', buffer.length, 'bytes');
});
