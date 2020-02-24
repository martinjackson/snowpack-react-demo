
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


const STATIC_DIR = path.join(__dirname, '..', 'public');
const CERTS_DIR  = path.join(__dirname, 'certs');
const staticPath = (...args) => { return path.join(STATIC_DIR, ...args) }
const certPath   = (...args) => { return path.join(CERTS_DIR, ...args) }

const fsReadFile = promisify(fs.readFile);
const readCertFile = (filename) => {
  return fsReadFile(certPath(filename));
};

const log = (...args) => {
  console.log(...args)
}

// log('args:', JSON.stringify(args,2))

// defaults from      https://github.com/google/node-h2-auto-push/blob/master/ts/src/index.ts
const cacheConfig = {
  warmupDuration:  1500,   // 500
  promotionRatio:  0.3,   // 0.8
  demotionRatio:   0.2,   // 0.2
  minimumRequests:   1,   // 1
}

const host = 'mj-dell-15' // ncu0190765.fda.gov
const keyFile = `${host}+5-key.pem`
const certFile = `${host}+5.pem`

async function createServerOptions() {
  const [key, cert] = await Promise.all(
      [readCertFile(keyFile), readCertFile(certFile)]);
  return {key, cert};
}

async function main() {
  const {key, cert} = await createServerOptions();
  const app = fastify({
    http2: true,
    https: {key, cert},
    logger: { prettyPrint: true}
    });

  let msg = ""

  if (args.autoPush) {
    app.register(fastifyAutoPush.staticServe, {root: STATIC_DIR, cacheConfig});   // It should be registered as the first in the middleware chain.
    msg = 'fastifyAutoPush: ON'
  } else {
    app.register(fastifyStatic, {root: STATIC_DIR});
    msg = 'fastifyStatic: ON'
  }

  app
  .register(fastifyHelmet)
  .register(fastifyCompress)
  .register(fastifyFavicon, { path: staticPath("favicons") })

  await app.listen(args.port, '0.0.0.0');
  log(`Listening on port ${args.port}  http2: ${args.http2}  ${msg}`);

}

main().catch((err) => {
  console.error(err);
});

