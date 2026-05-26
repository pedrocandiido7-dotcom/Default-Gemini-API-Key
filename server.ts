import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Setup body parsers for base64 images
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// Initialize Gemini Client with standard headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

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
          type: { type: Type.STRING, description: "Type of damage (e.g., Amassado, Risco, Peça Não Original, Trinca)" },
          part: { type: Type.STRING, description: "The part of the car affected (e.g., Para-choque dianteiro, Capô, Porta traseira direita)" },
          description: { type: Type.STRING, description: "Detailed description of the issue in Portuguese" },
          severity: { type: Type.STRING, enum: ["Low", "Medium", "High"] },
          estimatedCost: { type: Type.NUMBER, description: "Estimated repair cost in BRL (numeric value only)" }
        },
        required: ["type", "part", "description", "severity", "estimatedCost"]
      }
    }
  },
  required: ["summary", "overallState", "originalityStatus", "damages"]
};

// API Endpoint for Vehicle Image Analysis
app.post("/api/analyze-vehicle", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "No image payload provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server" });
    }

    const prompt = `
      Aja como um perito automotivo profissional realizando um laudo cautelar.
      Analise esta imagem de um veículo detalhadamente.
      
      Identifique:
      1. Danos visíveis como amassados (dents), riscos (scratches), trincas (cracks), arranhões ou peças avariadas.
      2. Originalidade: Identifique peças ou acessórios que parecem não originais ou modificados do padrão de fábrica (como rodas não condizentes, faróis adulterados, etc.).
      3. Severidade: 
         - Low (Baixa: danos estéticos simples, riscos leves, pequenos arranhões)
         - Medium (Média: amassados médios, partes desalinhadas que exigem funilaria simples)
         - High (Alta: danos estruturais graves, peças rasgadas ou amassadas gravemente exigindo substituição)
      
      Para cada item de dano/inconsistência:
      - Especifique o tipo de dano ("type") em português (ex: "Amassado", "Risco", "Peça Não Original", etc.)
      - Identifique a peça afetada ("part") em português (ex: "Para-lama Dianteiro Esquerdo", "Porta Traseira Direita", "Roda Dianteira Esquerda")
      - Dê uma descrição técnica detalhada das avarias ("description") em português.
      - Estime o custo aproximado de reparo ou substituição ("estimatedCost") em Reais (BRL, apenas número).
      
      Forneça as informações estritamente estruturadas de acordo com o schema JSON fornecido.
      O resumo ("summary") deve ser um parecer técnico geral da originalidade e conservação do veículo nesta imagem em português.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: image } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: inspectionSchema
      }
    });

    const text = response.text || "{}";
    const result = JSON.parse(text);
    return res.json(result);
  } catch (error: any) {
    console.error("Error analyzing vehicle on server:", error);
    return res.status(500).json({ 
      error: error.message || "Internal server error during analysis" 
    });
  }
});

// Setup Vite or Static File Serving
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DamageScan Auto server running on http://localhost:${PORT}`);
  });
}

setupVite();
