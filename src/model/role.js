const mongoose = require("mongoose");


const roleSchema = new mongoose.Schema({
    roleName: { type: String, required: true, unique: true },
    permissions: [{ type: String, required: true }], // e.g., ['manage_users', 'manage_products', 'view_orders']
}, { timestamps: true });

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;