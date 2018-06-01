'use strict'

const puppeteer = require('puppeteer');
const request = require('request-promise-native');

module.exports = async _ => {

    let res = await request('http://localhost:9222/json/version');
    let json = JSON.parse(res);

    let wsUrl = json.webSocketDebuggerUrl;
    const browser = await puppeteer.connect({
        browserWSEndpoint: wsUrl,
    });

    return await browser.newPage();

};

