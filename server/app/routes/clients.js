let controller = require('../controllers/clients');

module.exports = function(app){
    app.get('/api/findNearest/:code/:nResults', controller.findNearest);
    app.get('/api/findNearest/:code/:nResults/:attr', controller.findNearestWithAttribute);
}