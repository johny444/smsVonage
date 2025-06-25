const express = require("express");
const bodyParser = require("body-parser");
const otpRoutes = require("../routes/otp.routes");
const dlrRoutes = require("../routes/dlr.routes");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());

app.use("/otp", otpRoutes);
app.use(dlrRoutes);
module.exports = app;
