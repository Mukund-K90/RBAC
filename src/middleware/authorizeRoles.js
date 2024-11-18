const { default: status } = require("http-status");
const { errorResponse } = require("../utils/apiResponse");
const { ERROR_MESSAGE } = require("../helper/error.message");

exports.authorizeRoles = (allowedRoles) => (req, res, next) => {
  const userRole = req.user.role;
  if (!allowedRoles.includes(userRole)) {
    return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
  }
  next();
};
