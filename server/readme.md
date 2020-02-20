# Server Notes

## http/2
[HTTP/2 - The Reasons, The Features And The Node.js Support](https://www.perimeterx.com/tech-blog/2019/http2/) February 20, 2019

HTTP/2, the latest version and the successor of the HyperText Transfer Protocol (HTTP/1.x) was published in 2015, and lately started to be adopted by almost every organization as the mainstream future scaffoldings of the World Wide Web.

Original HTTP protocol was proposed by Tim Berners-Lee, and first released in 1991, to communicate between web servers and clients. Although the HTTP/1.x protocol has served the web for over 15 years, the technology is beginning to become old. HTTP/2 is the biggest, most innovative change to the protocol family since 1999, and was influenced by Google’s SPDY protocol mechanisms. HTTP/2 changes are designed to maintain backward-compatibility with HTTP/1.x, so everything you have should continue working after you moved to HTTP/2 (😄).

### native http2 has bugs with Express

    We need to have couple of changes if we want to apply HTTP/2 on our Express server.
    We can’t use the native HTTP/2 library directly `require('http2');`, so we will use the `spdy` library.

    `const Spdy = require('spdy');`

    instead of

    `const Http2 = require('http2');`




```
const Express = require('express');
const Spdy = require('spdy');

const http2app = Express();
http2app.use((req, res) => {
   for(let i = 1; i <= 100; i++) {
       const assetPath = `/pxlogo${i}.png`;
       const filePath = Path.join(imagesDir, path);
       const stream = res.push(assetPath, {
           request: { accept: '*/*' },
           response: { 'content-type': Mime.getType(filePath) }
       });
       stream.end(Fs.readFileSync(filePath))
   }
   res.writeHead(200);
   res.end(..., 'utf-8');
});
Spdy.createServer({
   key: Fs.readFileSync(keyPath),
   cert: Fs.readFileSync(certPath)
}, http2app).listen(PORT, 'localhost', () => {
   console.log(`HTTP/2 Express running at https://localhost:${PORT}`)
});
```

