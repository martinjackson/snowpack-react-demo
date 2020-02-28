var fs = require('fs'),
    path = require('path'),
    spdy = require('spdy');

var options = {
  cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem')),
  key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem'))
}

var server = spdy.createServer(options, function(req, res) {
  res.writeHead(200);
  res.end('hello world!');
});

const port = 3232
server.listen(port, (err) => {
  if (err) {
    console.error('listen err:', err)
    return
  }

  console.log(`Server listening on ${port}`)
})
