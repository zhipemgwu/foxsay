const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 420, height: 900 });

  const consoleMsgs = [];
  const pageErrors = [];
  const failedRequests = [];

  page.on('console', msg => {
    consoleMsgs.push({ type: msg.type(), text: msg.text(), location: msg.location() });
  });
  page.on('pageerror', err => {
    pageErrors.push({ message: err.message, stack: err.stack });
  });
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), errorText: req.failure()?.errorText, method: req.method() });
  });
  page.on('response', resp => {
    if (resp.status() >= 400) {
      failedRequests.push({ url: resp.url(), status: resp.status(), statusText: resp.statusText() });
    }
  });

  // Pre-seed localStorage to bypass onboarding
  await page.evaluateOnNewDocument(() => {
    try {
      // Set migration flag first so our keys aren't touched
      localStorage.setItem('foxsay:__migrated_v1', '1');
      localStorage.setItem('foxsay_stage', 'main');
      localStorage.setItem('foxsay:stage', 'main');
      localStorage.setItem('foxsay:onboarding_done', '1');
    } catch(e){}
  });

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 5000));
  } catch (e) {
    pageErrors.push({ message: 'goto error: ' + e.message, stack: e.stack });
  }

  // Probe DOM
  const probe = await page.evaluate(() => {
    const bodyText = document.body ? document.body.innerText.slice(0, 2000) : '(no body)';
    const root = document.getElementById('root');
    const rootHTML = root ? root.innerHTML.slice(0, 3000) : '(no root)';
    const keys = Object.keys(localStorage);
    const ls = {};
    keys.forEach(k => { ls[k] = localStorage.getItem(k)?.slice(0,200); });
    return { bodyText, rootHTML, ls, url: location.href };
  });

  await page.screenshot({ path: 'C:\\FoxSay\\scripts\\capture-initial.png' });

  // Try to click through onboarding buttons
  const clicks = [];
  for (let i = 0; i < 10; i++) {
    const clicked = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button, [role=button]'));
      for (const b of btns) {
        const t = (b.innerText || '').trim();
        if (/跳过，先逛逛|30秒快速开始|开始|继续|下一步|立即体验|进入|^跳过$|Skip|Start/i.test(t)) {
          b.click();
          return t;
        }
      }
      return null;
    });
    if (!clicked) break;
    clicks.push(clicked);
    await new Promise(r => setTimeout(r, 900));
  }

  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'C:\\FoxSay\\scripts\\capture-after-clicks.png' });

  const probe2 = await page.evaluate(() => {
    const bodyText = document.body ? document.body.innerText.slice(0, 2000) : '(no body)';
    return { bodyText, url: location.href };
  });

  console.log('=== INITIAL URL ===', probe.url);
  console.log('=== INITIAL LOCALSTORAGE ===', JSON.stringify(probe.ls, null, 2));
  console.log('=== INITIAL BODY TEXT (2000) ===\n' + probe.bodyText);
  console.log('=== INITIAL ROOT HTML (3000) ===\n' + probe.rootHTML);
  console.log('=== CLICKS SEQUENCE ===', JSON.stringify(clicks));
  console.log('=== AFTER-CLICK URL ===', probe2.url);
  console.log('=== AFTER-CLICK BODY TEXT ===\n' + probe2.bodyText);

  console.log('\n=== CONSOLE MESSAGES ===');
  for (const m of consoleMsgs) {
    console.log(`[${m.type}] ${m.text}`);
    if (m.location && m.location.url) console.log('  at', m.location.url, m.location.lineNumber);
  }
  console.log('\n=== PAGE ERRORS ===');
  for (const e of pageErrors) {
    console.log('MESSAGE:', e.message);
    if (e.stack) console.log('STACK:', e.stack);
    console.log('---');
  }
  console.log('\n=== FAILED REQUESTS ===');
  for (const f of failedRequests) {
    console.log(JSON.stringify(f));
  }

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
