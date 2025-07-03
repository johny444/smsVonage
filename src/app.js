require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const otpRoutes = require("../routes/otp.routes");
const dlrRoutes = require("../routes/dlr.routes");
const authRoutes = require("../routes/auth.routes");
const logger = require("morgan");
const setupSwagger = require("../config/swagger");
const { initPool } = require("../config/DB"); // Adjust path if needed
const { callSmsLog } = require("../services/smsLog.service");
const testSignRoutes = require("../routes/test-sign.routes");

(async () => {
  try {
    await initPool(); // Initializes pool when app starts
  } catch (err) {
    console.error("❌ Failed to initialize DB pool:", err);
    process.exit(1); // Exit app if DB pool can't be initialized
  }
})();

const app = express();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/auth", testSignRoutes);
app.use("/sms", otpRoutes);
app.use(dlrRoutes);
setupSwagger(app);

// Test procedure
// (async () => {
//   await callSmsLog({
//     id: "b988bf78-58b2-4ca2-a578-681b7db9c480",
//     errorCode: "00",
//     errorDesc: "Sent successfully",
//     request: `{"phone":"+8562058881078","text":"Your OTP is 1234 please don't share it."}`,
//     response: `{"success":true,"text":"Your OTP is 1234 please don't share it.","messageId":"b988bf78-58b2-4ca2-a578-681b7db9c480","status":"0"}`,
//     from: "from JDB",
//     to: "+8562058881078",
//     content: "Your OTP is 1234 please don't share it.",
//     messageDate: "2025-07-01T14:07:58.717Z",
//     action: "SEND",
//   });
// })();

module.exports = app;
