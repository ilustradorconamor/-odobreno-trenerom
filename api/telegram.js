
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;

  if (
    !secret ||
    req.headers["x-telegram-bot-api-secret-token"] !== secret
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const update = req.body;
    const message = update.message;

    if (message?.text === "/start" || message?.text?.startsWith("/start ")) {
      const { BOT_TOKEN } = process.env;

      const welcomeText = `Привет! ❤️ Добро пожаловать в «Одобрено тренером»!

Мы готовим вкусную еду с хорошим составом, чтобы заботиться о фигуре и здоровье было проще. Много белка, понятное КБЖУ и меньше времени на готовку 💪

🛒 Нажимайте на кнопку «Магазин», знакомьтесь с меню и собирайте свой заказ.

Будем рады стать частью вашего рациона! 💚`;

      const response = await fetch(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: welcomeText,
            reply_markup: {
              inline_keyboard: [[
                {
                  text: "🛒 МАГАЗИН",
                  web_app: {
                    url: "https://odobreno-trenerom-scrapy-coco.vercel.app"
                  }
                }
              ]]
            }
          })
        }
      );

      if (!response.ok) {
        return res.status(502).json({ error: "Telegram send failed" });
      }
    }

    return res.status(200).json({ ok: true });
  } catch {
    return res.status(500).json({ error: "Internal error" });
  }
}
