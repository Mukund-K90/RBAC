const express = require('express');
const { adminLogin } = require('../../controller/v1/admin/adminController');
const { authentication } = require('../../middleware/auth.middleware');
const { listAllUsers, updateUserData, deleteUserData } = require('../../controller/v1/user/userManagementController');
const productController = require('../../controller/v1/productManagement/productController');
const router = express.Router();
const { validate } = require('../../middleware/schemaValidate.middleware');
const { addProduct } = require('../../validator/productValidator');


//admin auth
router.post("/login", adminLogin);

//user management
router.get("/users", authentication, listAllUsers);
router.put("/users/update/:userId", authentication, updateUserData);
router.delete("/users/delete/:userId", authentication, deleteUserData);

//product management
router.post("/products/add", authentication, validate(addProduct.body), productController.addProduct);
router.get("/products", authentication, productController.listProduct);
router.put("/products/update/:productId", authentication, productController.updateProduct);
router.delete("/products/delete/:productId", authentication, productController.deleteProduct);

module.exports = router;