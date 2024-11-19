const joi = require('joi');

exports.addOrder = {
    body: joi.object().keys({
        product: joi.string().required(),
        quantity: joi.number().required(),
        customerName: joi.string().required(),
    })
}