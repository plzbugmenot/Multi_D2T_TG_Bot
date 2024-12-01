import { discordClient_1, discordClient_2, getMonitorUser, telegramBot } from "..";
import {
  CHANNEL_ID,
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

    if (MsgType !== "DM") return; // forward only DMs

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

interface DMUser {
  id: string;
  username: string;
  lastMessage?: string;
  lastMessageTime?: Date;
}
export const startDiscordClient = async (Number: number) => {
  const discordClient = Number === 1 ? discordClient_1 : discordClient_2;
  const DISCORD_USER_TOKEN = Number === 1 ? USER_TOKEN_1 : USER_TOKEN_2;
  try {
    console.log(`Starting Discord client ${Number}... `);
    await discordClient.login(DISCORD_USER_TOKEN);

    // const relationships = discordClient.relationships.friendCache;
    // for (const item of relationships) console.log("Channel:", item);
    // const dmUsers: DMUser[] = dmChannels.map(
    //   (channel) => (
    //     console.log("Channel:", channel),
    //     {
    //       id: channel.recipient?.id || "",
    //       username: channel.recipient?.username || "",
    //       lastMessage: channel.lastMessage?.content,
    //       lastMessageTime: channel.lastMessage?.createdAt,
    //     }
    //   )
    // );

    // console.log("Your DM Users:", dmUsers);

    logger.info(`🤖 Discord client ${Number} started successfully`);
    if (Number === 2) console.log("✨ All Discord clients are running...");
  } catch (err: any) {
    logger.error(ErrorCode.DISCORD_AUTH_FAILED, err);
    process.exit(1);
  }
};


export const getButtonText = (num: number) => {
  const btnstate = getMonitorUser(num);
  const emoji = btnstate ? "✅" : "❌";
  return `USER ${num}: ${emoji}`;
};
