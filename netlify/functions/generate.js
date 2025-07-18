const QRCode = require('qrcode');

const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);

exports.handler = async (event, context) => {
  const {
    text,
    dark = '#000000',
    light = '#FFFFFF',
    format = 'dataUrl',  // 'dataUrl' ou 'png'
  } = event.queryStringParameters || {};

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
      body: JSON.stringify({ error: 'Parâmetros de cor inválidos. Use hex (ex: #RRGGBB).' }),
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

    if (format === 'png') {
      // Retorna o PNG puro (imagem binária)
      const buffer = await QRCode.toBuffer(text, options);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        },
        body: buffer.toString('base64'),
        isBase64Encoded: true,
      };
    }

    // Padrão: retorna JSON com dataUrl base64
    const dataUrl = await QRCode.toDataURL(text, options);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ success: true, result: { dataUrl, format: 'png' } }),
    };
  } catch (err) {
    console.error('Erro na geração do QRCode:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro interno ao gerar o QRCode.' }),
    };
  }
};
