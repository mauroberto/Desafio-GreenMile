let controller = require('../controllers/clients');
let validate = require('express-validation');
let validation = require('./validation/client.js');

module.exports = function(app){
    app.get('/api/findNearest/:code/:nResults', validate(validation.findNearest), controller.findNearest);
    app.get('/api/findNearest/:code/:nResults/:attr', validate(validation.findNearestWithAttribute), controller.findNearestWithAttribute);
    app.get('/api/clients', controller.findClients);
    app.get('/api/attributes', controller.findAttributes);
}