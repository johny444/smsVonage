const crypto = require("crypto");

function verifySignature(req, res, next) {
  const secret = process.env.SIGNATURE_SECRET;
  const receivedSig = req.headers["x-signature"];
  if (!receivedSig)
    return res
      .status(401)
      .json({ errorCode: "01", error: "Signature missing" });

  const raw = JSON.stringify(req.body);
  const calculated = crypto
    .createHmac("sha256", secret)
    .update(raw)
    .digest("hex");

  if (calculated !== receivedSig) {
    return res
      .status(403)
      .json({ errorCode: "01", errorDesc: "Invalid signature" });
  }

  next();
}

module.exports = verifySignature;
