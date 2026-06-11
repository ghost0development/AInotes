import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY || "YOUR_HF_API_KEY";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY";

async function transcribeAudio(audioUrl) {
  const r = await axios.post("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {inputs: audioUrl}, {headers: {Authorization: `Bearer ${HF_API_KEY}`}});
  return r.data.text || "Błąd";
}

async function analyzeMeeting(t) {
  const r = await axios.post("https://api.groq.ai/openai/v1/chat/completions", {
    model: "llama-3.1-8b-instant", messages: [{role: "system", content: "Stwórz podsumowanie w stylu WhatsApp: Budżet, Termin, Status, Następny krok."}, {role: "user", content: t}], max_tokens: 200
  }, {headers: {Authorization: `Bearer ${GROQ_API_KEY}`}});
  return r.data.choices[0]?.message?.content || "Błąd";
}

app.post("/transcribe", async (req, res) => {
  const { audioUrl } = req.body;
  if (!audioUrl) return res.status(400).json({ error: "Brak audioUrl" });
  const t = await transcribeAudio(audioUrl);
  const s = await analyzeMeeting(t);
  res.json({ transcription: t, summary: s });
});

app.listen(process.env.PORT || 3001, () => console.log("API ready on port " + (process.env.PORT || 3001)));
