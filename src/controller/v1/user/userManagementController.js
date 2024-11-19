const bcrypt = require('bcrypt')
const userDao = require('../../../dao/v1/user/userManagementDao');
const { status } = require('http-status');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { createUserSession } = require('../../../utils/jwt');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');
const { CONST_KEY } = require('../../../utils/const_key');

//list all Users
exports.listAllUsers = async (req, res) => {
    try {
        const user = req.user;
        const allUsers = await userDao.getAllUser();
        if (!allUsers) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGE.USERS_NOT_FOUND);
        }

        const formattedUser = {
            manager: allUsers
                .filter(user => user.role === 'Manager')
                .map(user => ({
                    id: user._id,
                    name: user.username,
                    email: user.email,
                    role: user.role
                })),
            staff: allUsers
                .filter(user => user.role === 'Staff')
                .map(user => ({
                    id: user._id,
                    name: user.username,
                    email: user.email,
                    role: user.role
                })),
        };

        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.USERS_LISTED, user.role === "Admin" ? formattedUser : { staff: formattedUser.staff });
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error)
    }
}

//update user 
exports.updateUserData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedData = req.body;

        const loggedInUser = req.user;
        const user = await userDao.findById(userId);
        if (!user) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGE.USER_NOT_FOUND)
        }

        if (loggedInUser.role === 'Manager' && updatedData.role) {
            return errorResponse(req, res, status.FORBIDDEN, ERROR_MESSAGE.NOT_UPDATE_ROLE);
        }
        const updateUser = await userDao.updateUser(userId, updatedData);
        if (!updateUser) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.DATA_NOT_UPDATE);
        }

        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.DATA_UPDATED);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error);
    }
};

//delete user
exports.deleteUserData = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await userDao.findById(userId);
        if (!user) {
            return errorResponse(req, res, status.NOT_FOUND, ERROR_MESSAGE.USER_NOT_FOUND)
        }
        if (user.role === CONST_KEY.ROLE.ADMIN) {
            return errorResponse(req, res, status.FORBIDDEN, ERROR_MESSAGE.NOT_DELETE_ADMIN)
        }
        const deleteUser = await userDao.deleteUser(userId);
        if (!deleteUser) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.USER_NOT_DELETED);
        }

        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.USER_DELETD);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message, error);
    }
};