document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("text-input");
  const generateBtn = document.getElementById("generate-btn");
  const loader = document.getElementById("loader");
  const resultArea = document.getElementById("result-area");
  const qrCodeImg = document.getElementById("qr-code-img");
  const downloadLink = document.getElementById("download-link");
  const statusIndicator = document.getElementById("status-indicator");
  const statusText = document.getElementById("status-text");
  const latencyValue = document.querySelector("#status-latencia .status-value");
  const uptimeValue = document.querySelector("#status-uptime .status-value");
  const versionValue = document.querySelector("#status-versao .status-value");
  const lastCheckTime = document.getElementById("last-check-time");
  const API_BASE_URL = "/api";

  // Verifica se todos os elementos existem antes de seguir
  if (
    !textInput ||
    !generateBtn ||
    !loader ||
    !resultArea ||
    !qrCodeImg ||
    !downloadLink ||
    !statusIndicator ||
    !statusText ||
    !latencyValue ||
    !uptimeValue ||
    !versionValue ||
    !lastCheckTime
  ) {
    console.error(
      "Erro: Um ou mais elementos esperados não foram encontrados no DOM."
    );
    return;
  }

  const checkApiStatus = async () => {
    const startTime = Date.now();
    try {
      const response = await fetch(`${API_BASE_URL}/status`);
      const latency = Date.now() - startTime;

      if (!response.ok) throw new Error("API offline");

      const data = await response.json();

      if (data.status === "online") {
        statusIndicator.className = "status-indicator status-online";
        statusText.textContent = "Online";
        latencyValue.textContent = `${latency} ms`;
        versionValue.textContent = data.version || "N/A";
        uptimeValue.textContent = "99.9%"; // valor fixo visual
      } else {
        throw new Error("API retornou status inesperado");
      }
    } catch (error) {
      statusIndicator.className = "status-indicator status-offline";
      statusText.textContent = "Offline";
      latencyValue.textContent = "--- ms";
      uptimeValue.textContent = "--- %";
      versionValue.textContent = "---";
    } finally {
      lastCheckTime.textContent = new Date().toLocaleTimeString("pt-BR");
    }
  };

  const toggleLoading = (isLoading) => {
    loader.classList.toggle("hidden", !isLoading);
    generateBtn.disabled = isLoading;
    generateBtn.innerHTML = isLoading
      ? '<i class="fa-solid fa-spinner fa-spin"></i> Criando...'
      : '<i class="fa-solid fa-wand-magic-sparkles"></i> Criar meu QR Code!';
  };

  const showResult = (dataUrl) => {
    qrCodeImg.src = dataUrl;
    downloadLink.href = dataUrl;
    resultArea.classList.remove("hidden");
  };

  const generateQRCode = async () => {
    const text = textInput.value.trim();
    if (!text) {
      alert("Por favor, digite algo para criar a magia!");
      return;
    }

    toggleLoading(true);
    resultArea.classList.add("hidden");

    try {
      const response = await fetch(
        `${API_BASE_URL}/generate?text=${encodeURIComponent(text)}`
      );
      if (!response.ok) {
        let errorMsg = "Falha ao gerar o QR Code.";
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      showResult(data.result.dataUrl);
    } catch (error) {
      alert(`Awn, desculpe! Algo deu errado: ${error.message}`);
    } finally {
      toggleLoading(false);
    }
  };

  generateBtn.addEventListener("click", generateQRCode);
  textInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") generateQRCode();
  });

  checkApiStatus();
  setInterval(checkApiStatus, 30000);
});
