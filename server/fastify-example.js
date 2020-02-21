
// Browsers support only https for HTTP/2.

// https://github.com/google/node-fastify-auto-push

// https://medium.com/the-node-js-collection/node-js-can-http-2-push-b491894e1bb1

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fastifyStatic = require('fastify-static');
const args = require('./args')

const fsReadFile = promisify(fs.readFile);


const STATIC_DIR = path.join(__dirname, '..', 'public');
const CERTS_DIR = path.join(__dirname, 'certs');

const log = (...args) => {
  console.log(...args)
}

// log('args:', JSON.stringify(args,2))

async function createServerOptions() {
  const readCertFile = (filename) => {
    return fsReadFile(path.join(CERTS_DIR, filename));
  };
  const [key, cert] = await Promise.all(
      [readCertFile('ncu0190765.fda.gov+5-key.pem'), readCertFile('ncu0190765.fda.gov+5.pem')]);
  return {key, cert};
}

async function main() {
  const {key, cert} = await createServerOptions();
  const app = fastify({https: {key, cert}, http2: true});
  let msg = ""

  if (args.autoPush) {
    app.register(fastifyAutoPush.staticServe, {root: STATIC_DIR});   // It should be registered as the first in the middleware chain.
    msg = 'fastifyAutoPush: ON'
  } else {
    app.register(fastifyStatic, {root: STATIC_DIR});
    msg = 'fastifyStatic: ON'
  }

  await app.listen(args.port, '0.0.0.0');
  log(`Listening on port ${args.port}  http2: ${args.http2}  ${msg}`);

}

main().catch((err) => {
  console.error(err);
});

