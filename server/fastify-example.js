

// https://github.com/google/node-fastify-auto-push
/*
import * as fastify from 'fastify';
import {staticServe} from 'fastify-auto-push';


const app = fastify({https: {key, cert}, http2: true});
app.register(staticServe, {root: 'path/to/static'});
 */

// https://medium.com/the-node-js-collection/node-js-can-http-2-push-b491894e1bb1

const fastify = require('fastify');
const fastifyAutoPush = require('fastify-auto-push');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const fsReadFile = promisify(fs.readFile);

const STATIC_DIR = path.join(__dirname, '../public');
const CERTS_DIR = path.join(__dirname, 'certs');
const PORT = 8080;

async function createServerOptions() {
  const readCertFile = (filename) => {
    return fsReadFile(path.join(CERTS_DIR, filename));
  };
  const [key, cert] = await Promise.all(
      [readCertFile('server.key'), readCertFile('server.crt')]);
  return {key, cert};
}

async function main() {
  const {key, cert} = await createServerOptions();
  // Browsers support only https for HTTP/2.
  const app = fastify({https: {key, cert}, http2: true});

  // Create and register AutoPush plugin. It should be registered as the first
  // in the middleware chain.
  app.register(fastifyAutoPush.staticServe, {root: STATIC_DIR});

  await app.listen(PORT);
  console.log(`Listening on port ${PORT}`);
}

main().catch((err) => {
  console.error(err);
});

