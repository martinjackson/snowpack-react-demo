var os = require('os');
var dns = require('dns');

const fqdn = () => {
  return new Promise ((resolve, reject) => {

    var uqdn = os.hostname();
    dns.lookup(uqdn, { hints: dns.ADDRCONFIG }, function(err, ip) {
        if(err) return reject(err);

        dns.lookupService(ip, 0, function (err, fqdn) {
            if (err)
               return reject(err);

            resolve(fqdn);
        });
    });

})
}

module.exports = fqdn;