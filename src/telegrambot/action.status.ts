import { getMonitorUser, getUserName } from "../..";
import { ADMIN, HTML_MODE, OWNER, strNoPermition } from "../config/config";

export const StatusAction = async (msg: any, bot: any) => {
  const channelId = msg.chat.id;
  const chatId = msg.chat.id;
  const chatMember = await bot.getChatMember(chatId, msg.from.id);
  const status_1 =
    (getMonitorUser(1) ? "✅" : "❌") + " USER 1: " + getUserName(1) + "\n";
  const status_2 =
    (getMonitorUser(2) ? "✅" : "❌") + " USER 2: " + getUserName(2);
  const status = `🔔 Monitoring Status\n\n` + status_1 + status_2;

  if (chatMember.status === OWNER || chatMember.status === ADMIN) {
    await bot.sendMessage(chatId, status, HTML_MODE);
  } else {
    await bot.sendMessage(channelId, strNoPermition);
  }
};
