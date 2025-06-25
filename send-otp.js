// index.js
const express = require("express");
const bodyParser = require("body-parser");
const { Vonage } = require("@vonage/server-sdk");
require("dotenv").config();
const app = express();
const port = 3000;

// Configure Vonage
const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  //   signature: {
  //   secret: process.env.SMS_SIGNATURE_SECRET,
  //     algorithm: "md5hash",
  //   },
});

// Middleware to parse JSON
app.use(bodyParser.json());

// Route to send OTP
app.post("/send-otp", (req, res) => {
  const { phone, text } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  //   const text = `Your OTP is: ${otp}`;

  const from = "AlofromJDB";

  vonage.sms
    .send({ to: phone, from, text })
    .then((response) => {
      const status = response.messages[0].status;
      if (status === "0") {
        console.log(`${text} sent to ${phone}`);
        console.log("message data:", response);
        res.json({
          errorCode: "00",
          errorDesc: "success",
          text,
          messageId: response.messages[0]["message-id"],
          //   data: response,
        });
      } else {
        console.error("Vonage status error:", response.messages[0]);
        res
          .status(500)
          .json({ errorCode: "01", errorDesc: "Failed to send SMS" });
      }
    })
    .catch((err) => {
      console.error("Vonage error:", err);
      res.status(500).json({ errorCode: "01", errorDesc: "SMS sending error" });
    });
});

app.post("/verify-otp", (req, res) => {
  const { phone, code } = req.body;
  const record = otpStore[phone];
  if (!record) return res.status(400).json({ errorDesc: "No OTP sent" });

  if (Date.now() > record.expires)
    return res.status(400).json({ errorDesc: "OTP expired" });

  if (record.otp != code)
    return res.status(400).json({ errorDesc: "Invalid OTP" });

  delete otpStore[phone]; // Optional: delete once used
  res.json({ success: true, message: "OTP verified!" });
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
