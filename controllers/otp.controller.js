const otpService = require("../services/otp.service");

async function sendOtp(req, res) {
  const { phone, text } = req.body;
  console.log("Request Body: ", req.body);

  if (!phone || !text) {
    return res.status(400).json({
      errorCode: "01",
      errorDesc: "Bad request, phone number and otp are required",
    });
  }

  try {
    const result = await otpService.sendOtp(phone, text);
    console.log("text result: ", result);

    if (result.success) {
      res.json({
        errorCode: "00",
        errorDesc: "OTP sent",
        messageId: result.messageId,
        // price: result.price,
        // remainingBalance: result.remainingBalance,
        otp: result.text, //  dev
      });
    } else {
      res.status(400).json({
        errorCode: result.errorCode || "01",
        errorDesc: result.errorDesc || "Failed to send SMS",
        status: result.status,
      });
    }
  } catch (err) {
    console.error("Controller error:", err);
    res.status(500).json({
      errorCode: "01",
      errorDesc: "Internal server error while sending OTP",
    });
  }
}

function verifyOtp(req, res) {
  const { phone, code } = req.body;
  if (!phone || !code)
    return res
      .status(400)
      .json({ error: "Bad request,phone and code are required" });

  const result = otpService.verifyOtp(phone, code);
  if (!result.valid) return res.status(400).json({ error: result.error });

  res.json({ errorcode: "00", errorDesc: "OTP verified" });
}

module.exports = { sendOtp, verifyOtp };
