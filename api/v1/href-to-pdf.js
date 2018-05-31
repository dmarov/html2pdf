const Router = require('koa-better-router');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const args = require('../../lib/args');
const kjwt = require('koa-jwt');

const router = new Router().loadMethods();

let publicKey = fs.readFileSync(path.resolve(args.publicKey));

router.addRoute('OPTIONS', '/', async (ctx, next) => {

    console.log(ctx.request.headers);
    ctx.append('Access-Control-Allow-Origin', ctx.request.headers.origin);
    ctx.append('Access-Control-Allow-Headers', 'authorization');
    ctx.append('Access-Control-Allow-Method', 'GET');
    ctx.append('Access-Control-Allow-Credentials', 'true');
    ctx.status = 200;

});

router.get('/', kjwt({ secret: publicKey }), async (ctx, next) => {

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

        const browser = await puppeteer.launch({
            executablePath: '/usr/local/bin/chrome',
        });

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


        const page = await browser.newPage();
        await page.goto(href, {waitUntil: 'networkidle2'});
        let buf = await page.pdf(params);
        await browser.close();

        ctx.set("Content-Type", "application/pdf");
        ctx.set("Content-Disposition", `attachment; filename="${name}"`);
        ctx.response.body = buf;

    } catch (e) {

        ctx.response.status = 500;

    }

});

module.exports = router;
