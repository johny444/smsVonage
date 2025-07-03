// services/signature.service.js
const crypto = require("crypto");
// console.log("secret:", process.env.SIGNATURE_SECRET);
function generateSignature(payload) {
  const secret = process.env.SIGNATURE_SECRET;
  // console.log("secret:", secret);
  return crypto
    .createHmac("sha256", secret)
    .update(JSON.stringify(payload))
    .digest("hex");
}

module.exports = generateSignature;
