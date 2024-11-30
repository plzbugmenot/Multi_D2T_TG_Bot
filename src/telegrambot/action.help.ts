import { strHelpContent } from "../config/config";

export const HelpAction = async (msg: any, bot: any) => {
  const chatId = msg.chat.id;

  await bot.sendMessage(chatId, strHelpContent);
};
