const { default: status } = require('http-status');
const userDao = require('../../../dao/v1/admin/userManagement');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const bcrypt = require('bcrypt');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');

exports.addUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const user = await userDao.findByEmail(email);
        if (user) {
            return errorResponse(req, res, status.CONFLICT, ERROR_MESSAGE.USER_EXIST);
        }
        const userData = {
            username, email, password: hashedPassword, role
        }
        const addedUser = await userDao.add(userData);
        if (!addedUser) {
            return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, ERROR_MESSAGE.USER_NOT_CREATED);
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.USER_CREATED, addedUser._id);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}