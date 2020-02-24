
// Browsers support only https for HTTP/2.

// https://github.com/google/node-fastify-auto-push

// https://medium.com/the-node-js-collection/node-js-can-http-2-push-b491894e1bb1

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fastifyStatic = require('fastify-static');

const fastifyFavicon = require("fastify-favicon");
const fastifyCompress = require("fastify-compress");
const fastifyHelmet = require("fastify-helmet");

const args = require('./args')
const fqdn = require('./fqdn')
const renderPageWithPush = require('./renderPageWithPush')

const STATIC_DIR = path.join(__dirname, '..', 'public');
const CERTS_DIR  = path.join(__dirname, 'certs');
const staticPath = (...args) => { return path.join(STATIC_DIR, ...args) }
const certPath   = (...args) => { return path.join(CERTS_DIR, ...args) }

const fsReadFile = promisify(fs.readFile);

const log = (...args) => {
  console.log(...args)
}

log('args:', JSON.stringify(args,2))

// defaults from      https://github.com/google/node-h2-auto-push/blob/master/ts/src/index.ts
const cacheConfig = {
  warmupDuration:  1500,   // 500
  promotionRatio:  0.3,   // 0.8
  demotionRatio:   0.2,   // 0.2
  minimumRequests:   1,   // 1
}

// find . -name '*' -type f -exec echo "'{}'," \;
// find ../web_modules -name '*.js' -exec echo "'{}'," \;
const spaFiles = [
  'web_modules/react-dom.js',
  'web_modules/react.js',
  'demo/Demo.css',
  'demo/Demo.js',
  'Card.js',
  'App.js',
  'Card.css',
  'index.css',
  'logo.svg',
  // 'index.html',
]

async function createServerOptions() {
  const host = await fqdn()
  const keyFile = certPath(`${host}+5-key.pem`)
  const certFile = certPath(`${host}+5.pem`)

    const [key, cert] = await Promise.all(
      [fsReadFile(keyFile), fsReadFile(certFile)]);

    log(keyFile, certFile)

  return {key, cert};
}


async function main() {
  const {key, cert} = await createServerOptions();
  const app = fastify({
    http2: true,
    https: {key, cert},
    // logger: { prettyPrint: true}
    logger: {
      level: 'info',
      file: './logs/info.log' // Will use pino.destination()
      }
    });

  if (args.autoPush) {
    // It should be registered as the first in the middleware chain.
    app.register(fastifyAutoPush.staticServe, {root: STATIC_DIR, cacheConfig});
  } else {
    app.register(fastifyStatic, {root: STATIC_DIR});
  }

  app
  .register(fastifyHelmet)
  .register(fastifyCompress)
  .register(fastifyFavicon, { path: staticPath("favicons") })

  app.get('/', (req, reply) => {
    log('forced push...')
    renderPageWithPush(req, reply, 'index.html', spaFiles, STATIC_DIR)
  })

  await app.listen(args.port, '0.0.0.0');
  log(`Listening on port ${args.port}  http2: ${args.http2}  autoPush: ${args.autoPush}`);

}

main().catch((err) => {
  console.error(err);
});

