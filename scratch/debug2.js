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
    const serializeRect = (rect) => rect ? {x: rect.x, y: rect.y, width: rect.width, height: rect.height} : null;
    const work = document.querySelector('#work');
    const workLeft = document.querySelector('.work-left');
    const workRight = document.querySelector('.work-right');
    const header = document.querySelector('#work .section-header');
    
    return {
      workRect: serializeRect(work?.getBoundingClientRect()),
      workLeftRect: serializeRect(workLeft?.getBoundingClientRect()),
      workRightRect: serializeRect(workRight?.getBoundingClientRect()),
      headerRect: serializeRect(header?.getBoundingClientRect()),
      workOpacity: work ? window.getComputedStyle(work).opacity : null,
      workVisibility: work ? window.getComputedStyle(work).visibility : null,
    };
  });

  console.log(JSON.stringify(debugInfo, null, 2));
  await browser.close();
})();
