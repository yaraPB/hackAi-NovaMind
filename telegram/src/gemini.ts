import { GoogleGenAI } from "@google/genai";
import env from "./env";


export const geminiClient = new GoogleGenAI({ apiKey: env.GEMINI_API_TOKEN });

