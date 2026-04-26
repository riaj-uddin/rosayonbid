import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
  if (!aiInstance) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is missing. AI features will be limited.");
      return null;
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
};

// Local cache to prevent redundant calls for same prompt
const promptCache = new Map<string, string>();

/**
 * Executes an AI call with exponential backoff for rate limits.
 */
async function fetchWithRetry(prompt: string, retries = 3, delay = 1000): Promise<string> {
  const ai = getAI();
  if (!ai) return "AI services are currently offline. Please check your configuration.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "No explanation could be generated for this science query.";
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    
    if (isRateLimit && retries > 0) {
      console.warn(`Gemini Rate Limit (429). Retrying in ${delay}ms... (${retries} attempts left)`);
      await new Promise(res => setTimeout(res, delay));
      return fetchWithRetry(prompt, retries - 1, delay * 2);
    }

    if (isRateLimit) {
      return "The scientific knowledge base is currently busy (Rate Limit Exceeded). Please try again in 1 minute.";
    }

    console.error("Gemini API Error:", error);
    throw error;
  }
}

export const geminiService = {
  generateExplanation: async (prompt: string): Promise<string> => {
    // Check cache first
    const cached = promptCache.get(prompt);
    if (cached) {
      console.log("Serving explanation from cache...");
      return cached;
    }

    try {
      const response = await fetchWithRetry(prompt);
      // Cache the successful response
      promptCache.set(prompt, response);
      return response;
    } catch (error) {
      return "An error occurred while connecting to the scientific knowledge base. System core might be overwhelmed.";
    }
  }
};
