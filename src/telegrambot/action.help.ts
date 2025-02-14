import { ErrorCode } from "../../utils/error.handle";
import logger from "../../utils/logger";
import { strHelpContent } from "../config/config";

export const HelpAction = async (msg: any, bot: any) => {
  try {
    const chatId = msg.chat.id;

    await bot.sendMessage(chatId, strHelpContent);
  } catch (error) {
    logger.error(ErrorCode.HELPACTION_ERROR, error);
  }
};
