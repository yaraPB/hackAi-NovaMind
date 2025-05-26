import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import env from "./env";
import { processMessage } from "./agent";
import { recognizeImage } from "./imrecg";
import axios from "axios";
import { transcribeAudio } from "./transcriber";
import { attachImage, attachLocation, endSession, sessionSendMessage } from "./session";
import { response } from "express";
import { Answer } from "./chatbot";

const bot = new Telegraf(env.TELEGRAM_API_TOKEN);

async function handleAnswer(answer: Answer, chatId: string): Promise<string> {
    if (answer.kind === "wrapup") {
        await endSession(chatId);
        return answer.goodbye;
    } else {
        return answer.message
    }
}

bot.start((ctx) => {
    ctx.reply("Welcome! I am your bot. How can I assist you today?");
});

bot.on(message("text"), (ctx) => {
    async function handle() {
        const chatId = ctx.chat.id.toString();
        const answer = await sessionSendMessage(chatId, ctx.message.text);
        const botReponse = await handleAnswer(answer, chatId);
        await ctx.reply(botReponse);
    }
    void handle();
});

bot.on(message("photo"), (ctx) => {
    async function handle() {
        const fileLink = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const tags = await recognizeImage(buffer, "image/jpeg");
        const answer = await attachImage(ctx.chat.id.toString(), tags.tags, tags.description, fileLink.href)
        const botReponse = await handleAnswer(answer, ctx.chat.id.toString());
        await ctx.reply(botReponse);
    }
    void handle();
});

bot.on(message("location"), (ctx) => {
    async function handle() {
        const location = ctx.message.location;
        const answer = await attachLocation(ctx.chat.id.toString(), location.latitude, location.longitude)
        const botReponse = await handleAnswer(answer, ctx.chat.id.toString());
        await ctx.reply(botReponse);
    }
    void handle();
});

bot.on(message("voice"), (ctx) => {
    async function handle() {
        const fileLink = await bot.telegram.getFileLink(ctx.message.voice.file_id);
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const transcription = await transcribeAudio(buffer, "audio/ogg");

        const chatId = ctx.chat.id.toString();
        const answer = await sessionSendMessage(chatId, transcription);
        const botReponse = await handleAnswer(answer, chatId);
        await ctx.reply(botReponse);

        void handle();
    }
    void handle();
})

export function startBot() {
    bot.launch().catch((error) => {
        console.error("Failed to launch the bot:", error);
    });
}



