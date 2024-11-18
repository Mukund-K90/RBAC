const express = require('express');
const managerController = require('../../controller/v1/manager/managerController');
const router = express.Router();
const productController = require('../../controller/v1/productManagement/productController');
const { authentication } = require('../../middleware/auth.middleware');
const { validate } = require('../../middleware/schemaValidate.middleware');
const { addProduct } = require('../../validator/productValidator');
const { listAllUsers, updateUserData } = require('../../controller/v1/user/userManagementController');


//user auth
router.post('/signUp', managerController.userSignUp);
router.post('/login', managerController.userLogin);

//user management
router.get("/users", authentication, listAllUsers);
router.put("/users/update/:userId", authentication, updateUserData);

//product management
router.post("/product/add", authentication, validate(addProduct.body), productController.addProduct);

module.exports = router;