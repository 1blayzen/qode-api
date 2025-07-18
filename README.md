# 🚀 Qode - Gerador de QR Code

Bem-vindo ao Qode, um projeto simples para gerar QR Codes de forma instantânea. Este repositório contém o código de um site estático e uma API serverless construída para ser hospedada na plataforma Netlify.

[![Status da API](https://api.netlify.com/api/v1/badges/SEU_APP_ID_AQUI/deploy-status )](https://app.netlify.com/sites/qode-api/deploys )

> **Acesse a aplicação ao vivo:** [qode-api.netlify.app](https://qode-api.netlify.app/ )
>
> **Acesse a documentação completa:** [qode-api.netlify.app/docs.html](https://qode-api.netlify.app/docs.html )

---

## 📚 Documentação Rápida da API

A URL base para todas as chamadas é https://qode-api.netlify.app.

### Endpoint Principal: GET /api/generate

Gera uma imagem de QR Code com base nos parâmetros fornecidos.

#### Parâmetros (Query Params )

| Parâmetro      | Tipo   | Obrigatório | Padrão      | Descrição                                                    |
| :------------- | :----- | :---------- | :---------- | :----------------------------------------------------------- |
| text         | string | **Sim**     | N/A         | O conteúdo a ser codificado (limite de 1024 caracteres).     |
| cor_qrcode   | hex    | Não         | #000000   | Cor dos pontos do QR Code.                                   |
| cor_fundo    | hex    | Não         | #FFFFFF   | Cor do fundo do QR Code.                                     |
| size         | string | Não         | 400x400   | Tamanho da imagem em pixels (formato NxN, máx 2048).         |
| format       | string | Não         | dataUrl   | Formato da resposta. Use png para receber a imagem diretamente. |

#### Exemplos de Uso

**1. Obter a imagem PNG diretamente (ideal para bots e embeds):**

https://qode-api.netlify.app/api/generate?text=Discord&format=png&size=500x500&cor_qrcode=%235865F2
*Este link pode ser usado diretamente em uma tag <img> ou em embeds do Discord.*

**2. Obter a resposta em JSON com a imagem em base64 (Data URL ):**

https://qode-api.netlify.app/api/generate?text=AmoGatinhosFofos
*Resposta:*
json
{
  "success": true,
  "result": {
    "dataUrl": "data:image/png;base64,iVBORw0KG...",
    "format": "png"
  }
}