const dotenv = require('dotenv');
dotenv.config();

const config = {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    BUCKET_NAME: process.env.BUCKET_NAME,
    IAM_USER_KEY: process.env.IAM_USER_KEY,
    IAM_USER_SECRET: process.env.IAM_USER_SECRET,
    TOTAL_INTEREST: 10,
    LENDER_INTEREST: 2,
    CREDIT_LINE_DAYS: 60
};

module.exports = config;