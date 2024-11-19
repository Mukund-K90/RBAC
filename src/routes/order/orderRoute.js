const express = require('express');
const { authentication, authorizeRoles } = require('../../middleware/auth.middleware');
const orderController = require('../../controller/v1/orderManagement/orderManagementController');
const router = express.Router();
const { validate } = require('../../middleware/schemaValidate.middleware');
const { CONST_KEY } = require('../../utils/const_key');
const { addOrder } = require('../../validator/orderValidator');

//placed order
router.post("/add", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), validate(addOrder.body), orderController.addOrder);
router.get("/view/:orderId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER, CONST_KEY.ROLE.STAFF]), orderController.viewOrder);
router.put("/update-status/:orderId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER, CONST_KEY.ROLE.STAFF]), orderController.updateOrderStatus);
router.get("/", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER, CONST_KEY.ROLE.STAFF]), orderController.viewAllOrder);

module.exports = router;