import { GoogleGenAI, Type } from "@google/genai";
import { Damage, Inspection } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const inspectionSchema = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING, description: "A technical summary of the vehicle's condition" },
    overallState: { type: Type.STRING, description: "General state (e.g., Fair, Good, Poor)" },
    originalityStatus: { type: Type.STRING, enum: ["Original", "Altered", "Unknown"], description: "Whether the vehicle parts look original" },
    damages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "Type of damage (e.g., Dent, Scratch, Non-original part)" },
          part: { type: Type.STRING, description: "The part of the car affected" },
          description: { type: Type.STRING, description: "Detailed description of the issue" },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          estimatedCost: { type: Type.NUMBER, description: "Estimated repair cost in BRL (numeric value only)" }
        },
        required: ["type", "part", "description", "severity", "estimatedCost"]
      }
    }
  },
  required: ["summary", "overallState", "originalityStatus", "damages"]
};

export async function analyzeVehicleImage(base64Image: string): Promise<Partial<Inspection>> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const prompt = `
    Aja como um perito automotivo sênior realizando um laudo cautelar.
    Analise esta imagem de um veículo detalhadamente.
    
    Identifique:
    1. Danos visíveis: amassados (dents), riscos (scratches), trincas (cracks), ralados em rodas.
    2. Originalidade: Identifique peças que pareçam não originais, lanternas de marcas diferentes, rodas de ferro onde deveria ser liga leve, etc.
    3. Severidade: Baixa (estético), Média (afeta painel/alinhamento), Alta (estrutural/substituição necessária).
    
    Para cada item:
    - Especifique a peça exata (ex: para-lama dianteiro esquerdo, roda traseira direita).
    - Dê uma descrição técnica em português.
    - Estime o custo de reparo ou substituição baseado no mercado brasileiro de peças e mão de obra (BRL).
    
    A resposta DEVE ser em JSON seguindo o schema fornecido.
    No summary, faça uma análise geral da condição e originalidade.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: inspectionSchema
      }
    });

    const result = JSON.parse(response.text || '{}');
    return result;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
}
