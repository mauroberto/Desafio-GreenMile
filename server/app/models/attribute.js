let mongoose = require('mongoose');
module.exports = function(){
    let schema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        clients: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Client'
        }]
    });
    return mongoose.model('Attribute', schema);
}();