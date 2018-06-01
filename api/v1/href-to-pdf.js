const Router = require('koa-better-router');
const fs = require('fs');
const path = require('path');
const args = require('../../lib/args');
const jwt = require('jsonwebtoken');
const getBrowserPage = require('../../lib/get-browser-page');
const sha1 = require('sha1');

const router = new Router().loadMethods();

let publicKey = fs.readFileSync(path.resolve(args.publicKey));

router.get('/', async (ctx, next) => {

    let token = ctx.query.jwt;

    try {

        let payload = jwt.verify(token, publicKey);
        if (sha1(ctx.params.href) !== payload.sha1) {

            ctx.status = 403;
            ctx.body = 'not allowed link';
            return;
        }

    } catch(e) {

        if (e.name === 'JsonWebTokenError' || e.name === 'TokenExpiredError') {

            console.log(e);
            ctx.status = 403;
            ctx.body = 'invalid token';
            return;

        } else throw e;

    }

    await next();

}, async (ctx, next) => {

    try {

        let query = ctx.request.query;
        let href = query.href;

        if (!href) {

            ctx.response.status = 404;
            ctx.response.body = 'reference to document was not specified';
            return;

        }

        let name = query.name ? query.name : 'response.pdf';
        let scale = query.scale ? query.scale : 1;
        let format = 'A4';
        let width = '';
        let height = '';
        let margin = {
            top: query.top ? query.top : 0,
            bottom: query.bottom ? query.bottom : 0,
            left: query.left ? query.left : 0,
            right: query.right ? query.right : 0,
        }

        let params = {
            scale: scale,
            margin: margin,
        };

        if (width && height) {

            params['width'] = width;
            params['height'] = height;

        } else {

            params['format'] = format;

        }

        let page = await getBrowserPage();
        await page.goto(href, {waitUntil: 'networkidle2'});
        let buf = await page.pdf(params);
        await page.close();
        // await browser.close();
        console.log("ok\n");

        ctx.set("Content-Type", "application/pdf");
        ctx.set("Content-Disposition", `attachment; filename="${name}"`);
        ctx.response.body = buf;

    } catch (e) {

        ctx.response.status = 500;

    }

});

module.exports = router;
