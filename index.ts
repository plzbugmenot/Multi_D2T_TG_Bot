import { Client } from "discord.js-selfbot-v13";
import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";
import {
  BOT_TOKEN,
  BotMenu,
  statusMap,
  strInvalidValue,
  strNotAllowFile,
  strPlzSet,
} from "./src/config/config";
import {
  getStatusEmoji,
  isValidStatus,
  messageForwarder,
  normalizeString,
  startDiscordClient,
} from "./utils/utils";
import { SetAction } from "./src/telegrambot/action.set";
import { StatusAction } from "./src/telegrambot/action.status";
import { HelpAction } from "./src/telegrambot/action.help";
import { ErrorCode } from "./utils/error.handle";

// Access environment variables
const TELEGRAM_BOT_TOKEN = BOT_TOKEN;

// Initialize clients
export const discordClient_1 = new Client();
export const discordClient_2 = new Client();
let bot: any;
export const telegramBot: any = () => bot;

let USERNAME_1 = "";
let USERNAME_2 = "";

export const getUserName = (num: number) => {
  if (num === 1) return USERNAME_1;
  else return USERNAME_2;
};

// Start Telegram bot

let MonitorUSER_1 = true;
let MonitorUSER_2 = true;

export const setMonitorUser = (num: number, value: boolean) => {
  if (num === 1) MonitorUSER_1 = value;
  else MonitorUSER_2 = value;
};

export const getMonitorUser = (num: number) => {
  if (num === 1) return MonitorUSER_1;
  else return MonitorUSER_2;
};

const TelegramBotStart = async () => {
  if (!TELEGRAM_BOT_TOKEN) {
    logger.error(ErrorCode.BOT_TOKEN_NOT_FOUND);
    return;
  }
  try {
    bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });
    bot.setMyCommands(BotMenu);

    bot.on("message", async (msg: any) => {
      if (msg.reply_to_message) {
        // Extract Discord user info from the original forwarded message
        const originalMsg = msg.reply_to_message.text;
        const replyMsg = msg.text;
        const channelId = msg.chat.id;

        const pattern = /📜 ([\w_]+)[\s\S]*?\( ?([\w_]+) ?\)/;
        const matches = originalMsg.match(pattern);
        if (normalizeString(originalMsg) === normalizeString(strPlzSet)) {
          if (isValidStatus(replyMsg)) {
            const status = statusMap[replyMsg];
            setMonitorUser(1, status.user1);
            setMonitorUser(2, status.user2);

            const emoji1 = getStatusEmoji(status.user1);
            const emoji2 = getStatusEmoji(status.user2);

            try {
              await bot.sendMessage(
                channelId,
                `🔔 Changed Status\n\n${emoji1} USER 1: ${USERNAME_1}\n${emoji2} USER 2: ${USERNAME_2}`
              );
            } catch (error) {
              logger.error(ErrorCode.MESSAGE_SET_ACTION, error);
            }
          } else {
            try {
              await bot.sendMessage(channelId, strInvalidValue);
            } catch (error) {
              logger.error(ErrorCode.MESSAGE_INVALID_VALUE, error);
            }
          }
        }

        // Extract both usernames
        else if (matches) {
          const clientUsername = matches[1];
          const senderUsername = matches[2];
          const discordClient =
            clientUsername === USERNAME_1 ? discordClient_1 : discordClient_2;

          if (!MonitorUSER_1 && clientUsername === USERNAME_1) return;
          if (!MonitorUSER_2 && clientUsername === USERNAME_2) return;

          const user = await discordClient.users.cache.find(
            (user: any) => user.username === senderUsername
          );

          try {
            if (!replyMsg) bot.sendMessage(channelId, strNotAllowFile);
            else if (user) {
              await user.send(replyMsg);
            }
  
          } catch (error) {
            logger.error(ErrorCode.MESSAGE_NOT_ALLOW_FILE, error)            
          }
        } else {
          try {
            await bot.sendMessage(channelId, strInvalidValue);

          } catch (error) {
            logger.error(ErrorCode.MESSAGE_SEND_FAILED, error)            
          }
        }
      }
    });

    bot.onText(/\/start/, async (msg: any) => {
      // const chatId = msg.chat.id;
      // console.log("start cmd");
    });

    bot.onText(/\/set/, async (msg: any) => {
      SetAction(msg, bot);
    });

    bot.onText(/\/status/, async (msg: any) => {
      StatusAction(msg, bot);
    });

    bot.onText(/\/help/, async (msg: any) => {
      HelpAction(msg, bot);
    });

    logger.info("📳 Telegram Bot started successfully");
  } catch (error) {
    logger.error(ErrorCode.BOT_STARTUP_FAILED, error);
  }
};

// Discord event handlers
discordClient_1.on("ready", () => {
  // logger.info(`Logged in as ${discordClient_1.user?.tag}`);
  USERNAME_1 = discordClient_1.user?.tag || "";
});

discordClient_1.on("messageCreate", async (message: any) => {
  if (MonitorUSER_1) messageForwarder(message, USERNAME_1);
});

discordClient_2.on("ready", () => {
  // logger.info(`Logged in as ${discordClient_2.user?.tag}`);
  USERNAME_2 = discordClient_2.user?.tag || "A";
});

discordClient_2.on("messageCreate", async (message: any) => {
  if (MonitorUSER_2) messageForwarder(message, USERNAME_2);
});

async function main() {
  logger.info(">---------- Starting bot ------>>>>", Date.now());
  try {
    await TelegramBotStart();
    await startDiscordClient(1);
    await startDiscordClient(2);

    process.on("uncaughtException", (error) => {
      logger.error(ErrorCode.UNCAUGHTEXCEPTION, error);
    });

    process.on("unhandledRejection", (error) => {
      logger.error(ErrorCode.UNHANDLEDREJECTION, error);
    });
  } catch (error) {
    logger.error(ErrorCode.ERRORINMAIN, error);
    process.exit(1);
  }
}

main();
