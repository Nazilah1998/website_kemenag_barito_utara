import { streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { z } from "zod";
import SYSTEM_PROMPT from "@/lib/chat/system-prompt";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logInfo, logError } from "@/lib/logger";
import { db } from "@/lib/drizzle";
import { ai_knowledge_base } from "@/db/schema";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

// Custom fallback wrapper to sequentially try models if one fails (e.g. rate limit, error)
const fallback = (models) => ({
  specificationVersion: 'v1',
  provider: 'fallback',
  modelId: 'fallback-model',
  defaultObjectGenerationMode: models[0]?.defaultObjectGenerationMode || 'json',
  doGenerate: async (options) => {
    let lastError;
    for (const model of models) {
      try {
        return await model.doGenerate(options);
      } catch (error) {
        lastError = error;
        logError("model_fallback_error", { model: model.modelId, error: error.message });
      }
    }
    throw lastError;
  },
  doStream: async (options) => {
    let lastError;
    for (const model of models) {
      try {
        return await model.doStream(options);
      } catch (error) {
        lastError = error;
        logError("model_fallback_stream_error", { model: model.modelId, error: error.message });
      }
    }
    throw lastError;
  }
});
export async function POST(req) {
  try {
    const ip = getClientIp(req);
    const limitCheck = await rateLimit({
      key: `chat:${ip}`,
      limit: 20,
      windowMs: 60_000,
    });

    if (!limitCheck.ok) {
      return NextResponse.json(
        { error: "Terlalu banyak permintaan. Silakan coba lagi nanti." },
        { status: 429 },
      );
    }

    const { messages, system_injection } = await req.json();

    const finalSystemPrompt = system_injection
      ? `${SYSTEM_PROMPT}\n\n===========================\nINFO TAMBAHAN (DARI PTSP):\n===========================\n${system_injection}`
      : SYSTEM_PROMPT;

    // Inisialisasi Provider AI
    const google = process.env.GEMINI_API_KEY ? createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY }) : null;
    const groq = process.env.GROQ_API_KEY ? createOpenAI({ baseURL: "https://api.groq.com/openai/v1", apiKey: process.env.GROQ_API_KEY }) : null;
    const mistral = process.env.MISTRAL_API_KEY ? createOpenAI({ baseURL: "https://api.mistral.ai/v1", apiKey: process.env.MISTRAL_API_KEY }) : null;
    const openrouter = process.env.OPENROUTER_API_KEY ? createOpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY }) : null;

    if (!google && !groq && !mistral && !openrouter) {
      return NextResponse.json(
        { error: "Tidak ada API Key AI yang terkonfigurasi." },
        { status: 500 },
      );
    }

    // Urutan model fallback: Gemini -> Groq -> Mistral -> OpenRouter
    const fallbackModels = [];
    if (google) fallbackModels.push(google("gemini-1.5-flash"));
    if (groq) fallbackModels.push(groq("llama-3.3-70b-versatile"));
    if (mistral) fallbackModels.push(mistral("mistral-large-latest"));
    if (openrouter) fallbackModels.push(openrouter("meta-llama/llama-3.1-70b-instruct:free"));

    logInfo("chat_engine_try", { engineName: "AI Router with Fallback (Gemini/Groq/Mistral/OR)" });

    const result = streamText({
      model: fallback(fallbackModels),
      system: finalSystemPrompt,
      messages,
      maxTokens: 800,
      temperature: 0.7,
      tools: {
        searchPublicKnowledge: tool({
          description: "Mencari informasi, berita, atau layanan publik Kemenag dari knowledge base database website.",
          parameters: z.object({
            query: z.string().describe("Kata kunci pencarian, misalnya 'Syarat layanan Haji' atau 'Berita terbaru kakanwil'"),
          }),
          execute: async ({ query }) => {
            try {
              // Create embedding for the query using Gemini embedding model
              const embeddingModel = google.textEmbeddingModel("text-embedding-004");
              const { embedding } = await embeddingModel.doEmbed({ values: [query] });

              // Perform vector similarity search in the database
              const similarity = sql`1 - (${cosineDistance(
                ai_knowledge_base.embedding,
                embedding[0]
              )})`;
              const results = await db
                .select({
                  title: ai_knowledge_base.title,
                  content_summary: ai_knowledge_base.content_summary,
                  source_url: ai_knowledge_base.source_url,
                  similarity,
                })
                .from(ai_knowledge_base)
                .where(gt(similarity, 0.5))
                .orderBy((t) => desc(t.similarity))
                .limit(4);

              return results;
            } catch (error) {
              logError("rag_search_error", { error: error.message });
              return { error: "Gagal mencari informasi di database" };
            }
          },
        }),
        showLocationMap: tool({
          description: "Menampilkan peta lokasi kantor Kemenag Barito Utara ke pengguna. Panggil fungsi ini jika pengguna bertanya tentang lokasi atau alamat kantor.",
          parameters: z.object({}),
          execute: async () => {
            return {
              address: "Jl. Tumenggung Surapati No. 89, Melayu, Kec. Teweh Tengah, Kabupaten Barito Utara, Kalimantan Tengah 73814",
              component: "LocationMap" // Di-handle oleh frontend
            };
          }
        }),
        showServiceList: tool({
          description: "Menampilkan daftar layanan PTSP Kemenag Barito Utara dalam bentuk interaktif. Panggil fungsi ini jika pengguna ingin mendaftar layanan atau bertanya jenis layanan apa saja yang tersedia.",
          parameters: z.object({}),
          execute: async () => {
            return {
              component: "PTSPServiceList",
              url: "https://survei.kemenag-baritoutara.com" 
            };
          }
        })
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    logError("chat_api_error", { error: error?.message });
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
