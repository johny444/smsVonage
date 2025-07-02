// const express = require("express");
// const router = express.Router();

// router.post("/webhooks/dlr", (req, res) => {
//   //  store status in DB
//   // db.updateDeliveryStatus(req.body.messageId, req.body.status);
//   console.log("Delivery Receipt (POST):", req.body);
//   res.sendStatus(200);
// });

// router.get("/webhooks/dlr", (req, res) => {
//   console.log("Delivery Receipt CHECK (GET):", req.query);
//   //store on DB
//   res.status(200).send("Vonage DLR endpoint is active");
// });

// module.exports = router;
// -------------
const express = require("express");
const { callSmsLog } = require("../services/smsLog.service");

const router = express.Router();

// 🧠 Shared handler
async function handleDLR(req, res) {
  const data = req.method === "POST" ? req.body : req.query;
  console.log("handleDLR callback:", data);
  const messageId = data.messageId || data["message-id"];
  const to = data.msisdn;
  const status = data.status;

  try {
    await callSmsLog({
      action: "DLR",
      id: messageId,
      errorCode: "00",
      errorDesc: status || "DLR received",
      request: null,
      response: JSON.stringify(data),
      from: null,
      to,
      content: null,
      messageDate: new Date().toISOString(),
    });
    console.log("-----------------------------------");
    console.log(`✅ DLR Callback (${req.method}) logged:`, messageId);
    console.log("-----------------------------------");
    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Failed to log DLR:", err.message);
    res.sendStatus(500);
  }
}

// Both methods use the same function
router.get("/webhooks/dlr", handleDLR);
router.post("/webhooks/dlr", handleDLR);

module.exports = router;
