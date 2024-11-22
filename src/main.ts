import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { StorageService } from "./storage-service";
import { ApiService } from "./api-service";
import { generateMessage } from "./generate-message";

const Storage = new StorageService(process.env.STORAGE_FILE!);
const Api = new ApiService(Storage, Number(process.env.UPDATE_TIME_MIN));
const Bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);

Api.setUpdateListener(async (queue: number) => {
  const users = await Storage.get(queue);
  const data = await Api.get(queue);

  for (const id of Object.keys(users)) {
    try {
      await Bot.telegram.sendMessage(id, generateMessage(data!));
    } catch (error) {
      await Storage.delete(id);
      console.error(`User: ${id}:`, error);
    }
  }
});

Bot.start((ctx) => ctx.reply("Привіт додік, скажи яка в тебе черга? (число)"));

Bot.help((ctx) => ctx.reply("Яка e тебе черга? (число)"));

Bot.on(message("text"), async (ctx) => {
  const id = ctx.chat.id.toString();
  const text = ctx.msg.text;

  const number = parseInt(text, 10);

  if (Number.isNaN(number)) {
    return ctx.reply(`Я сказав число! А не цю хуйню: ${text.slice(0, 40)}`);
  }

  if (number < 0 || number > 10 || !(await Api.hasQueue(number))) {
    return ctx.reply("Такої черг не існує, додік");
  }

  const [data] = await Promise.all([Api.get(number), Storage.set(id, number)]);

  ctx.reply(
    "Окей, я тебе записав. Якщо будуть якісь зміни, я тобі повідомлю. А поки що, лови актуальний графік."
  );
  ctx.reply(generateMessage(data!));
});

Bot.launch(() => {
  console.log("Telegram bot is started like @" + Bot.botInfo?.username);
});
