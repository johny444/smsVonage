const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

router.post("/send", sendOtp); // POST /otp
router.post("/verify", verifyOtp); // POST /otp/verify

module.exports = router;
