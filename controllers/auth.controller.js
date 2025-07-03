const jwt = require("jsonwebtoken");

function login(req, res) {
  const { username, password } = req.body;
  console.log("login:", process.env.SERVICE_PASSWORD);
  if (
    username === process.env.SERVICE_USERNAME &&
    password === process.env.SERVICE_PASSWORD
  ) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ errorCode: "00", errorDesc: "ok", token });
  }

  res.status(401).json({ errorCode: "01", errorDesc: "Invalid credentials" });
}

module.exports = { login };
