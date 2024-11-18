const dotenv = require('dotenv');
dotenv.config();

module.exports.CONFIG = {
    port: process.env.PORT,
    dbURL: process.env.DB_URL,
    jwtSecret: process.env.JWT_SECRET,
    tokenExp: process.env.TOKEN_EXP || '1d', 
    nodeEnv: process.env.NODE_ENV || 'development',
}