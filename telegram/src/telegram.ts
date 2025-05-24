import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import env from "./env";
import { processMessage } from "./agent";

const bot = new Telegraf(env.TELEGRAM_API_TOKEN);

bot.start((ctx) => {
    ctx.reply("Welcome! I am your bot. How can I assist you today?");
});

bot.on(message("text"), (ctx) => {
    const userMessage = ctx.message.text;
    const response = processMessage(userMessage);
    if (response.kind === "wrapup") {
        void ctx.sendPoll("Safi salina, wla mazal baghi tzid shi 7aja?", ["Safi hadshi li kayn", "La mazal"], {
            
        });
    } else {
        void ctx.reply(response.message);
    }
});

bot.

export function startBot() {
    bot.launch().catch((error) => {
        console.error("Failed to launch the bot:", error);
    });
}



