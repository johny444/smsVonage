// const oracledb = require("oracledb");

// async function getConnection() {
//   // console.log("!!!!!!!!!DB is callling:", process.env.DB_CONNECT_STRING);
//   try {
//     const connection = await oracledb.getConnection({
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       connectString: process.env.DB_CONNECT_STRING, // example: "localhost/orclpdb1"
//     });

//     console.log("Oracle DB connected");
//     return connection;
//   } catch (err) {
//     console.error("Oracle DB connection failed:", err);
//     throw err;
//   }
// }

// module.exports = getConnection;

// db.js
const oracledb = require("oracledb");

let pool;

async function initPool() {
  if (pool) return pool;

  try {
    pool = await oracledb.createPool({
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      connectString: process.env.DB_CONNECT_STRING,
      poolMin: 2,
      poolMax: 10,
      poolIncrement: 1,
    });

    console.log("Oracle DB connected!!!");
    return pool;
  } catch (err) {
    console.error("Error creating DB pool:", err);
    throw err;
  }
}

async function getConnection() {
  if (!pool) await initPool();
  return await pool.getConnection();
}

module.exports = {
  initPool,
  getConnection,
};
