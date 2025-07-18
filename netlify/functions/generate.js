const QRCode = require('qrcode');

exports.handler = async (event, context) => {
  const { text, dark = '#000000', light = '#FFFFFF' } = event.queryStringParameters;

  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parâmetro "text" é obrigatório.' }),
    };
  }

  try {
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1.5,
      color: { dark, light },
    };
    const qrCodeImage = await QRCode.toDataURL(text, options);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ success: true, result: { dataUrl: qrCodeImage, format: 'png' } }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ocorreu um erro interno no servidor.' }),
    };
  }
};
