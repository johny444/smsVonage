const vonage = require("../config/vonage");
const otpStore = require("../utils/otpStore");

// function generateOtp() {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

async function sendOtp(phone, otp) {
  const from = process.env.VONAGE_FROM || "MyApp";

  console.log(`to: ${phone} ,from: ${from}, text: ${otp}`);
  otpStore.set(phone, {
    otp,
    expires: Date.now() + 2 * 60 * 1000, // 2 minutes
  });
  const text = `Your OTP is ${otp} please don't share this.`;
  try {
    const response = await vonage.sms.send({
      to: phone,
      from,
      text,
      callback: process.env.SMS_CALLBACK_URL,
    });
    const msg = response.messages[0];

    if (msg.status === "0") {
      console.log("message data:", response);
      return {
        success: true,
        text,
        messageId: msg["message-id"],
        // price: msg["message-price"],
        // remainingBalance: msg["remaining-balance"],
        status: msg.status,
      };
    } else {
      console.error("Vonage status error:", msg);
      return {
        success: false,
        errorCode: "01",
        errorDesc: "Failed to send SMS",
        status: msg.status,
      };
    }
  } catch (err) {
    console.error("Vonage error:", err);
    return {
      //   success: false,
      errorCode: "01",
      errorDesc: "SMS sending error",
    };
  }
}

function verifyOtp(phone, code) {
  const record = otpStore.get(phone);
  console.log("verifyOTP record: ", record);
  if (!record) return { valid: false, error: "No OTP sent" };
  if (Date.now() > record.expires) {
    otpStore.delete(phone);
    return { valid: false, error: "OTP expired" };
  }
  if (record.otp !== code) return { valid: false, error: "Invalid OTP" };

  otpStore.delete(phone);
  return { valid: true };
}

module.exports = { sendOtp, verifyOtp };
