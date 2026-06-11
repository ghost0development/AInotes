import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY || "YOUR_HF_API_KEY";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY";

export async function transcribeAudio(audioUrl) {
  const response = await axios.post(
    "https://api-inference.huggingface.co/models/openai/whisper-large-v3",
    { inputs: audioUrl },
    {
      headers: { Authorization: `Bearer ${HF_API_KEY}` },
    }
  );
  return response.data.text || "Transkrypcja failed";
}

export async function analyzeMeeting(transcription) {
  const response = await axios.post(
    "https://api.groq.ai/openai/v1/chat/completions",
    {
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Stwórz krótkie podsumowanie w stylu WhatsApp dla pośrednika nieruchomości: Budżet, Termin, Status, Następny krok.",
        },
        { role: "user", content: transcription },
      ],
      max_tokens: 200,
    },
    {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    }
  );
  return response.data.choices[0]?.message?.content || "Analiza failed";
}