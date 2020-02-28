'use strict'

const fs = require('fs')
const path = require('path')
const spdy = require('spdy')
const mime = require("mime");

const helper = require('./helper')
const args = require('./args')


const publicFiles = helper.getFiles(args.home)
console.log('publicFiles:', publicFiles);


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

  console.log('push:', path);

  response.push(path, file.headers, (err, writeStream) => {
    if (err) {
      // throw err;
      console.log(`error pushing: ${path}, let browser ask for asset later.`);
    } else {
      const readStream = fs.createReadStream(file.filePath);
      readStream.pipe(writeStream);
      console.log('done.');

    }
  })
}

const sendFile = (fileName, res) => {
  fs.readFile(fileName, (err, data) => {
    if (err) {
      res.writeHead(503);
      res.end("Error occurred while reading file", fileName);
      return;
    }
    res.writeHead(200, { "Content-Type": mime.getType(fileName) });
    res.end(data);
    console.log('done.');
  });
}


const sendReply = (res, status, body) => {
  var headers = {}
  var body;

  headers['Content-Type'] = 'text/html';
  headers['Content-Length'] = body.length;

  res.writeHead(status, headers);
  res.end(body);
}

// Request handler
function onRequest (req, response) {

  response.writeHead(200);
  response.end("ok");

  const reqPath = req.url === '/' ? '/index.html' : req.url

  console.log(reqPath)

  const file = publicFiles.get(reqPath)

  // File not found
  if (!file) {
    const msg = `requested file ${reqPath} not found.`
    console.log(msg);
    response.writeHead(200);
    response.end(msg);
    return
  }

  // if SPDY is off, we cannot user Server Push :(
  if (req.isSpdy && reqPath === '/index.html') {

    console.log('spdy');
      // serverPush with index.html
      for (const f of publicFiles.keys()) {
        serverPush(response, f)
        }

    try {
      sendFile(file.filePath, response)
    } catch (err) {
      console.log(err.message);


  }

server.listen(args.port, (err) => {
  if (err) {
    console.error('listen err:', err)
    return
  }

  console.log(`Server listening on ${args.port}`)
})
