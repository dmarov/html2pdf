'use strict'

const puppeteer = require('puppeteer');
const request = require('request-promise-native');


// const browserPromise = puppeteer.launch({
//     executablePath: '/usr/local/bin/chrome',
// });


module.exports = async _ => {


    let res = await request('http://localhost:9222/json/version');
    let json = JSON.parse(res);

    let wsUrl = json.webSocketDebuggerUrl;
    const browserPromise = await puppeteer.connect({
        browserWSEndpoint: wsUrl,
    });
    let browser = await browserPromise;


    return await browser.newPage();

};

