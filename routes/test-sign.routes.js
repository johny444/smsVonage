/**
 * @swagger
 * /auth/test-sign:
 *   post:
 *     summary: Generate signature for given data
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               phone: "+856205555555"
 *               text: "123456"
 *     responses:
 *       200:
 *         description: Signature generated
 */

const express = require("express");
const router = express.Router();
const generateSignature = require("../services/signature.service");

router.post("/test-sign", (req, res) => {
  const signature = generateSignature(req.body);

  res.json({
    signature,
    data: req.body,
  });
});

module.exports = router;
