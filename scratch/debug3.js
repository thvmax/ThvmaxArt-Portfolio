const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 5000));

  await page.evaluate(() => {
    document.querySelector('#work').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 2000));

  const debugInfo = await page.evaluate(() => {
    const list = document.querySelector('#projectsList');
    const workImages = document.querySelectorAll('.work-img-wrapper');
    return {
      listTransform: list ? window.getComputedStyle(list).transform : null,
      listRect: list ? list.getBoundingClientRect() : null,
      firstImageOpacity: workImages[0] ? window.getComputedStyle(workImages[0]).opacity : null,
      firstImageZ: workImages[0] ? window.getComputedStyle(workImages[0]).zIndex : null,
    };
  });

  console.log(JSON.stringify(debugInfo, null, 2));
  await browser.close();
})();
