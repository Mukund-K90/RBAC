const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Token = require('../model/authTokens');
const Admin = require('../model/user');
const { errorResponse } = require('../utils/apiResponse');
const { CONFIG } = require('../config/config');
const { status } = require("http-status");
const { ERROR_MESSAGE } = require("../helper/error.message");

exports.authentication = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return errorResponse(req, res, 401, "Authorization forbidden");
        }
        const token1 = token.split(" ")[1];
        if (!token1) {
            return errorResponse(req, res, 401, "Token not provided");
        }
        // Verify the token and get the decoded data
        const decoded = jwt.verify(token1, CONFIG.jwtSecret);

        // Check if the token is expired
        const currentTime = Math.floor(Date.now() / 1000);
        //find the token
        const adminToken = await Token.findOne({ userId: decoded.userId, token: token1 });
        if (!adminToken) {
            return errorResponse(req, res, 401, "Invalid token");
        }
        if (decoded.exp < currentTime) {
            return errorResponse(req, res, 400, "Token has expired");
        }
        // Find the user from the decoded token's userId
        const admin = await Admin.findById(decoded.userId);
        if (!admin) {
            return errorResponse(req, res, 401, "Permission denied");
        }
        // If all checks pass, move to the next middleware
        req.user = admin; // Store user info in the request for further use
        next();
    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return errorResponse(req, res, 400, "Token has expired");
        } else if (error.name === "JsonWebTokenError") {
            return errorResponse(req, res, 401, "Invalid token");
        } else {
            return errorResponse(req, res, 500, "Server error");
        }
    }
};


//check role base access
exports.authorizeRoles = (allowedRoles) => (req, res, next) => {
    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
        return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
    }
    next();
};