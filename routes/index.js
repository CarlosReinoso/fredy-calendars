const express = require("express");
const router = express.Router();
const enterCode = require("./enter-code");
const airbnb = require("../api/airbnb");
const lodgify = require("../api/lodgify");
const test = require("../api/test");

router.use("/", enterCode);
router.use("/airbnb", airbnb);
router.use("/lodgify", lodgify);
router.use("/test", test);

module.exports = router;
