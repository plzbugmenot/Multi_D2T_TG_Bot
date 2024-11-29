import { Client } from "discord.js-selfbot-v13";
import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";
import {
  BOT_TOKEN,
} from "./utils/config";
import { messageForwarder, startDiscordClient } from "./utils/utils";

// Access environment variables
const TELEGRAM_BOT_TOKEN = BOT_TOKEN;

// Initialize clients
export const discordClient_1 = new Client();
export const discordClient_2 = new Client();
export const telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: false });

let USERNAME_1 = "";
let USERNAME_2 = "";

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
