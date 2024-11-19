const express = require('express');
const router = express.Router();
const { listAllUsers, updateUserData, deleteUserData } = require('../../controller/v1/user/userManagementController');
const { validate } = require('../../middleware/schemaValidate.middleware');
const { authentication, authorizeRoles } = require('../../middleware/auth.middleware');
const { CONST_KEY } = require('../../utils/const_key');

//user management
router.get("/", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), listAllUsers);
router.put("/update/:userId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), updateUserData);
router.delete("/delete/:userId", authentication, authorizeRoles([CONST_KEY.ROLE.ADMIN, CONST_KEY.ROLE.MANAGER]), deleteUserData);

module.exports = router;