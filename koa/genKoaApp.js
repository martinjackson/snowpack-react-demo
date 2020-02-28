
const fs = require('fs');
const koa = require('koa');
const helmet = require("koa-helmet");    // koa-helmet >=2.x (master branch) supports koa 2.x

function genApp() {
    const app = new koa();
    app.use(helmet());

    // response
    app.use(ctx => {
      ctx.body = 'Hello Koa';
    });

    return app.callback();
}

module.exports = genApp;