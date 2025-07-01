const oracledb = require("oracledb");
const getConnection = require("../config/DB"); // your connection helper

async function callSmsLog({
  id,
  errorCode,
  errorDesc,
  request,
  response,
  from,
  to,
  content,
  messageDate,
  action,
}) {
  let connection;
  console.log("SAVE LOG!!!", {
    id,
    errorCode,
    errorDesc,
    request,
    response,
    from,
    to,
    content,
    messageDate,
    action,
  });
  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      BEGIN
        SMS_LOG(
          :PR_ID,
          :PR_ERRORCODE,
          :PR_ERRORDESC,
          :PR_REQUEST,
          :PR_RESPONSE,
          :PR_FROMNUMBER,
          :PR_TONUMBER,
          :PR_CONTENT,
          :PR_MESSAGE_DATE,
          :PR_ACTION
        );
      END;
      `,
      {
        PR_ID: id,
        PR_ERRORCODE: errorCode,
        PR_ERRORDESC: errorDesc,
        PR_REQUEST: request,
        PR_RESPONSE: response,
        PR_FROMNUMBER: from,
        PR_TONUMBER: to,
        PR_CONTENT: content,
        PR_MESSAGE_DATE: messageDate,
        PR_ACTION: action,
      },
      { autoCommit: true }
    );

    console.log("✅ SMS_LOG procedure called successfully");
    return result;
  } catch (err) {
    console.error("❌ Error calling SMS_LOG:", err);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error("❌ Error closing connection:", err);
      }
    }
  }
}

module.exports = { callSmsLog };
