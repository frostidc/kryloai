import { GoogleGenAI } from "@google/genai";
import { Message, AppMode } from '../types';

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private hasKey: boolean = false;

  constructor() {
    // UPDATED: Now looks for GEMINI_API
    const key = process.env.GEMINI_API;
    if (key && key.length > 0) {
        this.ai = new GoogleGenAI({ apiKey: key });
        this.hasKey = true;
    } else {
        console.warn("GEMINI_API not found in environment variables.");
        this.hasKey = false;
    }
  }

  // Changed to an async generator to stream response text
  async *generateResponseStream(
    history: Message[], 
    currentMode: AppMode,
    image?: string
  ): AsyncGenerator<string, void, unknown> {
    
    if (!this.hasKey || !this.ai) {
        yield "System Critical: GEMINI_API is missing.\n\nIf you are seeing this on a deployed site (Vercel/Netlify), you must go to your Project Settings > Environment Variables and add a key named 'GEMINI_API'.";
        return;
    }

    // Select model based on mode
    let modelName = 'gemini-2.5-flash-latest'; // Robust default
    let systemInstruction = "You are Krylo, a high-intelligence AI assistant. Be concise, futuristic, and helpful.";

    if (currentMode === 'DEV') {
      modelName = 'gemini-3-pro-preview';
      systemInstruction = "You are Krylo Dev, an elite coding architect. Provide clean, optimized, and modern code. Use TypeScript and Tailwind by default. Enclose all code in markdown code blocks.";
    } else if (currentMode === 'ACADEMY') {
      modelName = 'gemini-3-flash-preview';
      systemInstruction = "You are Krylo Academy, a patient and structured tutor. Break down concepts into digestible parts.";
    } else if (currentMode === 'VISION') {
        modelName = 'gemini-3-pro-preview'; // Vision capabilities
    } else if (currentMode === 'IMAGINE') {
        modelName = 'gemini-3-flash-preview';
        systemInstruction = "You are Krylo Imagine. Help the user prompt for creative visual ideas. (Note: Image generation not currently connected, provide descriptive text prompts).";
    }

    try {
        const lastUserMessage = history[history.length - 1];
        
        let contents: any;

        if (image) {
            const imagePart = {
                inlineData: {
                    mimeType: 'image/png', 
                    data: image.split(',')[1] 
                }
            };
            const textPart = {
                text: lastUserMessage.content || "Analyze this image."
            };
            contents = { parts: [imagePart, textPart] };
        } else {
             contents = lastUserMessage.content;
        }

        // Use generateContentStream
        const responseStream = await this.ai.models.generateContentStream({
            model: modelName,
            contents: contents,
            config: { systemInstruction: systemInstruction }
        });

        for await (const chunk of responseStream) {
            const text = chunk.text;
            if (text) {
                yield text;
            }
        }

    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes("404") || error.message?.includes("not found")) {
          yield "System Error (404): Neural model unreachable. The API Key may be valid, but the project might not have access to 'gemini-3-pro-preview'. Check Google Cloud Console.";
      } else if (error.message?.includes("403")) {
          yield "Access Denied (403): Your GEMINI_API key is invalid or has expired. Please update it in your hosting provider's Environment Variables.";
      } else {
          yield `Error: ${error.message || "Connection voided."}`;
      }
    }
  }
}
