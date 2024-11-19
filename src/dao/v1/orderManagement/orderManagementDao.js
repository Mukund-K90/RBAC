const Order = require('../../../model/order')


//add order
exports.add = async (orderData) => {
    try {
        const order = await Order(orderData);
        const savedOrder = await order.save();
        return savedOrder;
    } catch (error) {
        throw error;
    }
}

//view order
exports.view = async (orderId) => {
    try {
        return await Order.findById(orderId).populate('product');
    } catch (error) {
        throw error;
    }
}

//view all orders
exports.viewAll = async () => {
    try {
        return await Order.find();
    } catch (error) {
        throw error;
    }
}

//update order status
exports.updateStatus = async (orderId, status) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(orderId, { status: status }, { new: true });
        return updateOrder;
    } catch (error) {
        throw error;
    }
}