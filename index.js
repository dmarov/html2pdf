#!/usr/bin/env node
const Koa = require('koa');
const Router = require('koa-better-router');
const kjwt = require('koa-jwt');
const fs = require('fs');
const path = require('path');

const apiV1 = require('./api/v1');
const args = require('./lib/args');

const app = new Koa();

let publicKey = fs.readFileSync(path.resolve(args.publicKey));
app.use(kjwt({ secret: publicKey }));

let apiV1Full = Router({ prefix: '/api/v1' });
apiV1Full.extend(apiV1);

app.use(apiV1.middleware());
app.use(apiV1Full.middleware());

app.listen(args.port);
