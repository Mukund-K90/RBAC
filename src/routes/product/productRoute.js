const express = require('express');
const { authentication } = require('../../middleware/auth.middleware');
const productController = require('../../controller/v1/productManagement/productController');
const router = express.Router();
const { validate } = require('../../middleware/schemaValidate.middleware');
const { addProduct } = require('../../validator/productValidator');
const { authorizeRoles } = require('../../middleware/authorizeRoles');
const { CONST_KEY } = require('../../utils/const_key');

//product management
router.post("/add", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), validate(addProduct.body), productController.addProduct);

module.exports = router;