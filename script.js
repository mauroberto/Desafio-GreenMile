let http = require('http');
let app = require('./config/express')();
let db = require('./config/database');

let config = require('./config/config');

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Servidor escutando na porta ' + app.get('port'));
});

module.exports = server;

db(global.gConfig.DBHost);