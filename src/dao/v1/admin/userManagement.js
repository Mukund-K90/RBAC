const Role = require("../../../model/role");
const User = require("../../../model/user");

module.exports.findByEmail = async (email) => {
    try {
        return await User.findOne({ email });
    } catch (error) {
        throw error;
    }
}
module.exports.add = async (userData) => {
    try {
        const user = new User(userData);
        const saveduser = await user.save();
        return saveduser;
    } catch (error) {
        throw error;
    }
}