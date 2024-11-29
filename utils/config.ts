import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Access environment variables
export const USER_TOKEN_1 = process.env.DISCORD_USER_TOKEN_1;
export const USER_TOKEN_2 = process.env.DISCORD_USER_TOKEN_2;
export const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
export const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || -1002340692403;

export const BotMenu = [
  { command: "add", description: "➕ Add token" },
  { command: "list", description: "📋 List token" },
  { command: "remove", description: "❌ Remove token" },
  { command: "help", description: "❔ Help" },
];
