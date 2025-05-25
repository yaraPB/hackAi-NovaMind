import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import env from "./env";
import { processMessage } from "./agent";
import { recognizeImage } from "./imrecg";
import axios from "axios";
import { transcribeAudio } from "./transcriber";
import { sessionSendMessage } from "./session";


const bot = new Telegraf(env.TELEGRAM_API_TOKEN);

bot.start((ctx) => {
    ctx.reply("Welcome! I am your bot. How can I assist you today?");
});

bot.on(message("text"), (ctx) => {
    async function handle() {
        const userMessage = ctx.message.text;
        const response = await sessionSendMessage(ctx.chat.id.toString(), userMessage);
        if (response.kind === "wrapup") {
            const poll = await ctx.sendPoll("Safi salina, wla mazal baghi tzid shi 7aja?", ["Safi hadshi li kayn", "La mazal"]);
        } else {
            void ctx.reply(response.message);
        }
    }
    void handle();
});

bot.on(message("photo"), (ctx) => {
    async function handle() {
        const fileLink = await bot.telegram.getFileLink(ctx.message.photo[0].file_id);
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const answer = await recognizeImage(buffer, "image/jpeg");
        await ctx.reply(answer);
    }
    void handle();
});

bot.on(message("location"), (ctx) => {
    const location = ctx.message.location;
    const response = `Received your location: Latitude ${location.latitude}, Longitude ${location.longitude}`;
    void ctx.reply(response);
});

bot.on(message("voice"), (ctx) => {
    async function handle() {
        const fileLink = await bot.telegram.getFileLink(ctx.message.voice.file_id);
        const response = await axios.get(fileLink.href, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data);
        const transcription = await transcribeAudio(buffer, "audio/ogg");

        async function handle() {
            const userMessage = transcription;
            const response = await sessionSendMessage(ctx.chat.id.toString(), userMessage);
            if (response.kind === "wrapup") {
                const poll = await ctx.sendPoll("Safi salina, wla mazal baghi tzid shi 7aja?", ["Safi hadshi li kayn", "La mazal"]);
            } else {
                void ctx.reply(response.message);
            }
        }
        void handle();
    }
    void handle();
})

export function startBot() {
    bot.launch().catch((error) => {
        console.error("Failed to launch the bot:", error);
    });
}



