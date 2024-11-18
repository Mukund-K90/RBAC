const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String },
}, { timestamps: true });


const Product = mongoose.model("Products", productSchema);

module.exports = Product;