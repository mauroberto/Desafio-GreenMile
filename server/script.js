let http = require('http');
let app = require('./config/express')();
let db = require('./config/database');

process.env.NODE_ENV = 'dev';
let config = require('./config/config');

http.createServer(app).listen(app.get('port'), function(){
    console.log('Servidor escutando na porta ' + app.get('port'));
});
db(global.gConfig.DBHost);