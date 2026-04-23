const fs = require('fs');
const filepath = 'C:\\FoxSay\\src\\components\\MicroPracticePage.tsx';
let txt = fs.readFileSync(filepath, 'utf8');

const newCenterBlock = `
      {/* 核心刷题区（驾校宝典式大环形居中布局） */}
      <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '20px 0 32px', height: 260 }}>
        
        {/* 中心发光渐变背景 */}
        <div style={{ position: 'absolute', width: 220, height: 220, background: 'radial-gradient(circle, rgba(255,213,160,0.15) 0%, transparent 70%)', borderRadius: '50%', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0 }} />

        {/* 左侧环绕按钮 1：模拟考 */}
        <button onClick={startMock} style={{ position: 'absolute', left: '8%', top: '10%', zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: 'linear-gradient(135deg,rgba(154,199,255,0.2),rgba(154,199,255,0.05))', border: '1px solid rgba(154,199,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
            📝
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#f5efe8', marginTop: 8 }}>全真模拟</div>
          <div style={{ fontSize: 10, color: 'rgba(245,239,232,0.5)', marginTop: 2 }}>{hasMicroVip ? '+按分类' : (freeUsed ? '次数用完' : '免费1次')}</div>
        </button>

        {/* 左侧环绕按钮 2：错题本 */}
        <button onClick={startWrongBook} style={{ position: 'absolute', left: '6%', bottom: '10%', zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: 'linear-gradient(135deg,rgba(255,176,128,0.2),rgba(255,176,128,0.05))', border: '1px solid rgba(255,176,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
            📕
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#f5efe8', marginTop: 8 }}>错题本</div>
          <div style={{ fontSize: 10, color: 'rgba(245,239,232,0.5)', marginTop: 2 }}>{wrongIds.length} 题待刷</div>
        </button>

        {/* 中央主按钮：今日推荐 (startDaily) */}
        <button
          onClick={startDaily}
          style={{
            position: 'relative', width: 130, height: 130, borderRadius: '50%',
            background: 'linear-gradient(135deg,#ffb367,#ff6a88)',
            border: '4px solid rgba(255,255,255,0.1)',
            boxShadow: '0 12px 32px rgba(255,106,136,0.4), inset 0 -8px 16px rgba(0,0,0,0.1)',
            color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', zIndex: 20,
          }}
        >
          <div style={{ fontSize: 32, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))', marginBottom: 4 }}>🎯</div>
          <div style={{ fontSize: 18, fontWeight: 900, textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>快速开练</div>
          <div style={{ fontSize: 11, fontWeight: 600, opacity: 0.9, marginTop: 4, background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: 10 }}>
             {dailyPicks.filter(p => p.answered).length} / {dailyPicks.length}
          </div>
        </button>

        {/* 右侧环绕按钮 1：进阶库 */}
        <button onClick={startAdvancedBank} style={{ position: 'absolute', right: '8%', top: '10%', zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
          {!hasMicroVip ? (
             <div style={{ position: 'absolute', top: -8, right: -4, background: 'linear-gradient(135deg, #FFD5A0, #FFBD73)', color: '#3a2c17', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 11 }}>VIP</div>
          ) : null}
          <div style={{ width: 54, height: 54, borderRadius: 27, background: 'linear-gradient(135deg,rgba(255,213,160,0.2),rgba(255,213,160,0.05))', border: '1px solid rgba(255,213,160,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
            👑
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#f5efe8', marginTop: 8 }}>进阶题库</div>
          <div style={{ fontSize: 10, color: 'rgba(245,239,232,0.5)', marginTop: 2 }}>{hasMicroVip ? '已解锁' : '锁'}</div>
        </button>

        {/* 右侧环绕按钮 2：深度复盘 */}
        <button onClick={startDeepReview} style={{ position: 'absolute', right: '6%', bottom: '10%', zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'center' }}>
           <div style={{ position: 'absolute', top: -8, right: -4, background: 'linear-gradient(135deg, #F7A6D9, #EC407A)', color: '#fff', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.5)', zIndex: 11 }}>PRO</div>
          <div style={{ width: 54, height: 54, borderRadius: 27, background: 'linear-gradient(135deg,rgba(247,166,217,0.2),rgba(247,166,217,0.05))', border: '1px solid rgba(247,166,217,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', backdropFilter: 'blur(10px)' }}>
            🧠
          </div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#f5efe8', marginTop: 8 }}>深度复盘</div>
          <div style={{ fontSize: 10, color: 'rgba(245,239,232,0.5)', marginTop: 2 }}>强化巩固</div>
        </button>
      </div>

`;

// Using Regex to find boundaries
const regex = /<button\s+onClick=\{startDaily\}[\s\S]*?(<div style=\{\{\s*fontSize:\s*18,\s*fontWeight:\s*900,\s*marginBottom:\s*14,\s*color:\s*'#FFD5A0')/;

if(regex.test(txt)) {
  txt = txt.replace(regex, newCenterBlock + "$1");
  fs.writeFileSync(filepath, txt, 'utf8');
  console.log("Success");
} else {
  console.log("Regex not matched.");
}
