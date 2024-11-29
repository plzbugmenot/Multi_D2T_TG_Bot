import { Client } from "discord.js-selfbot-v13";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";

// Load environment variables
dotenv.config();

// Access environment variables
const DISCORD_USER_TOKEN_1 = process.env.DISCORD_USER_TOKEN_1;
const DISCORD_USER_TOKEN_2 = process.env.DISCORD_USER_TOKEN_2;
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || -1002340692403;

// Initialize clients
const discordClient_1 = new Client();
const discordClient_2 = new Client();
const telegramBot = new TelegramBot(TELEGRAM_BOT_TOKEN!, { polling: false });

let USERNAME_1 = "";
let USERNAME_2 = "";

// Discord event handlers
discordClient_1.on("ready", () => {
  logger.info(`Logged in as ${discordClient_1.user?.tag}`);
  console.log(`Logged in as ${discordClient_1.user?.tag}`);
  USERNAME_1 = discordClient_1.user?.tag || "";
});

discordClient_1.on("messageCreate", async (message: any) => {
  try {
    const MsgType = message.guildId
      ? `${message.guild?.name} >> ${message.channel.name}`
      : "DM";

    if (MsgType !== "DM") {
      // if you want to forward only DMs
      return;
    }
    const forwardMessage = `
📜 ${MsgType} -> ${USERNAME_1}
From: ${message.author.globalName} ( ${message.author.username} )

${message.content}
    `;

    await telegramBot.sendMessage(TELEGRAM_CHANNEL_ID, forwardMessage);

    if (message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        await telegramBot.sendDocument(TELEGRAM_CHANNEL_ID, attachment.url);
      }
    }
  } catch (error) {
    logger.error(`Error processing message: ${error}`);
  }
});

async function startDiscordClient_1() {
  try {
    console.log("Starting Discord client 1 ... ");
    await discordClient_1.login(DISCORD_USER_TOKEN_1);
    logger.info("🤖 Discord client 1 started successfully");
  } catch (err: any) {
    logger.error("Error starting Discord client:", err);
    process.exit(1);
  }
}

discordClient_2.on("ready", () => {
  logger.info(`Logged in as ${discordClient_2.user?.tag}`);
  console.log(`Logged in as ${discordClient_2.user?.tag}`);
  USERNAME_2 = discordClient_2.user?.tag || "";
});

discordClient_2.on("messageCreate", async (message: any) => {
  try {
    const MsgType = message.guildId
      ? `${message.guild?.name} >> ${message.channel.name}`
      : "DM";

    if (MsgType !== "DM") {
      // if you want to forward only DMs
      return;
    }
    const forwardMessage = `
📜 ${MsgType} -> ${USERNAME_2}
From: ${message.author.globalName} ( ${message.author.username} )

${message.content}
    `;

    await telegramBot.sendMessage(TELEGRAM_CHANNEL_ID, forwardMessage);

    if (message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        await telegramBot.sendDocument(TELEGRAM_CHANNEL_ID, attachment.url);
      }
    }
  } catch (error) {
    logger.error(`Error processing message: ${error}`);
  }
});

async function startDiscordClient_2() {
  try {
    console.log("Starting Discord client 2... ");
    await discordClient_2.login(DISCORD_USER_TOKEN_2);
    logger.info("🤖 Discord client 2 started successfully");
    console.log("✨ All Discord clients are running...");
  } catch (err: any) {
    logger.error("Error starting Discord client:", err);
    process.exit(1);
  }
}

async function main() {
  console.log(">---------->>> Starting bot...", Date.now());
  try {
    await startDiscordClient_1();
    await startDiscordClient_2();

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
