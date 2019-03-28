let mongoose = require('mongoose');

module.exports = function(uri){
    mongoose.connect(uri);
    mongoose.connection.on('connected', function(){
        console.log('Mongoose: conectado em '+ uri);
    });
    mongoose.connection.on('disconnected', function(){
        console.log('Mongoose: desconectado de '+ uri);
    });
    mongoose.connection.on('error', function(erro){
        console.log('Mongoose: erro na conexão '+ erro);
    });
    mongoose.set('debug', true);
}