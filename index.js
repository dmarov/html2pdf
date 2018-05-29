#!/usr/bin/env node
const puppeteer = require('puppeteer');


(async () => {
  const browser = await puppeteer.launch({
  executablePath: '/usr/local/bin/chrome',
});
  const page = await browser.newPage();
  await page.goto('https://google.com', {waitUntil: 'networkidle2'});
  await page.pdf({path: 'result.pdf', format: 'A4'});

  await browser.close();
})();
