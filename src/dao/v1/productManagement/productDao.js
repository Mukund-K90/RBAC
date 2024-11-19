const Product = require('../../../model/products');

//add product
module.exports.add = async (productData) => {
    try {
        const product = new Product(productData);
        const savedProduct = await product.save();
        return savedProduct;
    } catch (error) {
        throw error;
    }
}

//all product list
module.exports.list = async () => {
    try {
        return await Product.find();
    } catch (error) {
        throw error;
    }
}

//update product
module.exports.update = async (id, updatedData) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
        const savedProduct = await updatedProduct.save();
        return savedProduct;
    } catch (error) {
        throw error;
    }
}

//delete product
module.exports.delete = async (id) => {
    try {
        return await Product.findByIdAndDelete(id);
    } catch (error) {
        throw error;
    }
}

//check product
module.exports.checkProduct = async (id) => {
    try {
        return await Product.findById(id);
    }
    catch (error) {
        throw error;
    }
}