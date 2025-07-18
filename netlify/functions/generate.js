const QRCode = require('qrcode');

const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);
const isValidSize = (size) => /^\d+x\d+$/.test(size);

exports.handler = async (event, context) => {
  const {
    text,
    dark = '#000000',
    light = '#FFFFFF',
    format = 'dataUrl',  // 'dataUrl' ou 'png'
    size = '400x400',    // novo parâmetro tamanho, padrão 400x400
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
  if (!isValidSize(size)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Parâmetro "size" inválido. Use formato NxN, ex: 400x400.' }),
    };
  }

  // Extrai largura e altura do size
  const [widthStr, heightStr] = size.split('x');
  const width = parseInt(widthStr, 10);
  const height = parseInt(heightStr, 10);

  try {
    const options = {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 1.5,
      width, // aplica largura (qrcode usa quadrado, height não é usado)
      color: { dark, light },
    };

    if (format === 'png') {
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
