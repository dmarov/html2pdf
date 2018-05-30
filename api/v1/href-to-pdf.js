const Router = require('koa-better-router');
const puppeteer = require('puppeteer');

const router = new Router().loadMethods();

router.get('/', async (ctx, next) => {

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

        ctx.set("Content-Type", "application/octet-stream");
        ctx.set("Content-Disposition", `attachment; filename="${name}"`);
        ctx.response.body = buf;

    } catch (e) {

        ctx.response.status = 500;

    }

});

module.exports = router;
