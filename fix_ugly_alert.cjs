const fs = require('fs');
const file = 'C:/FoxSay/src/components/MicroPracticePage.tsx';
let txt = fs.readFileSync(file, 'utf8');

// 1. Inject Toast state
if (!txt.includes('const [toastMsg, setToastMsg] = useState(')) {
  txt = txt.replace(
    'const [version, setVersion] = useState(0);',
    "const [toastMsg, setToastMsg] = useState('');\n  const flash = (m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(''), 1800); };\n  const [version, setVersion] = useState(0);"
  );
}

// 2. Replace alert
txt = txt.replace(/alert\(/g, 'flash(');

// 3. Inject Toast Component
let needle = `  return (
    <div style={{
      position: 'absolute', inset: 0,`;
let substitution = `  return (
    <div style={{
      position: 'absolute', inset: 0,
}}>
      {toastMsg && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px', borderRadius: '12px',
          zIndex: 9999, pointerEvents: 'none', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center', whiteSpace: 'nowrap', fontWeight: 600
        }}>
          {toastMsg}
        </div>
      )}
      <div style={{ display: 'none' // hack to keep the original style flowing //`;
if (!txt.includes('toastMsg && (')) {
  // Rather than guessing the white space, we just inject it directly after `  return (`
  txt = txt.replace(
    '  return (\n    <div style={{',
    `  return (\n    <div style={{`
  );
  // Actually better:
  txt = txt.replace(
    `  /* ============== HUB ============== */\n  const overallPct = stats.total > 0 ? Math.round((stats.correct / stats.total) \n* 100) : 0;\n  const freeUsed = !hasMicroVip && !canUseFreeMockToday();\n\n  return (\n    <div style={{\n      position: 'absolute', inset: 0,`,
    // wait the indentation above might mismatch. Let's do it safer:
    ''
  )
}
// Best injection:
// Look for   const freeUsed = !hasMicroVip && !canUseFreeMockToday();
//   return (
//     <div style={{ ... }}>
const idx = txt.indexOf('  return (\n    <div style={{');
if (idx > -1 && !txt.includes('toastMsg &&')) {
  const endDiv = txt.indexOf('>', idx);
  // insert right after the opening div
  txt = txt.slice(0, endDiv + 1) + 
  `\n      {toastMsg && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px', borderRadius: 8,
          zIndex: 9999, pointerEvents: 'none', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center', whiteSpace: 'nowrap'
        }}>
          {toastMsg}
        </div>
      )}` + txt.slice(endDiv + 1);
}

fs.writeFileSync(file, txt);
console.log('UI updated.');
