const express = require("express");
const router = express.Router();

router.post("/webhooks/dlr", (req, res) => {
  //  store status in DB
  // db.updateDeliveryStatus(req.body.messageId, req.body.status);
  console.log("Delivery Receipt (POST):", req.body);
  res.sendStatus(200);
});

router.get("/webhooks/dlr", (req, res) => {
  console.log("Delivery Receipt CHECK (GET):", req.query);
  res.status(200).send("Vonage DLR endpoint is active");
});

module.exports = router;
