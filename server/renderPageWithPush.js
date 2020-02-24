const fs = require('fs');
const path = require('path');
const mime = require('mime-types')

const pushFile = (request, path) => {
  const fname = path.basename(path)
  const info = {
    "cache-control": "public, max-age=31536000",
    "content-encoding": "gzip",
    "content-type": mime.contentType(fname)   // "application/javascript"
  }
  request.raw.stream.pushStream(
    { ":path": `${fname}.gz` },
    (err, stream) => {
      if (err) throw err;
      stream.respondWithFile(path, info);
    }
  );

}

const renderPageWithpush = (request, reply, htmlFile, assets) => {
  // const url = request.headers[":path"];

  assets.each( path => pushFile(request, path)

  reply.type("text/html");
  reply.sendFile(htmlFile);
};

export default renderPageWithPush;
