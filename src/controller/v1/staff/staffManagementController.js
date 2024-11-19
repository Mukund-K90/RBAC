const { default: status } = require('http-status');
const userDao = require('../../../dao/v1/staff/staffManagementDao');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const bcrypt = require('bcrypt');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');
const { createUserSession } = require('../../../utils/jwt');

//add User
exports.userSignUp = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 10);
        const { user } = await userDao.findByEmail(email);
        if (user) {
            return errorResponse(req, res, status.CONFLICT, ERROR_MESSAGE.USER_EXIST);
        }
        const userData = {
            username, email, password: hashedPassword, role
        }
        const addedUser = await userDao.signUp(userData);
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
        const { user, roleData } = await userDao.findByEmail(email);
        if (!user) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.COMPARE_PASSWORD)
        }
        const sessionResponse = createUserSession(user);
        const token = (await sessionResponse).sessionToken;
        const checkToken = await userDao.checkToken(user.id);
        if (!checkToken) {
            const savedToken = await userDao.generateToken(user._id, token);
            if (!savedToken) {
                return errorResponse(req, res, status.BAD_REQUEST,);
            }
        }
        else {
            const updateToken = await userDao.updateToken(user._id, token);
            if (!updateToken) {
                return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.TOKEN_SAVE_FAILED);
            }
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.LOGIN_SUCCESS, { token: token, permissions: roleData.permissions });
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error)
    }
}