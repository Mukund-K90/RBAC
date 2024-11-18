const { default: status } = require('http-status');
const managerDao = require('../../../dao/v1/manager/managerDao');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const bcrypt = require('bcrypt');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');
const { createUserSession } = require('../../../utils/jwt');

//user User
exports.userSignUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const { user } = await managerDao.findByEmail(email);
        if (user) {
            return errorResponse(req, res, status.CONFLICT, ERROR_MESSAGE.USER_EXIST);
        }
        const userData = {
            username, email, password: hashedPassword, role
        }
        const addedUser = await managerDao.signUp(userData);
        if (!addedUser) {
            return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, ERROR_MESSAGE.USER_NOT_CREATED);
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.USER_CREATED, addedUser._id);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//SignIn
exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, roleData } = await managerDao.findByEmail(email);
        if (!user) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return successResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.COMPARE_PASSWORD)
        }
        const sessionResponse = createUserSession(user);
        const token = (await sessionResponse).sessionToken;
        const checkToken = await managerDao.checkToken(user.id);
        if (!checkToken) {
            const savedToken = await managerDao.generateToken(user._id, token);
            if (!savedToken) {
                return errorResponse(req, res, status.BAD_REQUEST,);
            }
        }
        else {
            const updateToken = await managerDao.updateToken(user._id, token);
            if (!updateToken) {
                return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.TOKEN_SAVE_FAILED);
            }
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.LOGIN_SUCCESS, { token: token, permissions: roleData.permissions });
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error)
    }
}