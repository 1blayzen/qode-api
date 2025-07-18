const API_VERSION = "1.1.0";

exports.handler = async (event, context) => {
  const statusInfo = {
    status: "online",
    message: "API Qode está funcionando perfeitamente.",
    version: API_VERSION,
    timestamp: Date.now(),
  };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(statusInfo),
  };
};
