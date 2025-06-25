const { Vonage } = require("@vonage/server-sdk");
require("dotenv").config();

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
  signature: {
    secret: process.env.SMS_SIGNATURE_SECRET,
    algorithm: "md5hash",
  },
});

module.exports = vonage;
