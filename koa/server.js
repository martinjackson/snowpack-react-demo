
const fs = require('fs');
const http2 = require('http2');

const args = require('./args')
const genApp = require('./genKoaApp')
const h2PushStatic = require('./h2PushStatic')


const pushStatic = h2PushStatic(args.home)
const app = genApp();

const options = {
    key: fs.readFileSync(`./ssl/${args.hostname}.key`),
    cert: fs.readFileSync(`./ssl/${args.hostname}.crt`),
  };

const server = http2.createSecureServer(options, (req, res) => {
      if (!pushStatic(req, res))
        app(req,res)
  })

  server.listen(args.port, (err) => {
    if (err) {
      console.error(err)
      return
    }

    console.log(`Server listening on ${args.port}`)
  })




