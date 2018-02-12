var express = require('express');

var http = require('http');
var https = require('https');

var fs = require('fs');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);

require('./server/config/mongoose')(config);

require('./server/config/passport')();

require('./server/config/routes')(app);

if(env === 'production')
{
    // Create an HTTP service, as Heroku manages HTTPS automatically.
    http.createServer(app).listen(config.port);
}
else
{
    var options = {
        key: fs.readFileSync('./server/config/vpkey.pem'),
        cert: fs.readFileSync('./server/config/vpcert.pem'),
        passphrase: 'ArrozConLeche1!'
    };

    // Create an HTTPS service identical to the HTTP service.
    https.createServer(options, app).listen(config.port);
}

//app.listen(config.port);
console.log('Listening on port ' + config.port + '...');
console.log('Environment: '+ process.env.NODE_ENV);
console.log('Running on ' + env + '...');