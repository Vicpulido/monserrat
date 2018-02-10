var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/multivision',
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    signalingPort: process.env.SIGNALING_PORT || 8080
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://vicpulido:multivision@ds032340.mlab.com:32340/multivision',
    port: process.env.PORT || 3090,
    signalingPort: process.env.SIGNALING_PORT || 8080
  }
}