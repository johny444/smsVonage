const otpService = require("../services/otp.service");
const { callSmsLog } = require("../services/smsLog.service");
const generateSignature = require("../services/signature.service");

const from = process.env.VONAGE_FROM || "MyApp";
const secret = process.env.SIGNATURE_SECRET;

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
    if (result.messageId) {
      await callSmsLog({
        action: "SEND",
        id: result.messageId,
        errorCode: result.success ? "00" : "01",
        errorDesc: result.success ? "Sent successfully" : "Send failed",
        request: JSON.stringify(req.body),
        response: JSON.stringify(result.response),
        from,
        to: phone,
        content: text,
        messageDate: new Date().toISOString(),
      });
    }
    // if (result.success) {
    //   res.json({
    //     errorCode: result.status,
    //     errorDesc: "OTP sent",
    //     messageId: result.messageId,
    //     // price: result.price,
    //     // remainingBalance: result.remainingBalance,
    //     content: result.text, //  dev
    //   });
    // } else {
    //   res.status(400).json({
    //     errorCode: result.errorCode || "01",
    //     errorDesc: result.errorDesc || "Failed to send SMS",
    //     status: result.status,
    //   });
    // }

    // integrate signature
    const responsePayload = result.success
      ? {
          errorCode: result.status,
          errorDesc: "OTP sent",
          messageId: result.messageId,
          content: result.text, // dev only
        }
      : {
          errorCode: result.errorCode || "01",
          errorDesc: result.errorDesc || "Failed to send SMS",
          status: result.status,
        };

    const signature = generateSignature(responsePayload, secret);
    return res
      .set("x-signature", signature)
      .status(result.success ? 200 : 400)
      .json(responsePayload);
  } catch (err) {
    // console.error("Controller error:", err);
    // res.status(500).json({
    //   errorCode: "01",
    //   errorDesc: "Internal server error while sending OTP",
    // });
    console.error("Controller error:", err);
    const payload = {
      errorCode: "01",
      errorDesc: "Internal server error while sending OTP",
    };
    const signature = generateSignature(payload, secret);
    res.set("x-signature", signature).status(500).json(payload);
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
