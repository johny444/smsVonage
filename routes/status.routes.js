/**
 * @swagger
 * /sms/status/{id}:
 *   get:
 *     summary: Get SMS delivery status by Message ID
 *     tags: [SMS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: x-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: HMAC SHA256 signature of the request
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Message ID returned by Vonage
 *     responses:
 *       200:
 *         description: Delivery status
 *       404:
 *         description: Not found
 */
const express = require("express");
const router = express.Router();
const { getSmsStatusById } = require("../services/smsStatus.service");
const verifyToken = require("../middleware/verifyToken");
const verifySignature = require("../middleware/verifySignature");

router.get("/status/:id", verifyToken, verifySignature, async (req, res) => {
  try {
    const result = await getSmsStatusById(req.params.id);
    console.log("result status:", result);
    if (!result)
      return res.status(404).json({ errorCode: "01", errorDesc: "Not found" });
    res.json({ errorCode: "00", errorDesc: "ok", result });
  } catch (err) {
    res
      .status(500)
      .json({ errorCode: "01", errorDesc: `Internal Server Error:${err}` });
  }
});

module.exports = router;
