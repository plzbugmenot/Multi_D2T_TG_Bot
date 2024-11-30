import { discordClient_1, discordClient_2, telegramBot } from "..";
import {
  CHANNEL_ID,
  statusMap,
  USER_TOKEN_1,
  USER_TOKEN_2,
} from "../src/config/config";
import { ErrorCode } from "./error.handle";
import logger from "./logger";

export const messageForwarder = async (message: any, USERNAME: string) => {
  try {
    const MsgType = message.guildId
      ? `${message.guild?.name} >> ${message.channel.name}`
      : "DM";

    if (MsgType !== "DM") {
      // if you want to forward only DMs
      return;
    }
    if (USERNAME === message.author.username) return;
    // 📜 ${MsgType} -> ${USERNAME}
    const forwardMessage = `
📜 ${USERNAME}
From: ${message.author.globalName} ( ${message.author.username} )

${message.content}
    `;

    const bot = telegramBot();
    try {
      await bot.sendMessage(CHANNEL_ID, forwardMessage);
    } catch (error) {
      logger.error(ErrorCode.MESSAGE_FORWARD, error);
    }

    if (message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        try {
          await bot.sendDocument(CHANNEL_ID, attachment.url);
        } catch (error) {
          logger.error(ErrorCode.MESSAGE_FORWARD_ATTACHMENT, error);
        }
      }
    }
  } catch (error) {
    logger.error(ErrorCode.PROCESSING_MESSAGE, error);
  }
};

export const startDiscordClient = async (Number: number) => {
  const discordClient = Number === 1 ? discordClient_1 : discordClient_2;
  const DISCORD_USER_TOKEN = Number === 1 ? USER_TOKEN_1 : USER_TOKEN_2;
  try {
    console.log(`Starting Discord client ${Number}... `);
    await discordClient.login(DISCORD_USER_TOKEN);
    logger.info(`🤖 Discord client ${Number} started successfully`);
    if (Number === 2) console.log("✨ All Discord clients are running...");
  } catch (err: any) {
    logger.error(ErrorCode.DISCORD_AUTH_FAILED, err);
    process.exit(1);
  }
};

export const normalizeString = (str: string) => {
  return str
    .replace(/\s+/g, " ") // Convert multiple spaces to single space
    .replace(/\n+/g, "\n") // Normalize newlines
    .trim(); // Remove leading/trailing whitespace
};

export const getStatusEmoji = (isActive: boolean): string =>
  isActive ? "✅" : "❌";

type ValidStatusKeys = "0" | "1" | "2" | "3";

export function isValidStatus(status: string): status is ValidStatusKeys {
  return status in statusMap;
}
