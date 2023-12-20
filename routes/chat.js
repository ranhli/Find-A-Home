const express = require("express");
const router = express.Router();
const chat = require("../controllers/chat");
const catchAsync = require("../utils/catchAsync");

router.route("/").post(catchAsync(chat.submitMessage));

module.exports = router;
