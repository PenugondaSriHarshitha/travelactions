// server.js
import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve React build (dist folder)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

// --- API ROUTE ---
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/support-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    res.json({ reply: completion.choices[0].message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OpenAI error" });
  }
});

// Fallback for React Router (SPA)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
