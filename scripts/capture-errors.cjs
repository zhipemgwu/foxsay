const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();

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

  try {
    await page.goto('http://localhost:5173', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(r => setTimeout(r, 4000));
  } catch (e) {
    pageErrors.push({ message: 'goto error: ' + e.message, stack: e.stack });
  }

  const shot = 'C:\\FoxSay\\scripts\\capture.png';
  try {
    await page.screenshot({ path: shot, fullPage: false });
  } catch (e) {
    pageErrors.push({ message: 'screenshot error: ' + e.message });
  }

  console.log('=== CONSOLE MESSAGES ===');
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
  console.log('\nScreenshot saved to', shot);

  await browser.close();
})().catch(e => { console.error('FATAL', e); process.exit(1); });
