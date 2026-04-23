const fs = require('fs');

const path = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let txt = fs.readFileSync(path, 'utf8');

// Replace standard stuff
txt = txt.replace(
  '<div style={{ fontSize: 16, fontWeight: 800, marginBottom: 10 }}>按主题练习</div>',
  '<div style={{ fontSize: 18, fontWeight: 900, marginBottom: 14, color: \'#FFD5A0\', letterSpacing: 0.5 }}>✨ 按主题练习</div>'
);
txt = txt.replace(
  '      <div style={{ display: \'grid\', gridTemplateColumns: \'1fr 1fr\', gap: 10 }}>',
  '      <div className=\"grid grid-cols-2 gap-3\">'
);

txt = txt.replace(
  /padding: 14, borderRadius: 14, textAlign: 'left', cursor: count > 0 \? 'pointer' : 'not-allowed',\n\s*background: count > 0 \? `\$\{meta.color\}18` : 'rgba\(255,255,255,0.04\)',\n\s*border: `1px solid \$\{count > 0 \? meta\.color \+ '55' : 'rgba\(255,255,255,0.09\)'}`,\n\s*color: '#f5efe8', opacity: count > 0 \? 1 : 0\.5,\n\s*position: 'relative',/g,
  `padding: '16px 14px', borderRadius: 18, cursor: count > 0 ? 'pointer' : 'not-allowed',
                background: count > 0 ? \`linear-gradient(145deg, rgba(255,255,255,0.06), \${meta.color}10)\` : 'rgba(255,255,255,0.02)',
                border: \`1px solid \${count > 0 ? meta.color + '40' : 'rgba(255,255,255,0.05)'}\`,
                boxShadow: count > 0 ? \`0 8px 24px \${meta.color}15\` : 'none',
                color: '#f5efe8', opacity: count > 0 ? 1 : 0.5,
                position: 'relative', overflow: 'hidden', textAlign: 'left'`
);

txt = txt.replace(
  /\{!hasMicroVip && allCount > freeCount && \([\s\S]*?VIP<\/span>\s*\)\}/g,
  `{!hasMicroVip && allCount > freeCount && (
                <span style={{
                  position: 'absolute', right: 10, top: 10,
                  fontSize: 10, color: '#2a1f13', fontWeight: 800,
                  background: 'linear-gradient(135deg, #FFD5A0, #FFBD73)', borderRadius: 999, padding: '2px 8px',
                  boxShadow: '0 2px 8px rgba(255,213,160,0.4)',
                }}>VIP</span>
              )}`
);

txt = txt.replace(
  /<div style={{ fontSize: 24 }}>\{meta\.emoji\}<\/div>/g,
  `{count > 0 && <div style={{ position: 'absolute', right: -20, top: -20, width: 80, height: 80, background: meta.color, opacity: 0.15, filter: 'blur(30px)', borderRadius: '50%' }} />}
              <div style={{ fontSize: 26, filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>{meta.emoji}</div>`
);

txt = txt.replace(
  /<div style={{ color: meta\.color, fontWeight: 700, fontSize: 14, marginTop: 4 }}>\{meta\.label\}<\/div>/g,
  `<div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span style={{ color: '#fff', fontWeight: 800, fontSize: 15, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>{meta.label}</span>
              </div>`
);

txt = txt.replace(
  /<div style={{ color: 'rgba\(245,239,232,0\.55\)', fontSize: 11, marginTop: 2 }}>\{meta\.desc\}<\/div>/g,
  `<div style={{ color: 'rgba(245,239,232,0.6)', fontSize: 11, marginTop: 4, lineHeight: 1.4, height: 32 }}>{meta.desc}</div>`
);

txt = txt.replace(
  /<div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, fontWeight: 600 }}>\s*<span style={{ color: 'rgba\(245,239,232,0\.55\)' }}>\s*\{hasMicroVip \? `\$\{allCount\} 题` : `\$\{freeCount\} \/ \$\{allCount\} 题`\}\s*<\/span>\s*\{catStat && catStat\.total > 0 && <span style={{ color: meta\.color }}>\{catPct\}%<\/span>\}\s*<\/div>/g,
  `<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ color: 'rgba(245,239,232,0.5)', fontSize: 11, fontWeight: 500 }}>
                  {hasMicroVip ? \`\${allCount} 题\` : \`\${freeCount} / \${allCount} 题\`}
                </span>
                {catStat && catStat.total > 0 && (
                  <span style={{ 
                    color: meta.color, fontSize: 11, fontWeight: 800, 
                    background: \`\${meta.color}20\`, padding: '2px 6px', borderRadius: 6 
                  }}>{catPct}% 掌握</span>
                )}
              </div>`
);

fs.writeFileSync(path, txt, 'utf8');
