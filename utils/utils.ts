import { discordClient_1, discordClient_2, telegramBot } from "..";
import { CHANNEL_ID, USER_TOKEN_1, USER_TOKEN_2 } from "./config";
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
    const forwardMessage = `
📜 ${MsgType} -> ${USERNAME}
From: ${message.author.globalName} ( ${message.author.username} )

${message.content}
    `;

    await telegramBot.sendMessage(CHANNEL_ID, forwardMessage);

    if (message.attachments.size > 0) {
      for (const [_, attachment] of message.attachments) {
        await telegramBot.sendDocument(CHANNEL_ID, attachment.url);
      }
    }
  } catch (error) {
    logger.error(`Error processing message: ${error}`);
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
    logger.error("Error starting Discord client:", err);
    process.exit(1);
  }
};
