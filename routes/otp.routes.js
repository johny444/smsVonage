/**
 * @swagger
 * /sms/send:
 *   post:
 *     summary: Send SMS to a phone number
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: HMAC-SHA256 signature of the raw JSON request body using the shared secret
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
 *                 example: "+856205555555"
 *               text:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad request or failed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Invalid signature
 */

const express = require("express");
const router = express.Router();
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");
const verifyToken = require("../middleware/verifyToken");
const verifySignature = require("../middleware/verifySignature");

router.post("/send", verifyToken, verifySignature, sendOtp);
// router.post("/verify", verifyOtp);

module.exports = router;
