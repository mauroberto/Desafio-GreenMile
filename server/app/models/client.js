let mongoose = require('mongoose');
module.exports = function(){
    let schema = mongoose.Schema({
        description: {
            type: [String],
            required: false
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        }
    });
    return mongoose.model('Client', schema);
}();