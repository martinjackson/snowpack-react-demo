const fs = require('fs');
const path = require('path');
const mimetype = require('mime-types')
const http2 = require('http2');

const mime = (fname) => {
  let s = mimetype.contentType(fname)
  const i = s.indexOf(';')
  if (i != -1)
     s = s.substring(0,i)
  return s
}

const pushFile = (request, fpath, staticDir) => {
  const absPath = path.join(staticDir, fpath)
  const fname = path.basename(fpath)
  const info = {
    "cache-control": "public, max-age=31536000",
    "content-encoding": "gzip",
    "content-type": mime(fname)   // "application/javascript"
  }

  request.raw.stream.pushStream(
    { ":path": `${fpath}.gz` },
    (err, stream) => {
      if (err) {
        console.log('err:, err')
        throw err;
      }
      stream.on('error', (err) => {

        const isRefusedStream = err.code === 'ERR_HTTP2_STREAM_ERROR' &&
              err.message.indexOf('NGHTTP2_REFUSED_STREAM') != -1

        if (!isRefusedStream) {
          console.log('error:', err.message);
          throw err;
        }
        else {
          console.log(`Ignoring ${err.message}, ${fpath}  renderPageWithPush.js:40`);
        }

      });

      stream.respondWithFile(absPath, info);
      console.log('pushing', info["content-type"], fpath)
    }
  );

}

const renderPageWithPush = (request, response, htmlFile, assets, staticDir) => {
  // const url = request.headers[":path"];

  assets.forEach( path => pushFile(request, path, staticDir) )

  try {
    const stream = fs.createReadStream(htmlFile)
    response.type('text/html').send(stream)    // dont use sendFile() it closes stream
    console.log('sending', htmlFile);

  } catch(err) {
     console.log('error sending', htmlFile, err);
  }
};

module.exports = renderPageWithPush;
