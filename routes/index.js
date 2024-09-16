const express = require("express");
const router = express.Router();
const enterCode = require("./enter-code");

router.use("/", enterCode);

module.exports = router;
