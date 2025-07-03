const { getConnection } = require("../config/DB");

async function getSmsStatusById(id) {
  const connection = await getConnection();
  try {
    const result = await connection.execute(
      `
      SELECT ID, ERRORCODE, ERRORDESC, MESSAGE_DATE
      FROM sms_external_log
      WHERE ID = :id
      `,
      [id],
      { outFormat: require("oracledb").OUT_FORMAT_OBJECT }
    );

    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (err) {
    console.error("❌ Error fetching SMS status:", err);
    throw err;
  } finally {
    await connection.close();
  }
}

module.exports = { getSmsStatusById };
