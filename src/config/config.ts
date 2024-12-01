import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Access environment variables
export const USER_TOKEN_1 = process.env.DISCORD_USER_TOKEN_1;
export const USER_TOKEN_2 = process.env.DISCORD_USER_TOKEN_2;
export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || -1002340692403;

export const BotMenu = [
  {
    command: "setting",
    description: "⚙️ Monitoring Discord Account",
  },
  { command: "help", description: "❓ Help" },
];

// pemission of channel
export const OWNER = "creator";
export const ADMIN = "administrator";

// Reply mode
export const REPLY_MODE = {
  parse_mode: "HTML",
  reply_markup: {
    force_reply: true,
  },
};

export const HTML_MODE = { parse_mode: "HTML" };

export const strNoPermition = "🚫 You do not have permission.";
export const strInvalidValue = "❗ Invalid value entered";
export const strNotAllowFile = "🚫 You are not allowed to send files.";

export const strPlzSet = `⚙️Please set the user to monitor:`;
export const strHelpContent = `❓ Help`;

export const TOGGLE_FIRST = "Toggle_First";
export const TOGGLE_SECOND = "Toggle_Second";
export const CLOSE = "CLOSE"
