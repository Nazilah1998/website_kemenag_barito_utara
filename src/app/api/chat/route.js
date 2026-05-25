import { NextResponse } from "next/server";
import SYSTEM_PROMPT from "@/lib/chat/system-prompt";
import ENGINES from "@/lib/chat/engines";

export async function POST(req) {
  try {
    const { messages, system_injection } = await req.json();

    const finalSystemPrompt = system_injection
      ? `${SYSTEM_PROMPT}\n\n===========================\nINFO TAMBAHAN (DARI PTSP):\n===========================\n${system_injection}`
      : SYSTEM_PROMPT;

    // API Keys from environment
    const keys = {
      gemini: process.env.GEMINI_API_KEY,
      groq: process.env.GROQ_API_KEY,
      mistral: process.env.MISTRAL_API_KEY,
      openrouter: process.env.OPENROUTER_API_KEY,
    };

    if (!Object.values(keys).some((k) => !!k)) {
      return NextResponse.json(
        { error: "Tidak ada API Key yang terkonfigurasi." },
        { status: 500 },
      );
    }

    // Persiapkan data pesan
    const recentMessages = messages.slice(1); // skip greeting awal
    const lastSix = recentMessages.slice(-6);

    // Gunakan ENGINES dari file terpisah (src/lib/chat/engines.js)

    let lastErrorMessage = "";
    const startTime = Date.now();

    // ─── LOOP FALLBACK ENGINE ────────────────────────────────
    for (const engine of ENGINES) {
      // Safety check: Jika sudah berjalan lebih dari 8 detik, hentikan loop
      // untuk menghindari Vercel timeout (biasanya 10 detik)
      if (Date.now() - startTime > 8000) {
        console.warn(
          "⚠️ Waktu hampir habis, menghentikan pencarian engine cadangan.",
        );
        break;
      }

      const key = keys[engine.provider];
      if (!key) continue;

      try {
        console.log(`🛡️ Mencoba Lapis ${engine.id}: ${engine.name}...`);

        let response;
        let aiText = "";

        if (engine.provider === "gemini") {
          // Format Gemini
          const contents = [
            {
              role: "user",
              parts: [
                {
                  text: `Sistem: ${finalSystemPrompt}\n\nPahami instruksi. Jawab "Siap".`,
                },
              ],
            },
            {
              role: "model",
              parts: [{ text: "Siap, saya Kemenag Barut Assistant." }],
            },
            ...lastSix.map((m) => ({
              role: m.role === "user" ? "user" : "model",
              parts: [{ text: m.content }],
            })),
          ];

          response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${engine.model}:generateContent?key=${key}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents,
                generationConfig: { temperature: 0.7, maxOutputTokens: 400 },
              }),
            },
          );

          const data = await response.json();
          if (data.error)
            throw new Error(data.error.message || `Error ${data.error.code}`);
          aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          // Format OpenAI Compatible (Groq, Mistral, OpenRouter)
          let url = "";
          if (engine.provider === "groq")
            url = "https://api.groq.com/openai/v1/chat/completions";
          else if (engine.provider === "mistral")
            url = "https://api.mistral.ai/v1/chat/completions";
          else if (engine.provider === "openrouter")
            url = "https://openrouter.ai/api/v1/chat/completions";

          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${key}`,
              ...(engine.provider === "openrouter" && {
                "HTTP-Referer": "https://baritoutara.kemenag.go.id",
                "X-Title": "Kemenag Barut AI",
              }),
            },
            body: JSON.stringify({
              model: engine.model,
              messages: [
                { role: "system", content: finalSystemPrompt },
                ...lastSix.map((m) => ({
                  role: m.role === "user" ? "user" : "assistant",
                  content: m.content,
                })),
              ],
              temperature: 0.7,
              max_tokens: 400,
            }),
          });

          const data = await response.json();
          if (!response.ok)
            throw new Error(data.error?.message || `HTTP ${response.status}`);
          aiText = data.choices?.[0]?.message?.content;
        }

        if (aiText) {
          console.log(`✅ Lapis ${engine.id} BERHASIL (${engine.name})`);
          return NextResponse.json({ content: aiText });
        }
      } catch (err) {
        console.warn(`⚠️ Lapis ${engine.id} GAGAL: ${err.message}`);
        lastErrorMessage = err.message;
        // Lanjut ke lapis berikutnya...
      }
    }

    // Jika semua engine gagal
    return NextResponse.json(
      {
        error:
          "Seluruh engine AI sedang sibuk. Mohon tunggu 1 menit lalu coba lagi ya! 🙏",
      },
      { status: 429 },
    );
  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}
