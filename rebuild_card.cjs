const fs = require('fs');
const path = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Change daily picks to 30 items
// First, find how dailyPicks are generated
if (txt.includes('const dailyPicks = ')) {
  // Let's just find and replace the daily generator
  // It probably looks like useMemo(() => { ... }, [])
  txt = txt.replace(/useMemo\(\(\) => \{[\s\S]*?const pool = getAll\(\);\n?[\s\S]*?return [^;]+;/i, (match) => {
     return `useMemo(() => {
    const pool = getAll();
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 30);
  }, []);`;
  });
}

// 2. Change the category list layout to Bento grid
// Search for string `<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>`
// and `Object.keys(CATEGORY_META)`
const startCat = /<div style=\{\{\s*display:\s*'flex',\s*flexDirection:\s*'column',\s*gap:\s*10\s*\}\}>/g;
txt = txt.replace(startCat, `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>`);

// And since they are now in a grid, adjust padding and layout inside the button
// We'll replace the button style inside the category loop
const oldBtnStyle = `                style={{
                  padding: '16px 20px', 
                  borderRadius: 20, 
                  textAlign: 'left', 
                  cursor: count > 0 ? 'pointer' : 'not-allowed',
                  background: count > 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  border: count > 0 ? '1px solid rgba(255,255,255,0.06)' : '1px dashed rgba(255,255,255,0.03)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  opacity: count > 0 ? 1 : 0.5,
                }}`;

const newBtnStyle = `                style={{
                  padding: '16px 14px', 
                  borderRadius: 20, 
                  textAlign: 'left', 
                  cursor: count > 0 ? 'pointer' : 'not-allowed',
                  background: count > 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)',
                  border: count > 0 ? '1px solid rgba(255,255,255,0.06)' : '1px dashed rgba(255,255,255,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  opacity: count > 0 ? 1 : 0.5,
                  minHeight: 120
                }}`;

txt = txt.replace(oldBtnStyle, newBtnStyle);

// Now adjust the internal layout of the card to fit bento format
const oldCardInside = `<div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4, background: count > 0 ? meta.color : 'transparent', borderRadius: '0 4px 4px 0', opacity: 0.8 }} />
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* 使用抽象化文字/色彩气泡代替丑陋大Emoji */}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: \`\${meta.color}15\`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
                    {meta.emoji}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 800, color: count > 0 ? '#f5efe8' : 'rgba(245,239,232,0.3)', letterSpacing: 0.5 }}>{meta.label}</span>
                      {!hasMicroVip && allCount > freeCount && (
                        <span style={{
                          fontSize: 9, color: '#3a2c17', fontWeight: 900,
                          background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', borderRadius: 6, padding: '2px 6px',
                        }}>VIP</span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.5)', fontWeight: 500 }}>{meta.desc}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(245,239,232,0.7)' }}>
                    {hasMicroVip ? \`\${allCount} 题\` : \`\${freeCount} / \${allCount} 题\`}
                  </div>
                  {catStat && catStat.total > 0 && (
                    <div style={{ fontSize: 11, color: meta.color, background: \`\${meta.color}15\`, padding: '2px 8px', borderRadius: 8, fontWeight: 700 }}>
                      正确率 {catPct}%
                    </div>
                  )}
                </div>`;

const newCardInside = `<div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, background: count > 0 ? meta.color : 'transparent', filter: 'blur(30px)', borderRadius: '50%', opacity: 0.15 }} />
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: \`\${meta.color}15\`, color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    {meta.emoji}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    {!hasMicroVip && allCount > freeCount && (
                      <span style={{
                        fontSize: 9, color: '#3a2c17', fontWeight: 900,
                        background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', borderRadius: 6, padding: '2px 6px',
                        marginBottom: 4
                      }}>VIP</span>
                    )}
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(245,239,232,0.5)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 8 }}>
                      {hasMicroVip ? \`\${allCount}\` : \`\${freeCount} / \${allCount}\`}
                    </span>
                  </div>
                </div>

                <div style={{ flex: 1 }} />
                
                <div style={{ fontSize: 16, fontWeight: 800, color: count > 0 ? '#f5efe8' : 'rgba(245,239,232,0.3)', letterSpacing: 0.5, marginBottom: 4 }}>
                  {meta.label}
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: 'rgba(245,239,232,0.4)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '65%' }}>
                    {meta.desc}
                  </div>
                  {catStat && catStat.total > 0 && (
                    <div style={{ fontSize: 10, color: meta.color, fontWeight: 800 }}>
                      {catPct}%
                    </div>
                  )}
                </div>`;

txt = txt.replace(oldCardInside, newCardInside);
fs.writeFileSync(path, txt, 'utf8');
console.log("MicroPracticePage UI + 30 daily picks updated!");
