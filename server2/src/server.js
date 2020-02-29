'use strict'

const fs = require('fs')
const path = require('path')
// eslint-disable-next-line
const http2 = require('http2')

const helper = require('./helper')
const args = require('./args')

const { HTTP2_HEADER_PATH } = http2.constants

console.log('args:', args);

const publicFiles = helper.getFiles(args.home)
const server = http2.createSecureServer({
  cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem')),
  key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))
}, onRequest)

// Server Push one file
function serverPush (stream, path) {
  const file = publicFiles.get(path)

  if (!file) {
    console.log('push file missing:', path);
    return
  }

  stream.pushStream({ [HTTP2_HEADER_PATH]: path }, (err, pushStream, headers) => {
    if (err) {
      // throw err;
      console.log(`error pushing: ${path}, let browser ask for asset later.`);
    } else {
    pushStream.respondWithFD(file.fileDescriptor, file.headers)
    }
  })
}

// Request handler
function onRequest (req, res) {
  const reqPath = req.url === '/' ? '/index.html' : req.url
  const file = publicFiles.get(reqPath)

  // File not found
  if (!file) {
    res.statusCode = 404
    res.end()
    return
  }

  // serverPush with index.html
  if (reqPath === '/index.html') {
    for (const f of publicFiles.keys()) {
      serverPush(res.stream, f)
      }
  }

  // Serve file
  res.stream.respondWithFD(file.fileDescriptor, file.headers)
}

server.listen(args.port, (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Server listening on ${args.port}`)
})
