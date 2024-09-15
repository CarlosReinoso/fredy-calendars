const isProd = process.env.NODE_ENV == "production" ? true : false;

module.exports = {
  isProd,
};
