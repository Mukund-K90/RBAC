const { default: status } = require("http-status");
const orderDao = require("../../../dao/v1/orderManagement/orderManagementDao");
const { checkProduct, update } = require("../../../dao/v1/productManagement/productDao");
const { errorResponse, successResponse } = require('../../../utils/apiResponse');
const { ERROR_MESSAGE } = require("../../../helper/error.message");
const { SUCCESS_MESSAGE } = require("../../../helper/success.message");


//placed order
exports.addOrder = async (req, res) => {
    try {
        const orderData = req.body;
        const product = await checkProduct(orderData.product);
        if (!product || product.stock === 0) {
            return errorResponse(req, res, status.NOT_FOUND, "Product not Available");
        }
        product.stock -= orderData.quantity;
        await update(product._id, { stock: product.stock })
        const order = await orderDao.add(orderData);
        if (!order) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.ORDER_NOT_ADD)
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.ORDER_PLACED, {});
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//view order
exports.viewOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderDao.view(orderId);
        if (!order) {
            return errorResponse(req, res, status.NOT_FOUND, "Order not found");
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.ORDER_FOUND, order);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//view all orders
exports.viewAllOrder = async (req, res) => {
    try {
        const orders = await orderDao.viewAll();
        if (!orders) {
            return errorResponse(req, res, status.NOT_FOUND, "Order not found");
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.ORDER_FOUND, orders);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}

//update order
exports.updateOrderStatus = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const order = await orderDao.view(orderId);
        if (!order) {
            return errorResponse(req, res, status.NOT_FOUND, "Order not found");
        }
        const status = req.body.status;
        const updateOrder = await orderDao.updateStatus(orderId, status);

        if (status === "Cancelled") {
            order.product.stock += order.quantity;
            await update(order.product, { stock: order.product.stock });
        }
        if (!updateOrder) {
            return errorResponse(req, res, status.BAD_REQUEST, ERROR_MESSAGE.STATUS_NOT_UPDATE)
        }
        return successResponse(req, res, status.OK, SUCCESS_MESSAGE.STATUS_UPDATE, orderId);
    } catch (error) {
        return errorResponse(req, res, status.INTERNAL_SERVER_ERROR, error.message);
    }
}