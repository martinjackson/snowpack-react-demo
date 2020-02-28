
const fs = require('fs');
const http2 = require('http2');
const koa = require('koa');

const options = {
    key: fs.readFileSync('./ssl/mj-dell-15.key'),
    cert: fs.readFileSync('./ssl/mj-dell-15.crt'),
};

const app = new koa();
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

const server = http2.createSecureServer(options, app.callback());
server.listen(443);

