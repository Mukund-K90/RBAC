const joi = require('joi');

exports.addProduct = {
    body: joi.object().keys({
        name: joi.string().required(),
        price: joi.number().required(),
        stock: joi.number().required(),
        description: joi.string().required(),
    })
}