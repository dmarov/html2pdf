#!/usr/bin/env node
const Koa = require('koa');
const Router = require('koa-better-router');

const apiV1 = require('./api/v1');
const args = require('./lib/args');

module.exports = async _ => {

    let browser = await browserPromise;
    return await browser.newPage();

};

const app = new Koa();

let apiV1Full = Router({ prefix: '/api/v1' });
apiV1Full.extend(apiV1);

app.use(apiV1.middleware());
app.use(apiV1Full.middleware());

app.listen(args.port);
