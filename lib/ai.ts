import axios from "axios";

const HF_API_KEY = process.env.HF_API_KEY || "your-hf-key";
const GROQ_API_KEY = process.env.GROQ_API_KEY || "your-groq-key";

export async function transcribeAudio(audioUrl: string): Promise<string> {
  const response = await fetch("https://api-inference.huggingface.co/models/openai/whisper-large-v3", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: audioUrl }),
  });
  
  const data = await response.json();
  return data.text || "Transkrypcja niepowodzone";
}

export async function analyzeMeeting(transcription: string): Promise<string> {
  const response = await fetch("https://api.groq.ai/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Stwórz krótkie podsumowanie w stylu WhatsApp dla pośrednika nieruchomości na podstawie transkrypcji.",
        },
        {
          role: "user",
          content: transcription,
        },
      ],
      max_tokens: 200,
    }),
  });
  
  const data = await response.json();
  return data.choices[0]?.message?.content || " Analiza niepowodzona";
}