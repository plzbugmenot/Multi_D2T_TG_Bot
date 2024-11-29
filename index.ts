import { Client } from "discord.js-selfbot-v13";
import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";
import { BOT_TOKEN, BotMenu } from "./utils/config";
import { messageForwarder, startDiscordClient } from "./utils/utils";

// Access environment variables
const TELEGRAM_BOT_TOKEN = BOT_TOKEN;

// Initialize clients
export const discordClient_1 = new Client();
export const discordClient_2 = new Client();
let bot: any;
export const telegramBot: any = () => bot;

let USERNAME_1 = "";
let USERNAME_2 = "";

// Start Telegram bot

const TelegramBotStart = async () => {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    bot.setMyCommands(BotMenu);

    bot.on("message", async (msg: any) => {
      if (msg.reply_to_message) {
        // Extract Discord user info from the original forwarded message
        const originalMsg = msg.reply_to_message.text;
        const replyMsg = msg.text;
        // Extract both usernames
        const pattern = /📜 ([\w_]+)[\s\S]*?\( ?([\w_]+) ?\)/;
        const matches = originalMsg.match(pattern);

        if (matches) {
          const clientUsername = matches[1]; // _neversmile_
          const senderUsername = matches[2]; // forever_774
          console.log("clientUsername:", clientUsername);
          console.log("senderUsername:", senderUsername);
          const discordClient =
            clientUsername === USERNAME_1 ? discordClient_1 : discordClient_2;
          const user = await discordClient.users.cache.find(
            (user: any) => user.username === senderUsername
          );
          if (user) {
            await user.send(replyMsg);
          }
        }
      }
    });

    bot.onText(/\/start/, async (msg: any) => {
      const chatId = msg.chat.id;
      console.log("start cmd");
    });
    console.log("Bot is running...");
  } catch (error) {
    console.log("Bot is running error");
  }
};

// Discord event handlers
discordClient_1.on("ready", () => {
  logger.info(`Logged in as ${discordClient_1.user?.tag}`);
  console.log(`Logged in as ${discordClient_1.user?.tag}`);
  USERNAME_1 = discordClient_1.user?.tag || "";
});

discordClient_1.on("messageCreate", async (message: any) => {
  messageForwarder(message, USERNAME_1);
});

discordClient_2.on("ready", () => {
  logger.info(`Logged in as ${discordClient_2.user?.tag}`);
  console.log(`Logged in as ${discordClient_2.user?.tag}`);
  USERNAME_2 = discordClient_2.user?.tag || "";
});

discordClient_2.on("messageCreate", async (message: any) => {
  messageForwarder(message, USERNAME_2);
});

async function main() {
  console.log(">---------->>> Starting bot...", Date.now());
  try {
    await TelegramBotStart();
    await startDiscordClient(1);
    await startDiscordClient(2);

    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error);
    });

    process.on("unhandledRejection", (error) => {
      logger.error("Unhandled Rejection:", error);
    });
  } catch (error) {
    logger.error("Error in main:", error);
    process.exit(1);
  }
}

main();
