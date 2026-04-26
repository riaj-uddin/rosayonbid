import { Router } from 'express';
import { GoogleGenAI } from "@google/genai";

const router = Router();
const apiKey = process.env.GEMINI_API_KEY as string;
const genAI = new GoogleGenAI({ apiKey });

router.post('/explain', async (req, res) => {
  try {
    const { concept } = req.body;
    if (!concept) return res.status(400).json({ error: 'No concept provided' });

    const response = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `Explain this scientific concept highly technically but clearly: ${concept}`
    });
    
    res.json({ explanation: response.text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'AI processing failed' });
  }
});

export default router;
