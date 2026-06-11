import "dotenv/config";
import express from "express";
import cors from "cors";
import { transcribeAudio, analyzeMeeting } from "./services/ai.js";
import { createCheckoutSession, handleWebhook } from "./services/stripe.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/webhook", express.raw({ type: "application/json" }));

app.post("/transcribe", async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) return res.status(400).json({ error: "Brak audioUrl" });
    
    const transcription = await transcribeAudio(audioUrl);
    const summary = await analyzeMeeting(transcription);
    
    res.json({ transcription, summary });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

app.post("/create-checkout-session", createCheckoutSession);
app.post("/webhook", handleWebhook);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API listening on port ${PORT}`));