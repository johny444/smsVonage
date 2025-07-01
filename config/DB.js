const oracledb = require("oracledb");

async function getConnection() {
  // console.log("!!!!!!!!!DB is callling:", process.env.DB_CONNECT_STRING);
  try {
    const connection = await oracledb.getConnection({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING, // example: "localhost/orclpdb1"
    });

    console.log("Oracle DB connected");
    return connection;
  } catch (err) {
    console.error("Oracle DB connection failed:", err);
    throw err;
  }
}

module.exports = getConnection;
