'use strict'

const puppeteer = require('puppeteer');

const browserPromise = puppeteer.launch({
    executablePath: '/usr/local/bin/chrome',
});

module.exports = async _ => {

    let browser = await browserPromise;
    return await browser.newPage();

};

