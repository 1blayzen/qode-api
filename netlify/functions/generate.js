const QRCode = require("qrcode");

const isValidHexColor = (hex) => /^#[0-9A-F]{6}$/i.test(hex);
const isValidSize = (size) => /^\d+x\d+$/.test(size);

const BASE_QR_OPTIONS = {
  errorCorrectionLevel: "M",
  type: "image/png",
  quality: 0.92,
  margin: 1.5,
};

exports.handler = async (event) => {
  try {
    const params = event.queryStringParameters || {};
    const {
      text,
      cor_qrcode = "#000000",
      cor_fundo = "#FFFFFF",
      format = "dataUrl",
      size = "400x400",
    } = params;

    if (!text) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Parâmetro "text" é obrigatório.' }),
      };
    }
    if (text.length > 1024) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "O texto excede o limite de 1024 caracteres.",
        }),
      };
    }
    if (!isValidHexColor(cor_qrcode) || !isValidHexColor(cor_fundo)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error:
            'Parâmetros de cor inválidos. Use "cor_qrcode" e "cor_fundo" com formato hex (ex: #RRGGBB).',
        }),
      };
    }
    if (!isValidSize(size)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Parâmetro "size" inválido. Use formato NxN, ex: 400x400.',
        }),
      };
    }

    const width = parseInt(size.split("x")[0], 10);
    if (width > 2048) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "O tamanho máximo permitido é 2048x2048.",
        }),
      };
    }

    const options = {
      ...BASE_QR_OPTIONS,
      width,
      color: {
        dark: cor_qrcode,
        light: cor_fundo,
      },
    };

    const baseHeaders = {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    };

    if (format === "png") {
      const buffer = await QRCode.toBuffer(text, options);
      return {
        statusCode: 200,
        headers: { ...baseHeaders, "Content-Type": "image/png" },
        body: buffer.toString("base64"),
        isBase64Encoded: true,
      };
    }

    const dataUrl = await QRCode.toDataURL(text, options);
    return {
      statusCode: 200,
      headers: { ...baseHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        success: true,
        result: { dataUrl, format: "png" },
      }),
    };
  } catch (err) {
    console.error("Erro na geração do QRCode:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno ao gerar o QRCode." }),
    };
  }
};
