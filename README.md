

```md
# Documentação da API Qode

Guia completo para integrar com a nossa API mágica e otimizada!

## GET /api/status

### Status

Verifica a saúde e a disponibilidade da API. Ideal para monitoramento.

#### Resposta de Sucesso (200 OK)

json
{
  "status": "online",
  "message": "API Qode está funcionando perfeitamente.",
  "version": "1.1.0",
  "timestamp": 1678886400000
}
```

---

## GET /api/generate

### Principal

O endpoint principal para gerar a imagem de um QR Code.

### Parâmetros (Query)

| Parâmetro    | Tipo   | Obrigatório | Padrão    | Descrição                                                |
|--------------|--------|-------------|-----------|----------------------------------------------------------|
| `text`       | string | Sim         | N/A       | O conteúdo a ser codificado (limite de 1024 caracteres). |
| `cor_qrcode` | hex    | Não         | `#000000` | Cor dos pontos do QR Code.                               |
| `cor_fundo`  | hex    | Não         | `#FFFFFF` | Cor do fundo do QR Code.                                 |
| `size`       | string | Não         | `400x400` | Tamanho da imagem em pixels (formato NxN, máx 2048).     |
| `format`     | string | Não         | `dataUrl` | Formato da resposta. Use `png` para receber a imagem diretamente. |

### Exemplos de Requisição

- URL para obter a imagem diretamente (PNG):

```
/api/generate?text=Laren&format=png&size=500x500&cor_qrcode=%235865F2
```

- URL para obter JSON com Data URL:

```
/api/generate?text=AmoGatinhosFofos
```

### Resposta de Sucesso (200 OK)

A resposta varia de acordo com o parâmetro `format`.

- **Resposta para `format=dataUrl` (padrão):**

```json
{
  "success": true,
  "result": {
    "dataUrl": "data:image/png;base64,iVBORw0KG...",
    "format": "png"
  }
}
```

- **Resposta para `format=png`:**

A imagem PNG é retornada diretamente no corpo da resposta com cabeçalho `Content-Type: image/png`.

---

## 💖 Créditos

Feito com carinho especialmente para o bot **Laren**.  
Contribuições são bem-vindas — fique à vontade para abrir issues, enviar PRs ou sugestões!
