export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
  const { BOT_TOKEN, ADMIN_CHAT_ID } = process.env;
  if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
    return res.status(503).json({error:"Форма готова, но отправка ещё не подключена. Следующим шагом добавим Telegram-токен бота."});
  }
  try {
    const {items=[],name="",phone="",comment=""} = req.body || {};
    const total = items.reduce((s,x)=>s + Number(x.price||0)*Number(x.qty||0),0);
    const lines = items.map(x => `• ${x.name}${x.variant ? ` — ${x.variant}` : ""} × ${x.qty} = ${Number(x.price||0)*Number(x.qty||0)} USDT`).join("\n");
    const text = `🛒 НОВЫЙ ЗАКАЗ\n\n${lines}\n\nИтого: ${total} USDT\n\nИмя: ${name || "—"}\nТелефон / WhatsApp: ${phone || "—"}\nКомментарий: ${comment || "—"}`;
    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({chat_id:ADMIN_CHAT_ID,text})
    });
    const data = await r.json();
    if (!r.ok || !data.ok) throw new Error("Telegram send failed");
    return res.status(200).json({ok:true});
  } catch (e) {
    return res.status(500).json({error:"Не удалось отправить заказ"});
  }
}
