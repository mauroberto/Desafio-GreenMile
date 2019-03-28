let express = require('express');
let bodyParser = require('body-parser');

let clientsRouter = require('../app/routes/clients');

let allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

module.exports = function(){
    let app = express();
    app.set("port", 3000);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));

    app.use(allowCrossDomain);

    clientsRouter(app);
    return app;
}