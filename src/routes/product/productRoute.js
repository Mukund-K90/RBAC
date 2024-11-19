const express = require('express');
const { authentication, authorizeRoles } = require('../../middleware/auth.middleware');
const productController = require('../../controller/v1/productManagement/productController');
const router = express.Router();
const { validate } = require('../../middleware/schemaValidate.middleware');
const { addProduct } = require('../../validator/productValidator');
const { CONST_KEY } = require('../../utils/const_key');

//product management
router.post("/add", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), validate(addProduct.body), productController.addProduct);
router.get("/", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), productController.listProduct);
router.put("/update/:productId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), productController.updateProduct);
router.delete("/delete/:productId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), productController.deleteProduct);

module.exports = router; 