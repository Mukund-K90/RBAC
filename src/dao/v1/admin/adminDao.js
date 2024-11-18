const User = require('../../../model/user');
const Role = require('../../../model/role');
const { CONST_KEY } = require('../../../utils/const_key');
const Token = require('../../../model/authTokens');


//find by email
module.exports.findByEmail = async (email) => {
    try {
        const roleData = await Role.findOne({ roleName: CONST_KEY.ROLE.ADMIN });
        const admin = await User.findOne({ email: email }).where({ isDelete: false, role: CONST_KEY.ROLE.ADMIN });
        return { admin, roleData };
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
