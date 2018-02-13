var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/multivision',
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    signalingUrl: "https://localhost:8080"
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://vicpulido:multivision@ds032340.mlab.com:32340/multivision',
    //db: 'mongodb://localhost/multivision',
    port: process.env.PORT || 80,
    //port: process.env.PORT || 3030
  }
}