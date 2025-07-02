const os = require("os");

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        return config.address;
      }
    }
  }
  return "127.0.0.1";
}

module.exports = { getLocalIpAddress };
