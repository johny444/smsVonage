const vonage = require("../config/vonage");
const otpStore = require("../utils/otpStore");
const { getLocalIpAddress } = require("../services/getIP.service");

async function sendOtp(phone, text) {
  const from = process.env.VONAGE_FROM || "MyApp";

  console.log(`to: ${phone} ,from: ${from}, text: ${text}`);
  otpStore.set(phone, {
    text,
    expires: Date.now() + 2 * 60 * 1000, // 2 minutes
  });
  console.log("callback URL", process.env.SMS_CALLBACK_URL);
  // console.log("Local IP:", getLocalIpAddress());
  try {
    // const response = await vonage.sms.send({
    //   to: phone,
    //   from,
    //   text,
    //   callback: process.env.SMS_CALLBACK_URL,
    // });
    const msg = response.messages[0];
    console.log("--------------------------------");
    console.log("response from Vonage:", response);
    console.log("--------------------------------");
    if (msg.status === "0") {
      // console.log("message data:", response);
      return {
        success: true,
        text,
        messageId: msg["message-id"],
        // price: msg["message-price"],
        // remainingBalance: msg["remaining-balance"],
        status: msg.status,
        response: response.messages[0],
      };
    } else {
      console.error("Vonage status error:", msg);
      return {
        success: false,
        errorCode: "01",
        errorDesc: "Failed to send SMS",
        status: msg.status,
        response: response.messages[0],
      };
    }
  } catch (err) {
    console.error("Vonage error:", err);
    return {
      //   success: false,
      errorCode: "01",
      errorDesc: `SMS sending error: ${err}`,
    };
  }
}

function verifyOtp(phone, code) {
  const record = otpStore.get(phone);
  console.log("verifyOTP record: ", record);

  if (!record) {
    return { valid: false, error: "No OTP sent to this number." };
  }

  if (Date.now() > record.expires) {
    otpStore.delete(phone);
    return { valid: false, error: "OTP expired." };
  }

  // 🧠 Extract the numeric OTP from the stored text (e.g. "Your OTP is 4444...")
  const match = record.text.match(/\b\d{4,6}\b/); // Match 4-6 digit OTP
  const extractedOtp = match ? match[0] : null;

  if (!extractedOtp) {
    return { valid: false, error: "Could not find OTP in message text." };
  }

  if (extractedOtp !== code) {
    return { valid: false, error: "Invalid OTP." };
  }

  otpStore.delete(phone);
  return { valid: true };
}

module.exports = { sendOtp, verifyOtp };
