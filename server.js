const express = require('express');
const { CONFIG } = require('./src/config/config');
const { connectDb } = require('./src/config/db');
const app = express();
const cors = require('cors');
const { initialValues } = require('./src/utils/initials');

//parse body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

connectDb();
initialValues();


//admin routes
const adminRoutes = require('./src/routes/admin/adminRoute');
app.use("/v1/admin", adminRoutes);

//listen server
const port = CONFIG.port || 3000;
app.listen(port, () => console.log(`Server running on ${port}`))