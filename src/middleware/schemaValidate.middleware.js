const { errorResponse } = require("../utils/apiResponse");
const { status } = require('http-status');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            return errorResponse(req, res, status.BAD_REQUEST, error.details[0].message);
        }
        next();
    }
}


module.exports = {
    validate,
}