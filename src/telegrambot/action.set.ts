import {
  ADMIN,
  CLOSE,
  OWNER,
  strNoPermition,
  strPlzSet,
  TOGGLE_FIRST,
  TOGGLE_SECOND,
} from "../config/config";

import { getButtonText } from "../../utils/utils";
import logger from "../../utils/logger";
import { ErrorCode } from "../../utils/error.handle";

export const SetAction = async (msg: any, bot: any) => {
  try {
    const channelId = msg.chat.id;
    const chatId = msg.chat.id;
    const chatMember = await bot.getChatMember(chatId, msg.from.id);
    if (chatMember.status === OWNER || chatMember.status === ADMIN) {
      const keyboard = {
        inline_keyboard: [
          [
            {
              text: getButtonText(1),
              callback_data: TOGGLE_FIRST,
            },
            {
              text: getButtonText(2),
              callback_data: TOGGLE_SECOND,
            },
          ],
          [{ text: "❌ Close", callback_data: CLOSE }],
        ],
      };

      await bot.sendMessage(chatId, strPlzSet, { reply_markup: keyboard });
    } else {
      await bot.sendMessage(channelId, strNoPermition);
    }
  } catch (error) {
    logger.error(ErrorCode.UNCAUGHTEXCEPTION, error);
  }
};
