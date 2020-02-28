
[Native HTTP/2 support in Node frameworks - Hapi, Koa, Express and more](https://dexecure.com/blog/native-http2-support-node-frameworks-hapi-koa-express/)

## Koa
Koa (at least from v2.3.0 onwards) supports HTTP/2 out of the box too.

Start with installing Koa:

npm install koa

We then setup a simple server over HTTP/2:

```
const fs = require('fs');
const http2 = require('http2');
const koa = require('koa');

const options = {
    key: fs.readFileSync('./selfsigned.key'),
    cert: fs.readFileSync('./selfsigned.crt'),
};

const app = new koa();
// response
app.use(ctx => {
  ctx.body = 'Hello Koa';
});

const server = http2.createSecureServer(options, app.callback());
server.listen(443);
```

## Express
Express doesn’t support HTTP/2 yet, but the developers are actively working on it. We will update the post once we find a working solution for setting up a HTTP/2 server using Express.


Inian Parameshwaran  @everConfusedGuy · Oct 30, 2017
Replying to @everConfusedGuy and 2 others
Express and a few other frameworks seems to be having trouble working with it though.


Matteo Collina  @matteocollina   7:05 AM - Oct 30, 2017
Express 5 will support it. They are actively working on it.

We are following [this issue](https://github.com/expressjs/express/issues/2364) to stay up to date when Express launches HTTP/2 support.


Note that Express does seem to work with the [SPDY module](https://github.com/indutny/node-spdy). However, 
[SPDY is now dead](https://blog.chromium.org/2016/02/transitioning-from-spdy-to-http2.html). You can get it 
to work with the [external HTTP/2 module](https://github.com/molnarg/node-http2) with some 
[hacks](https://www.npmjs.com/package/express-http2-workaround), but we have not found a way to make 
the HTTP/2 from Node core work with Express yet.

https://www.apollographql.com/docs/apollo-server/v1/servers/koa/

```
import koa from 'koa'; // koa@2
import koaRouter from 'koa-router';
import koaBody from 'koa-bodyparser';
import { graphqlKoa } from 'apollo-server-koa';

const app = new koa();
const router = new koaRouter();
const PORT = 3000;

// koaBody is needed just for POST.
app.use(koaBody());

router.post('/graphql', graphqlKoa({ schema: myGraphQLSchema }));
router.get('/graphql', graphqlKoa({ schema: myGraphQLSchema }));

app.use(router.routes());
app.use(router.allowedMethods());
app.listen(PORT);
```

```
import { graphiqlKoa } from 'apollo-server-koa';

// Setup the /graphiql route to show the GraphiQL UI
router.get(
  '/graphiql',
  graphiqlKoa({
    endpointURL: '/graphql', // a POST endpoint that GraphiQL will make the actual requests to
  }),
);
```


