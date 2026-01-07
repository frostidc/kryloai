import { GoogleGenAI } from "@google/genai";
import { Message, AppMode } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // Changed to an async generator to stream response text
  async *generateResponseStream(
    history: Message[], 
    currentMode: AppMode,
    image?: string
  ): AsyncGenerator<string, void, unknown> {
    
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
          yield "System Error (404): Neural model unreachable. Check API Configuration.";
      } else {
          yield `Error: ${error.message || "Connection voided."}`;
      }
    }
  }
}