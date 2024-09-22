require("dotenv").config();

const isProd = process.env.NODE_ENV == "production" ? true : false;
const apiBaseUrl = process.env.API_BASE_URL;
console.log("🚀 ~ process.env.NODE_ENV:", process.env.NODE_ENV);

module.exports = {
  isProd,
  apiBaseUrl,
};
