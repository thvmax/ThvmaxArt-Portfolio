const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // Wait for loader to finish
  await new Promise(r => setTimeout(r, 5000));

  // Scroll to #work
  await page.evaluate(() => {
    document.querySelector('#work').scrollIntoView();
  });

  await new Promise(r => setTimeout(r, 2000));

  // Get info about what might be covering the screen or why it's black
  const debugInfo = await page.evaluate(() => {
    const work = document.querySelector('#work');
    const workLeft = document.querySelector('.work-left');
    const workRight = document.querySelector('.work-right');
    const revealItems = document.querySelectorAll('#work .reveal');
    const canvases = document.querySelectorAll('.proj-canvas');
    
    let info = {
      workRect: work ? work.getBoundingClientRect() : null,
      workLeftRect: workLeft ? workLeft.getBoundingClientRect() : null,
      workRightRect: workRight ? workRight.getBoundingClientRect() : null,
      workStyles: work ? window.getComputedStyle(work).cssText : '',
      reveals: Array.from(revealItems).map(el => ({
        rect: el.getBoundingClientRect(),
        opacity: window.getComputedStyle(el).opacity,
        transform: window.getComputedStyle(el).transform,
      })),
      canvases: Array.from(canvases).map(el => ({
        rect: el.getBoundingClientRect(),
        opacity: window.getComputedStyle(el).opacity,
        zIndex: window.getComputedStyle(el).zIndex,
        clipPath: window.getComputedStyle(el).clipPath,
      })),
      documentBodyHeight: document.body.scrollHeight,
      windowScrollY: window.scrollY
    };
    return info;
  });

  console.log(JSON.stringify(debugInfo, null, 2));
  
  await browser.close();
})();
