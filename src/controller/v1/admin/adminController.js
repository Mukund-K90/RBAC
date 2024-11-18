const bcrypt = require('bcrypt')
const adminDao = require('../../../dao/v1/admin/adminDao');
const { status } = require('http-status');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { createUserSession } = require('../../../utils/jwt');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');

//login
exports.adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { admin, roleData } = await adminDao.findByEmail(email);
        if (!admin) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return successResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.COMPARE_PASSWORD)
        }
        const sessionResponse = createUserSession(admin);
        const token = (await sessionResponse).sessionToken;
        const checkToken = await adminDao.checkToken(admin.id);
        if (!checkToken) {
            const savedToken = await adminDao.generateToken(admin._id, token);
            if (!savedToken) {
                return errorResponse(req, res, status.BAD_REQUEST,);
            }
        }
        else {
            const updateToken = await adminDao.updateToken(admin._id, token);
            if (!updateToken) {
                return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.TOKEN_SAVE_FAILED);
            }
        }

        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.LOGIN_SUCCESS, { token: token, permissions: roleData.permissions });
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error)
    }
}
