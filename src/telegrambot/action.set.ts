import { ADMIN, OWNER, REPLY_MODE, strNoPermition, strPlzSet } from "../config/config";

export const SetAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);
  if (chatMember.status === OWNER || chatMember.status === ADMIN) {
    await bot.sendMessage(chatId, strPlzSet, REPLY_MODE);
  } else {
    await bot.sendMessage(channelId, strNoPermition);
  }
};
