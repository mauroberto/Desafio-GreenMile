let controller = require('../controllers/clients');

module.exports = function(app){
    app.get('/api/findNearest/:N', controller.findNearest);
    app.get('/api/findNearest/:N/:attr', controller.findNearestWithAttribute);
}