const fs = require('fs');
const filepath = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let txt = fs.readFileSync(filepath, 'utf8');

// Replace the two empty columns in the theme list
txt = txt.replace(/<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(2, 1fr\)', gap: 12 \}\}>/, "<div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>");

// For each theme button, we change its width from auto in grid to something like 48% or fixed
// We'll replace width: '100%' in the button style for themes with a fixed width or flexBasis
txt = txt.replace(/width: '100%',\s*padding: 16,\s*borderRadius: 16,\s*position: 'relative'/g, "width: '46%', padding: '16px 12px', borderRadius: 16, position: 'relative'");

fs.writeFileSync(filepath, txt, 'utf8');
