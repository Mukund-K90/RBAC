const { status } = require('http-status');
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { createUserSession } = require('../../../utils/jwt');
const { ERROR_MESSAGE } = require('../../../helper/error.message');
const { SUCCESS_MESSAGE } = require('../../../helper/success.message');
const productDao = require('../../../dao/v1/productManagement/productDao');
const { CONST_KEY } = require('../../../utils/const_key');

//add product
exports.addProduct = async (req, res) => {
    try {
        if (req.user.role !== CONST_KEY.ROLE.ADMIN && req.user.role !== CONST_KEY.ROLE.MANAGER) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
        }
        const productData = req.body;
        const product = await productDao.add(productData);
        if (!product) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.PRODUCT_NOT_ADD); f
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.PRODUCT_ADD, {});
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//list all product
exports.listProduct = async (req, res) => {
    try {
        if (req.user.role !== CONST_KEY.ROLE.ADMIN && req.user.role !== CONST_KEY.ROLE.MANAGER) {
            return errorResponse(req, res, status.UNAUTHORIZED, ERROR_MESSAGE.UNAUTHORIZED_USER);
        }
        const product = await productDao.list();
        if (!product) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.PRODUCT_NOT_ADD); f
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.PRODUCT_LIST_FETCHED, product);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//update product
exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const newData = req.body;
        const isExist = await productDao.checkProduct(productId);
        if (!isExist) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        }
        const product = await productDao.update(productId, newData);
        if (!product) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.DATA_NOT_UPDATE);
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.DATA_UPDATED, { id: product._id });
    } catch (error) {

        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//delete product
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        const isExist = await productDao.checkProduct(productId);
        if (!isExist) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.PRODUCT_NOT_FOUND);
        }
        const product = await productDao.delete(productId);
        if (!product) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.PRODUCT_NOT_DELETED);
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.PRODUCT_DELETED, {});
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

