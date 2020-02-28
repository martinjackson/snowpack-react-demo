'use strict'

const fs = require('fs')
const path = require('path')
const spdy = require('spdy')

const helper = require('./helper')
const args = require('./args')


const publicFiles = helper.getFiles(args.home)

const server = spdy.createServer({
  cert: fs.readFileSync(path.join(__dirname, '../ssl/cert.pem')),
  key: fs.readFileSync(path.join(__dirname, '../ssl/key.pem'))
}, onRequest)

// Server Push one file
function serverPush (response, path) {
  const file = publicFiles.get(path)

  if (!file) {
    console.log('push file missing:', path);
    return
  }

  response.push(path, file.headers, (err, writeStream) => {
    if (err) {
      // throw err;
      console.log(`error pushing: ${path}, let browser ask for asset later.`);
    } else {
      const readStream = fs.createReadStream(file.filePath);
      readStream.pipe(writeStream);
    }
  })
}

function sendFile(fname, res) {
  console.log('Reading', fname);

  fs.readFile(fname, (err, data) => {
      if (err) {
        res.status(500).send(error.toString())
        return
      }

      res.writeHead(200);
      res.end(data);
      console.log('done.');

    })
}

// Request handler
function onRequest (req, response) {
  const reqPath = req.url === '/' ? '/index.html' : req.url
  const file = publicFiles.get(reqPath)

  // File not found
  if (!file) {
    response.statusCode = 404
    response.end()
    return
  }

  // if SPDY is off, we cannot user Server Push :(
  if (req.isSpdy && reqPath === '/index.html') {

      // serverPush with index.html
      for (const f of publicFiles.keys()) {
        serverPush(response, f)
        }
    }

    sendFile(file.filePath, response)
  }

server.listen(args.port, (err) => {
  if (err) {
    console.error(err)
    return
  }

  console.log(`Server listening on ${args.port}`)
})
