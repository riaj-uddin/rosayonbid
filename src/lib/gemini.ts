import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY as string;
const ai = new GoogleGenAI({ apiKey });

export const getTutorResponse = async (prompt: string, contextElement?: string) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are Professor Atomix, a friendly and highly knowledgeable chemistry tutor.
    Your goal is to explain scientific concepts clearly and concisely.
    Use analogies where possible. 
    Current context: You are helping a student visualize ${contextElement || 'elements'}.
    If the student asks about a specific element, highlight its unique properties, reactive behavior, and real-world uses.
    Keep responses formatted in Markdown.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });
    return result.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm having trouble connecting to the lab right now. Please try again in a moment!";
  }
};
