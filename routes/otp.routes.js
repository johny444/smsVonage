/**
 * @swagger
 * /otp/send:
 *   post:
 *     summary: Send OTP to a phone number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - text
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "+85620xxxxxx"
 *               text:
 *                 type: string
 *                 example: "Your OTP is 123456"
 *     responses:
 *       200:
 *         description: OTP sent
 */

/**
 * @swagger
 * /otp/verify:
 *   post:
 *     summary: Verify the OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - code
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified
 */
const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");

router.post("/send", sendOtp);
router.post("/verify", verifyOtp);

module.exports = router;
