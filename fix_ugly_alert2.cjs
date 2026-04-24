const fs = require('fs');
const file = 'C:/FoxSay/src/components/MicroPracticePage.tsx';
let txt = fs.readFileSync(file, 'utf8');

if (!txt.includes('const [toastMsg, setToastMsg] = useState(')) {
  txt = txt.replace(
    'const [version, setVersion] = useState(0);',
    "const [toastMsg, setToastMsg] = useState('');\n  const flash = (m: string) => { setToastMsg(m); setTimeout(() => setToastMsg(''), 1800); };\n  const [version, setVersion] = useState(0);"
  );
}

txt = txt.replace(/alert\(/g, 'flash(');

const hubIdx = txt.indexOf('/* ============== HUB ============== */');
const returnIdx = txt.indexOf('return (', hubIdx);
const beginEndDiv = txt.indexOf('>', returnIdx);

if (beginEndDiv > -1 && !txt.includes('{toastMsg && (')) {
  txt = txt.slice(0, beginEndDiv + 1) + 
  `\n      {toastMsg && (
        <div style={{
          position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          background: 'rgba(0,0,0,0.85)', color: '#fff', padding: '12px 24px', borderRadius: 8,
          zIndex: 9999, pointerEvents: 'none', fontSize: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          textAlign: 'center', whiteSpace: 'nowrap'
        }}>
          {toastMsg}
        </div>
      )}` + txt.slice(beginEndDiv + 1);
}

fs.writeFileSync(file, txt);
console.log('UI updated.');
