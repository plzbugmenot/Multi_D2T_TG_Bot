import { Client } from "discord.js-selfbot-v13";
import TelegramBot from "node-telegram-bot-api";
import logger from "./utils/logger";
import {
  BOT_TOKEN,
  BotMenu,
  strInvalidValue,
  strPlzSet,
} from "./src/config/config";
import { messageForwarder, startDiscordClient } from "./utils/utils";
import { SetAction } from "./src/telegrambot/action.set";
import { StatusAction } from "./src/telegrambot/action.status";
import { HelpAction } from "./src/telegrambot/action.help";

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
  if (num === 1) {
    return USERNAME_1;
  } else {
    return USERNAME_2;
  }
};

// Start Telegram bot

let MonitorUSER_1 = true;
let MonitorUSER_2 = true;

export const setMonitorUser = (num: number, value: boolean) => {
  if (num === 1) {
    MonitorUSER_1 = value;
  } else {
    MonitorUSER_2 = value;
  }
};
export const getMonitorUser = (num: number) => {
  if (num === 1) {
    return MonitorUSER_1;
  } else {
    return MonitorUSER_2;
  }
};

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
        const channelId = msg.chat.id;

        if (originalMsg === strPlzSet) {
          switch (replyMsg) {
            case "0":
              setMonitorUser(1, false);
              setMonitorUser(2, false);
              bot.sendMessage(
                channelId,
                `🔔 Changed Status\n\n❌ USER 1: ${USERNAME_1}\n❌ USER 2: ${USERNAME_2}`
              );
              break;
            case "1":
              setMonitorUser(1, true);
              setMonitorUser(2, false);
              bot.sendMessage(
                channelId,
                `🔔 Changed Status\n\n✅ USER 1: ${USERNAME_1}\n❌ USER 2: ${USERNAME_2}`
              );
              break;
            case "2":
              setMonitorUser(1, false);
              setMonitorUser(2, true);
              bot.sendMessage(
                channelId,
                `🔔 Changed Status\n\n❌ USER 1: ${USERNAME_1}\n✅ USER 2: ${USERNAME_2}`
              );
              break;
            case "3":
              setMonitorUser(1, true);
              setMonitorUser(2, true);
              bot.sendMessage(
                channelId,
                `🔔 Changed Status\n\n✅ USER 1: ${USERNAME_1}\n✅ USER 2: ${USERNAME_2}`
              );
              break;
            default:
              await bot.sendMessage(channelId, strInvalidValue);
              break;
          }
        }

        // Extract both usernames
        const pattern = /📜 ([\w_]+)[\s\S]*?\( ?([\w_]+) ?\)/;
        const matches = originalMsg.match(pattern);
        if (matches) {
          const clientUsername = matches[1]; // _neversmile_
          const senderUsername = matches[2]; // forever_774
          const discordClient =
            clientUsername === USERNAME_1 ? discordClient_1 : discordClient_2;

          if (!MonitorUSER_1 && clientUsername === USERNAME_1) return;
          if (!MonitorUSER_2 && clientUsername === USERNAME_2) return;

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
    logger.error("Telegram Bot is running error", error);
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
