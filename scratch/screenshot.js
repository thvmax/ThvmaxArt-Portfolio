const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Wait for loader to finish
  await new Promise(r => setTimeout(r, 5000));

  // Scroll to #work
  await page.evaluate(() => {
    document.querySelector('#work').scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: 'scratch/screenshot.png' });
  
  await browser.close();
})();
