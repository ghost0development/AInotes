import "dotenv/config";
import express from "express";
import cors from "cors";
import { transcribeAudio, analyzeMeeting } from "./api/services/ai.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/transcribe", async (req, res) => {
  const { audioUrl } = req.body;
  if (!audioUrl) return res.status(400).json({ error: "Brak audioUrl" });
  const t = await transcribeAudio(audioUrl);
  const s = await analyzeMeeting(t);
  res.json({ transcription: t, summary: s });
});

app.listen(process.env.PORT || 3001, () => console.log("API ready"));
