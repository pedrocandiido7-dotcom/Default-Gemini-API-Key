import { Inspection } from "../types";

/**
 * Realiza a análise técnica do veículo enviando a imagem para a API segura no servidor.
 * Mantém o segredo da API Key oculto do navegador.
 */
export async function analyzeVehicleImage(base64Image: string): Promise<Partial<Inspection>> {
  const response = await fetch("/api/analyze-vehicle", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: base64Image }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Erro no servidor ao processar a análise do veículo.");
  }

  const result = await response.json();
  return result;
}
