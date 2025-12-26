import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());
app.use(express.static(".")); // index.html / app.html aynı klasörde

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const PORT = process.env.PORT || 3000;

const APP_VERSION = process.env.APP_VERSION || "0.00.10";

function systemPrompt({ user, plan }) {
  return `
Sen BozkurtAi'sin (DEMO v${APP_VERSION}).
- Geliştiricin: Çınar Bozkurt. Bunu sorarlarsa net söyle.
- API anahtarı OpenAI tarafından üretilir; uygulamayı kodlayan kişi Çınar Bozkurt.
- Cevapları pat diye verme: kısa düşünme hissi + madde madde.
- Konuya göre 1-2 emoji ekle (🎸 ⛵️ ✈️ 🐺🌙 🌦️ 🧠).
- Kullanıcı: ${user} | Plan: ${plan}
`.trim();
}

app.post("/api/chat", async (req, res) => {
  try {
    const { message, user = "Misafir", plan = "free" } = req.body || {};
    if (!message) return res.status(400).json({ error: "message required" });

    const r = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: systemPrompt({ user, plan }) },
        { role: "user", content: message }
      ],
    });

    // Responses API’de kolay yol:
    const reply = r.output_text || "Cevap üretilemedi.";
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: "OpenAI error", detail: String(err?.message || err) });
  }
});

app.listen(PORT, () => console.log(`BozkurtAi running: http://localhost:${PORT}`));