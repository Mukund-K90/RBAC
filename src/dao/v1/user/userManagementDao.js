const User = require("../../../model/user");

//find by id
module.exports.findById = async (id) => {
    try {
        return await User.findById(id).where({ isDelete: false });
    } catch (error) {
        throw error;
    }

}

//fetch all user
module.exports.getAllUser = async () => {
    try {
        return User.find({ isDelete: false });
    } catch (error) {
        throw error;
    }
}

//update user
module.exports.updateUser = async (id, upadtedData) => {
    try {
        const user = await User.findByIdAndUpdate(id, upadtedData, { new: true });
        const upadtedUser = user.save();
        return upadtedUser;
    } catch (error) {
        throw error;
    }
}

//delete user
module.exports.deleteUser = async (id, upadtedData) => {
    try {
        const user = await User.findByIdAndUpdate(id, { isDelete: true }, { new: true });
        const deletedUser = user.save();
        return deletedUser;
    } catch (error) {
        throw error;
    }
}