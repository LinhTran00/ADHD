const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const { authenticateToken } = require("./utilities");

const router = express.Router();

// The Gemini key lives only on the server, so it never reaches the browser.
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

// POST /ai/explain  { question: "..." }  ->  { text: "..." }
router.post("/explain", authenticateToken, async (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== "string" || question.length > 500) {
    return res.status(400).json({ error: true, message: "A short question is required" });
  }
  if (!ai) {
    return res.status(503).json({ error: true, message: "AI help is not configured" });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents:
        "I don't understand this question. Could you give me an example so I can visualize? " +
        "It should be short in 1 sentence. This is the question: " +
        question,
    });
    return res.json({ error: false, text: response.text });
  } catch (err) {
    console.error("Gemini error:", err);
    return res.status(502).json({ error: true, message: "Could not get an example right now" });
  }
});

module.exports = router;
