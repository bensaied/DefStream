const fs = require('fs');

module.exports = {
  key: fs.readFileSync('./tls/key.pem', 'utf8'),
  cert: fs.readFileSync('./tls/cert.pem', 'utf8'),
};
