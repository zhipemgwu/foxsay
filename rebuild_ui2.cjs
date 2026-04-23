const fs = require('fs');

const path = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let txt = fs.readFileSync(path, 'utf8');

// 1. Add lucide-react imports if not there
if (!txt.includes('lucide-react')) {
  txt = txt.replace(/import \{([^}]+)\} from 'react';/, 
    "import { $1 } from 'react';\nimport { Play, FileText, BookOpen, Crown, BrainCircuit, ArrowRight, Star, Clock } from 'lucide-react';"
  );
} else {
  // Add missing icons
  txt = txt.replace(/import \{([^}]+)\} from 'lucide-react';/,
    "import { Play, FileText, BookOpen, Crown, BrainCircuit, ArrowRight, Star, Clock, AlertCircle } from 'lucide-react';"
  );
}

const newMiddleBlock = `
      {/* 高级 Bento Grid 模块区 */}
      <div style={{ marginTop: 24, marginBottom: 32, padding: '0 4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          
          {/* 1. 核心模块：今日推荐 (全宽) */}
          <button
            onClick={startDaily}
            style={{
              gridColumn: '1 / -1',
              position: 'relative',
              overflow: 'hidden',
              padding: 24,
              borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(255,213,160,0.1) 0%, rgba(255,106,136,0.05) 100%)',
              border: '1px solid rgba(255,213,160,0.2)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            {/* 炫光点缀 */}
            <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, background: 'rgba(255,106,136,0.15)', filter: 'blur(40px)', borderRadius: '50%' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: 16, position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ background: 'linear-gradient(135deg, #ffb367, #ff6a88)', padding: 8, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Play size={20} color="#fff" fill="#fff" />
                </div>
                <div style={{ color: '#FFD5A0', fontSize: 13, fontWeight: 800, letterSpacing: 1 }}>TODAY'S PICK</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, color: 'rgba(245,239,232,0.8)' }}>
                {dailyPicks.filter(p => p.answered).length} / {dailyPicks.length} 题
              </div>
            </div>
            
            <div style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 6, position: 'relative', zIndex: 1 }}>
              快速开练 
            </div>
            <div style={{ fontSize: 13, color: 'rgba(245,239,232,0.6)', position: 'relative', zIndex: 1 }}>
              为你量身定制的每日核心训练
            </div>
          </button>

          {/* 2. 模拟考 */}
          <button onClick={startMock} style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ background: 'rgba(154,199,255,0.1)', padding: 10, borderRadius: 12, color: '#9AC7FF' }}>
                <FileText size={22} />
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 6 }}>
                {hasMicroVip ? '+按分类' : (freeUsed ? '次数尽' : '免费1次')}
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f5efe8', marginBottom: 4 }}>全真模拟</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.5)' }}>随机50题摸底</div>
          </button>

          {/* 3. 错题本 */}
          <button onClick={startWrongBook} style={{ padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(255,176,128,0.1)', padding: 10, borderRadius: 12, color: '#FFB080' }}>
                <BookOpen size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f5efe8', marginBottom: 4 }}>错题本</div>
            <div style={{ fontSize: 12, color: 'rgba(245,239,232,0.5)' }}>待复习 {wrongIds.length} 题</div>
          </button>

          {/* 4. 进阶库 (VIP) */}
          <button onClick={startAdvancedBank} style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(145deg, rgba(255,213,160,0.08) 0%, rgba(255,213,160,0.02) 100%)', border: '1px solid rgba(255,213,160,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            {!hasMicroVip && <div style={{ position: 'absolute', right: -24, top: 12, background: 'linear-gradient(90deg, #FFD5A0, #FFBD73)', color: '#3a2c17', fontSize: 9, fontWeight: 900, padding: '2px 24px', transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: 1 }}>VIP</div>}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(255,213,160,0.15)', padding: 10, borderRadius: 12, color: '#FFD5A0' }}>
                <Crown size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#FFD5A0', marginBottom: 4 }}>进阶题库</div>
            <div style={{ fontSize: 12, color: 'rgba(255,213,160,0.6)' }}>高难度挑战</div>
          </button>

          {/* 5. 深度复盘 (PRO) */}
          <button onClick={startDeepReview} style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(145deg, rgba(247,166,217,0.08) 0%, rgba(247,166,217,0.02) 100%)', border: '1px solid rgba(247,166,217,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', cursor: 'pointer', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -24, top: 12, background: 'linear-gradient(90deg, #F7A6D9, #EC407A)', color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 24px', transform: 'rotate(45deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)', letterSpacing: 1 }}>PRO</div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'flex-start', marginBottom: 12 }}>
               <div style={{ background: 'rgba(247,166,217,0.15)', padding: 10, borderRadius: 12, color: '#F7A6D9' }}>
                <BrainCircuit size={22} />
              </div>
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#F7A6D9', marginBottom: 4 }}>深度复盘</div>
            <div style={{ fontSize: 12, color: 'rgba(247,166,217,0.6)' }}>巩固与强化</div>
          </button>
          
        </div>
      </div>

      {/* 按主题练习：极简列表式卡片设计 */}
      <div style={{ margin: '0 4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Star size={18} color="#FFD5A0" fill="#FFD5A0" />
          <span style={{ fontSize: 18, fontWeight: 900, color: '#f5efe8', letterSpacing: 0.5 }}>按主题精练</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {(Object.keys(CATEGORY_META) as QuizCategory[]).map(cat => {
            const meta = CATEGORY_META[cat];
            const allCount = getByCategory(cat).length;
            const freeCount = getByCategory(cat).filter(q => freePool.some(f => f.id === q.id)).length;
            const count = hasMicroVip ? allCount : freeCount;
            const catStat = stats.byCategory[cat];
            const catPct = catStat && catStat.total > 0 ? Math.round((catStat.correct / catStat.total) * 100) : 0;
            
            return (
              <button
                key={cat}
                onClick={() => startCategory(cat)}
                style={{
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
                }}
              >
                {/* 装饰色条 */}
                <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 4, background: count > 0 ? meta.color : 'transparent', borderRadius: '0 4px 4px 0', opacity: 0.8 }} />
                
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
                </div>
              </button>
            );
          })}
        </div>
      </div>
`;

const startBound = "{/* 核心刷题区（驾校宝典式大环形居中布局） */}";
const endBound = "{showMockCategoryPicker && (";

const startIndex = txt.indexOf(startBound);
const endIndex = txt.indexOf(endBound);

if (startIndex !== -1 && endIndex !== -1) {
  // Be careful to keep the `showMockCategoryPicker` part
  txt = txt.substring(0, startIndex) + newMiddleBlock + '\n      ' + txt.substring(endIndex);
  
  // A small cleanup: remove that extra div that might be dangling
  txt = txt.replace(/<div className="grid grid-cols-2 gap-3"[\s\S]*?<\/div>\s*<\/div>\s*\{showMockCategoryPicker/, "{showMockCategoryPicker");

  fs.writeFileSync(path, txt, 'utf8');
  console.log("UI Replacement successful!");
} else {
  console.log("Could not find startBound or endBound.");
}
