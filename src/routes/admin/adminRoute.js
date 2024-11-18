const express = require('express');
const { adminLogin } = require('../../controller/v1/admin/adminController');
const userController = require('../../controller/v1/admin/userManagement');
const router = express.Router();


//admin auth
router.post("/login", adminLogin);

//user management
router.post('/user/add', userController.addUser);



module.exports = router;