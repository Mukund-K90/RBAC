const Role = require("../../../model/role");
const User = require("../../../model/user");
const Token = require("../../../model/authTokens");
const { CONST_KEY } = require('../../../utils/const_key');


//find by Email
module.exports.findByEmail = async (email) => {
    try {
        const roleData = await Role.findOne({ roleName: CONST_KEY.ROLE.STAFF });
        const user = await User.findOne({ email, role: roleData.roleName });
        return { user, roleData };
    } catch (error) {
        throw error;
    }
}

//signUp
module.exports.signUp = async (userData) => {
    try {
        const user = new User(userData);
        const saveduser = await user.save();
        return saveduser;
    } catch (error) {
        throw error;
    }
}

//check token
module.exports.checkToken = async (id) => {
    try {
        return Token.findOne({ userId: id });
    } catch (error) {
        throw error;
    }
}

//generate new Token
module.exports.generateToken = async (id, token) => {
    const storedToken = new Token({
        userId: id,
        token: token,
    });
    storedToken.save();
    return storedToken;
}

//update Token
module.exports.updateToken = async (id, token) => {
    const updateToken = await Token.findOneAndUpdate({ userId: id }, { token }, { new: true });
    updateToken.save();
    return updateToken;
}