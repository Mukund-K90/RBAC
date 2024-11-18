const Role = require("../model/role");
const User = require("../model/user");
const { CONST_KEY } = require("./const_key");
const bcrypt = require('bcrypt');

const roles = [
    { roleName: CONST_KEY.ROLE.ADMIN, permissions: ['manage_users', 'manage_products', 'view_orders'] },
    { roleName: CONST_KEY.ROLE.MANAGER, permissions: ['manage_products', 'view_orders'] },
    { roleName: CONST_KEY.ROLE.STAFF, permissions: ['view_orders'] },
]

async function addRoles() {
    // Add roles to the database
    const role = await Role.find();
    if (!role || role.length === 0 || role.length < 3) {
        return Role.insertMany(roles);
    }
}

async function addUser() {
    const adminRoleData = await Role.findOne({ roleName: CONST_KEY.ROLE.ADMIN });

    const hashPassword = await bcrypt.hash("123456", 10);

    const users = [
        { username: "John", email: "john.doe@yopmail.com", password: hashPassword, role: adminRoleData.roleName },
        { username: "Susan", email: "susan.smith@yopmail.com", password: hashPassword, role: adminRoleData.roleName },
    ]
    const findUsers = await User.find();
    if (!findUsers || findUsers.length === 0) {
        return User.insertMany(users);
    }
}

async function initialValues() {
    try {
        await addRoles();
        await addUser();
    } catch (error) {
        console.error("Error initializing values:", error);
    }
}

module.exports = { initialValues };
