const express = require('express');
const userController = require('../../controller/v1/staff/staffManagementController');
const router = express.Router();

//user management
router.post('/signUp', userController.userSignUp);
router.post('/login', userController.userLogin);

module.exports = router;