const isProd = `process.env.NODE_ENV` == "production" ? true : false;
console.log("🚀 ~ process.env.NODE_ENV:", process.env.NODE_ENV)

module.exports = {
  isProd,
};
