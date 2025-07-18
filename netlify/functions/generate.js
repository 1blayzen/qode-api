const QRCode = require('qrcode');

const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

exports.handler = async (event, context) => {
  const {
    text,
    dark = '#000000',
    light = '#FFFFFF',
    format = 'dataUrl', 
  } = event.queryStringParameters;


  if (!text) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parâmetro "text" é obrigatório.' }),
    };
  }
  if (text.length > 1024) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'O texto excede o limite de 1024 caracteres.' }),
    };
  }
  if (!isValidHexColor(dark) || !isValidHexColor(light)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Os parâmetros de cor devem ser códigos hexadecimais válidos (ex: #RRGGBB).' }),
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

    if (format === 'buffer') {
      const qrCodeBuffer = await QRCode.toBuffer(text, options);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
        body: qrCodeBuffer.toString('base64'),
        isBase64Encoded: true,
      };
    }


    const qrCodeImage = await QRCode.toDataURL(text, options);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
      body: JSON.stringify({ success: true, result: { dataUrl: qrCodeImage, format: 'png' } }),
    };

  } catch (err) {
    console.error('Erro na geração do QRCode:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Ocorreu um erro interno no servidor ao gerar a imagem.' }),
    };
  }
};
