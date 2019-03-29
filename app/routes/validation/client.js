var Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
 
module.exports.findNearest = {
  params: {
    code: Joi.objectId().required(),
    nResults: Joi.number().integer().min(0).required()
  }
};

module.exports.findNearestWithAttribute = {
  params: {
    code: Joi.objectId().required(),
    nResults: Joi.number().integer().min(0).required(),
    attr: Joi.string().required()
  }
};