import { Chat } from "@google/genai"
import { geminiClient } from "./gemini";
import { Answer, newChat } from "./chatbot";

type Session = {
    id: string;
    chat: Chat;
    location?: {
        latitude: number;
        longitude: number;
    }
    image?: {
        tags: string[];
        description: string;
        link: string;
    }
}

const session = new Map<string, Session>();

function getOrCreateSession(userId: string): Session {
    if (session.has(userId)) {
        return session.get(userId)!;
    }

    const newSession: Session = {
        id: userId,
        chat: newChat(),
    };

    session.set(userId, newSession);
    return newSession;
}

export async function sessionSendMessage(userId: string, message: string): Promise<Answer> {
    const session = getOrCreateSession(userId);
    const response = await session.chat.sendMessage({ message });
    let responseText = response.text!;

    if(responseText.startsWith('`') || responseText.startsWith('```') || responseText.startsWith('```json')) {
        responseText = responseText.replace(/```json/g, '').replace(/```/g, '');

    }

    try {
        const responseJson: Answer = JSON.parse(responseText);
        return responseJson;
    } catch (error) {
        console.error("Failed to parse response:", responseText);
        throw new Error("Invalid response format");
    }
}

export function endSession(userId: string): void {
    if (session.has(userId)) {
        session.delete(userId);
    }
}
