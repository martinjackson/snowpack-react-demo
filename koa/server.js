
const fs = require('fs');
const http2 = require('http2');

const args = require('./args')
const fqdn = require('./fqdn')
const genApp = require('./genKoaApp')
const h2PushStatic = require('./h2PushStatic')

const pushStatic = h2PushStatic(args.home)
const app = genApp();

fqdn().then( host => {
  const options = {
    key: fs.readFileSync(`./ssl/${host}.key`),
    cert: fs.readFileSync(`./ssl/${host}.crt`),
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

})


