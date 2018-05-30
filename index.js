#!/usr/bin/env node
const Koa = require('koa');
const Router = require('koa-better-router');
const apiV1 = require('./api/v1');

const app = new Koa();

let apiV1Router = Router({ prefix: '/api/v1' });
apiV1Router.extend(apiV1);

app.use(apiV1Router.middleware());

app.listen(3001);
