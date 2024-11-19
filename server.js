const express = require('express');
const { CONFIG } = require('./src/config/config');
const { connectDb } = require('./src/config/db');
const app = express();
const cors = require('cors');
const { initialValues } = require('./src/utils/initials');
const { authentication } = require('./src/middleware/auth.middleware');
const { listAllUsers } = require('./src/controller/v1/user/userManagementController');


//parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDb();
initialValues();


//admin routes
const adminRoutes = require('./src/routes/admin/adminRoute');
app.use("/v1/admin", adminRoutes);

//staff routes
const staffRoutes = require('./src/routes/staff/staffRoute');
app.use("/v1/staff", staffRoutes);

//manager routes
const managerRoutes = require('./src/routes/manager/managerRoute');
app.use("/v1/manager", managerRoutes);

//user routes
const userRoutes = require('./src/routes/user/userRoute');
app.use("/v1/user", userRoutes);

//product routes
const productRoutes = require('./src/routes/product/productRoute');
app.use("/v1/product", productRoutes);

//order routes
const orderRoutes = require('./src/routes/order/orderRoute');
app.use("/v1/order", orderRoutes);

//listen server
const port = CONFIG.port || 3000;
app.listen(port, () => console.log(`Server running on ${port}`))