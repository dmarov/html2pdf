'use strict';

const Router = require('koa-better-router');

const hrefToPdf = require('./href-to-pdf');

const routes = Router();

routes.extend(hrefToPdf);

module.exports = routes;

