const TEST_KEY = "test:cuckold_fetish_research_v1";
const QUESTION_COUNT = 10;

const QUESTIONS = [
  {
    text: "وقتی شریک عاطفی/جنسی‌تان مورد توجه فرد دیگری قرار می‌گیرد، واکنش غالب شما چیست؟",
    options: [
      { label: "کاملا ناراحت یا مضطرب می‌شوم", score: 0 },
      { label: "کمی حسادت می‌کنم اما قابل مدیریت است", score: 1 },
      { label: "کنجکاو یا تحریک ذهنی می‌شوم", score: 2 },
      { label: "برایم جذاب و برانگیزاننده است", score: 3 }
    ]
  },
  {
    text: "فکر کردن به سناریوهای رضایتمندانه و توافقی با حضور فرد سوم برای شما چقدر جذاب است؟",
    options: [
      { label: "اصلا جذاب نیست", score: 0 },
      { label: "به ندرت جذاب است", score: 1 },
      { label: "گاهی جذاب است", score: 2 },
      { label: "خیلی جذاب است", score: 3 }
    ]
  },
  {
    text: "در رابطه، دانستن جزئیات توجه یا ارتباط شریک‌تان با فرد دیگر چه حسی ایجاد می‌کند؟",
    options: [
      { label: "ترجیح می‌دهم ندانم", score: 0 },
      { label: "بسته به شرایط شاید بدانم", score: 1 },
      { label: "تا حدی کنجکاوم", score: 2 },
      { label: "دانستن جزئیات برایم مهم و جذاب است", score: 3 }
    ]
  },
  {
    text: "اگر همه افراد بالغ، آگاه و رضایتمند باشند، نقش تماشاگر یا شنونده بودن برای شما چقدر قابل تصور است؟",
    options: [
      { label: "قابل تصور نیست", score: 0 },
      { label: "خیلی کم", score: 1 },
      { label: "تا حدی", score: 2 },
      { label: "کاملا قابل تصور است", score: 3 }
    ]
  },
  {
    text: "در چنین سناریوهایی، مرزگذاری و توافق قبلی برای شما چقدر ضروری است؟",
    options: [
      { label: "چندان مهم نیست", score: 0 },
      { label: "تا حدی مهم است", score: 1 },
      { label: "مهم است", score: 2 },
      { label: "کاملا ضروری است", score: 3 }
    ]
  },
  {
    text: "اگر شریک‌تان بدون اطلاع شما با فرد دیگری وارد رابطه شود، آن را چطور می‌بینید؟",
    options: [
      { label: "خیانت و غیرقابل قبول", score: 3 },
      { label: "بسیار آزاردهنده", score: 2 },
      { label: "بستگی به شرایط دارد", score: 1 },
      { label: "مشکل خاصی ندارد", score: 0 }
    ]
  },
  {
    text: "تفاوت بین فانتزی و اجرای واقعی برای شما چقدر روشن است؟",
    options: [
      { label: "روشن نیست", score: 0 },
      { label: "گاهی قاطی می‌شود", score: 1 },
      { label: "نسبتا روشن است", score: 2 },
      { label: "کاملا روشن است", score: 3 }
    ]
  },
  {
    text: "اگر اجرای یک فانتزی باعث آسیب روانی شریک‌تان شود، چه می‌کنید؟",
    options: [
      { label: "ادامه می‌دهم چون خواسته من مهم است", score: 0 },
      { label: "شاید توقف کنم", score: 1 },
      { label: "توقف و گفتگو می‌کنم", score: 2 },
      { label: "کاملا متوقف می‌کنم و مرزها را بازبینی می‌کنم", score: 3 }
    ]
  },
  {
    text: "برای صحبت درباره این فانتزی با شریک، کدام روش به شما نزدیک‌تر است؟",
    options: [
      { label: "اصلا صحبت نمی‌کنم", score: 0 },
      { label: "غیرمستقیم اشاره می‌کنم", score: 1 },
      { label: "با احتیاط و احترام مطرح می‌کنم", score: 2 },
      { label: "شفاف، توافقی و با حق نه گفتن مطرح می‌کنم", score: 3 }
    ]
  },
  {
    text: "این فانتزی در زندگی روزمره شما چقدر کنترل‌پذیر است؟",
    options: [
      { label: "کنترلش سخت است", score: 0 },
      { label: "گاهی مزاحم تمرکز یا رابطه‌ام می‌شود", score: 1 },
      { label: "معمولا کنترل‌پذیر است", score: 2 },
      { label: "کاملا کنترل‌پذیر و بدون اختلال است", score: 3 }
    ]
  }
];

const MAIN_MENU = [
  [{ text: "آزمون پژوهشی", callback_data: "menu:test" }],
  [{ text: "نوبت مشاوره", callback_data: "menu:booking" }],
  [{ text: "چت ناشناس", callback_data: "menu:anonymous" }],
  [{ text: "ارسال پست برای تایید", callback_data: "menu:submit" }]
];

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("Telegram multipurpose bot is running.");
    }

    const update = await request.json();

    if (update.callback_query) {
      await handleCallback(update.callback_query, env);
      return new Response("OK");
    }

    if (update.message) {
      await handleMessage(update.message, env);
      return new Response("OK");
    }

    return new Response("OK");
  }
};

async function handleMessage(message, env) {
  const chatId = message.chat.id;
  const userId = String(message.from.id);
  const text = (message.text || "").trim();
  const state = await getState(env, userId);

  if (text === "/start") {
    await clearState(env, userId);
    await sendMessage(env, chatId, "سلام. یکی از بخش‌ها را انتخاب کن:", keyboard(MAIN_MENU));
    return;
  }

  if (text === "/cancel") {
    await stopAnonymousChat(env, userId);
    await clearState(env, userId);
    await sendMessage(env, chatId, "لغو شد. از منوی زیر انتخاب کن:", keyboard(MAIN_MENU));
    return;
  }

  if (text === "/stop") {
    await stopAnonymousChat(env, userId);
    await clearState(env, userId);
    await sendMessage(env, chatId, "چت ناشناس متوقف شد.", keyboard(MAIN_MENU));
    return;
  }

  if (state?.mode === "test") {
    await handleTestAnswer(env, message, state);
    return;
  }

  if (state?.mode === "booking_name") {
    await setState(env, userId, { mode: "booking_phone", name: text });
    await sendMessage(env, chatId, "شماره تماس یا آیدی تلگرام را بفرست:");
    return;
  }

  if (state?.mode === "booking_phone") {
    await setState(env, userId, { ...state, mode: "booking_topic", contact: text });
    await sendMessage(env, chatId, "موضوع مشاوره را کوتاه بنویس:");
    return;
  }

  if (state?.mode === "booking_topic") {
    await finishBooking(env, message, state, text);
    return;
  }

  if (state?.mode === "submit_post") {
    await finishPostSubmission(env, message, text);
    return;
  }

  const partnerId = await env.BOT_KV.get(`anon:partner:${userId}`);
  if (partnerId) {
    await forwardAnonymous(env, message, partnerId);
    return;
  }

  await sendMessage(env, chatId, "دستور را متوجه نشدم. از منو انتخاب کن:", keyboard(MAIN_MENU));
}

async function handleCallback(query, env) {
  const userId = String(query.from.id);
  const chatId = query.message.chat.id;
  const data = query.data;

  await answerCallback(env, query.id);

  if (data.startsWith("test:")) {
    const state = await getState(env, userId);
    const [, indexText, optionText] = data.split(":");
    await handleTestCallback(query, env, state, Number(indexText), Number(optionText));
    return;
  }

  if (data === "menu:test") {
    await startTest(env, chatId, userId);
    return;
  }

  if (data === "menu:booking") {
    await setState(env, userId, { mode: "booking_name" });
    await sendMessage(env, chatId, "برای نوبت مشاوره، نام یا اسم مستعار را بفرست. برای لغو /cancel");
    return;
  }

  if (data === "menu:anonymous") {
    await startAnonymous(env, chatId, userId);
    return;
  }

  if (data === "menu:submit") {
    await setState(env, userId, { mode: "submit_post" });
    await sendMessage(env, chatId, "متن پست/دیتا را بفرست تا برای ادمین ارسال شود. برای لغو /cancel");
    return;
  }

  if (data.startsWith("post:approve:")) {
    await approvePost(env, query, data.replace("post:approve:", ""));
    return;
  }

  if (data.startsWith("post:reject:")) {
    await rejectPost(env, query, data.replace("post:reject:", ""));
    return;
  }
}

async function startTest(env, chatId, userId) {
  await setState(env, userId, {
    mode: "test",
    index: 0,
    scores: []
  });

  await sendMessage(
    env,
    chatId,
    "این آزمون صرفاً برای خودسنجی و پژوهش غیرتشخیصی است. فقط درباره روابط بالغ، آگاهانه و رضایتمندانه طراحی شده است.\n\nبرای لغو /cancel",
  );
  await sendQuestion(env, chatId, 0);
}

async function sendQuestion(env, chatId, index) {
  const q = QUESTIONS[index];
  const rows = q.options.map((option, optionIndex) => [
    { text: `${optionIndex + 1}. ${option.label}`, callback_data: `test:${index}:${optionIndex}` }
  ]);
  await sendMessage(env, chatId, `سوال ${index + 1} از ${QUESTION_COUNT}\n\n${q.text}`, keyboard(rows));
}

async function handleTestAnswer(env, message, state) {
  await sendMessage(env, message.chat.id, "لطفاً پاسخ را با دکمه‌های زیر سوال انتخاب کن.");
}

async function finishTest(env, chatId, userId, state) {
  const total = state.scores.reduce((sum, value) => sum + value, 0);
  const max = QUESTION_COUNT * 3;
  const percent = Math.round((total / max) * 100);

  let band = "گرایش پایین یا نامشخص";
  let note = "نتیجه نشان می‌دهد این فانتزی برایت محوریت زیادی ندارد یا هنوز روشن نیست.";

  if (percent >= 35 && percent < 65) {
    band = "گرایش متوسط";
    note = "فانتزی یا کنجکاوی وجود دارد، اما بهتر است مرزها، رضایت و تفاوت فانتزی با اجرا جدی گرفته شود.";
  }

  if (percent >= 65) {
    band = "گرایش بالا";
    note = "این فانتزی برایت پررنگ‌تر است. هر تصمیم واقعی باید فقط با رضایت کامل، مرزبندی روشن، امنیت روانی و حق توقف انجام شود.";
  }

  await clearState(env, userId);
  await sendMessage(
    env,
    chatId,
    `نتیجه آزمون:\n\nامتیاز: ${total} از ${max}\nدرصد: ${percent}%\nسطح: ${band}\n\n${note}\n\nاین نتیجه تشخیص روان‌شناختی نیست.`,
    keyboard(MAIN_MENU)
  );
}

async function startAnonymous(env, chatId, userId) {
  const currentPartner = await env.BOT_KV.get(`anon:partner:${userId}`);
  if (currentPartner) {
    await sendMessage(env, chatId, "تو همین الان داخل چت ناشناس هستی. برای خروج /stop");
    return;
  }

  const waitingUser = await env.BOT_KV.get("anon:waiting");
  if (waitingUser && waitingUser !== userId) {
    await env.BOT_KV.delete("anon:waiting");
    await env.BOT_KV.put(`anon:partner:${userId}`, waitingUser);
    await env.BOT_KV.put(`anon:partner:${waitingUser}`, userId);

    await sendMessage(env, chatId, "وصل شدی. پیام‌ها ناشناس رد و بدل می‌شود. برای خروج /stop");
    await sendMessage(env, waitingUser, "یک نفر وصل شد. پیام‌ها ناشناس رد و بدل می‌شود. برای خروج /stop");
    return;
  }

  await env.BOT_KV.put("anon:waiting", userId);
  await sendMessage(env, chatId, "در صف چت ناشناس هستی. وقتی نفر بعدی بیاید وصل می‌شوی. برای لغو /stop");
}

async function forwardAnonymous(env, message, partnerId) {
  if (message.text) {
    await sendMessage(env, partnerId, `پیام ناشناس:\n${message.text}`);
    return;
  }

  await sendMessage(env, message.chat.id, "فعلاً در چت ناشناس فقط متن پشتیبانی می‌شود.");
}

async function stopAnonymousChat(env, userId) {
  const partnerId = await env.BOT_KV.get(`anon:partner:${userId}`);
  await env.BOT_KV.delete(`anon:partner:${userId}`);

  const waitingUser = await env.BOT_KV.get("anon:waiting");
  if (waitingUser === userId) {
    await env.BOT_KV.delete("anon:waiting");
  }

  if (partnerId) {
    await env.BOT_KV.delete(`anon:partner:${partnerId}`);
    await sendMessage(env, partnerId, "طرف مقابل چت را ترک کرد.", keyboard(MAIN_MENU));
  }
}

async function finishBooking(env, message, state, topic) {
  const userId = String(message.from.id);
  const chatId = message.chat.id;
  const bookingId = crypto.randomUUID();
  const booking = {
    id: bookingId,
    userId,
    username: message.from.username || "",
    name: state.name,
    contact: state.contact,
    topic,
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`booking:${bookingId}`, JSON.stringify(booking));
  await clearState(env, userId);

  await sendMessage(env, chatId, "درخواست نوبت ثبت شد. ادمین بررسی می‌کند و برای هماهنگی پیام می‌دهد.", keyboard(MAIN_MENU));
  await notifyAdmin(env, `درخواست نوبت جدید:\n\nکد: ${bookingId}\nکاربر: ${formatUser(message.from)}\nنام: ${state.name}\nتماس: ${state.contact}\nموضوع: ${topic}`);
}

async function finishPostSubmission(env, message, content) {
  const userId = String(message.from.id);
  const chatId = message.chat.id;
  const postId = crypto.randomUUID();
  const post = {
    id: postId,
    userId,
    username: message.from.username || "",
    content,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));
  await clearState(env, userId);

  await sendMessage(env, chatId, "پستت برای تایید ادمین ارسال شد.", keyboard(MAIN_MENU));
  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    `پست جدید برای تایید:\n\nکد: ${postId}\nکاربر: ${formatUser(message.from)}\n\n${content}`,
    keyboard([
      [
        { text: "تایید", callback_data: `post:approve:${postId}` },
        { text: "رد", callback_data: `post:reject:${postId}` }
      ]
    ])
  );
}

async function approvePost(env, query, postId) {
  const post = await getJson(env, `post:${postId}`);
  if (!post) {
    await sendMessage(env, query.message.chat.id, "پست پیدا نشد.");
    return;
  }

  post.status = "approved";
  post.approvedAt = new Date().toISOString();
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));

  if (env.CHANNEL_ID) {
    await sendMessage(env, env.CHANNEL_ID, post.content);
  }

  await sendMessage(env, post.userId, "پستت تایید شد.");
  await sendMessage(env, query.message.chat.id, `پست تایید شد.\nکد: ${postId}`);
}

async function rejectPost(env, query, postId) {
  const post = await getJson(env, `post:${postId}`);
  if (!post) {
    await sendMessage(env, query.message.chat.id, "پست پیدا نشد.");
    return;
  }

  post.status = "rejected";
  post.rejectedAt = new Date().toISOString();
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));

  await sendMessage(env, post.userId, "پستت تایید نشد.");
  await sendMessage(env, query.message.chat.id, `پست رد شد.\nکد: ${postId}`);
}

async function getState(env, userId) {
  return getJson(env, `state:${userId}`);
}

async function setState(env, userId, value) {
  await env.BOT_KV.put(`state:${userId}`, JSON.stringify(value), { expirationTtl: 60 * 60 * 24 });
}

async function clearState(env, userId) {
  await env.BOT_KV.delete(`state:${userId}`);
}

async function getJson(env, key) {
  const value = await env.BOT_KV.get(key);
  return value ? JSON.parse(value) : null;
}

function keyboard(inline_keyboard) {
  return { reply_markup: { inline_keyboard } };
}

function formatUser(user) {
  const username = user.username ? `@${user.username}` : "بدون یوزرنیم";
  return `${user.first_name || ""} ${user.last_name || ""} - ${username} - id:${user.id}`.trim();
}

async function notifyAdmin(env, text) {
  if (env.ADMIN_CHAT_ID) {
    await sendMessage(env, env.ADMIN_CHAT_ID, text);
  }
}

async function sendMessage(env, chatId, text, extra = {}) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      ...extra
    })
  });
}

async function answerCallback(env, callbackQueryId) {
  await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ callback_query_id: callbackQueryId })
  });
}

async function handleTestCallback(query, env, state, index, optionIndex) {
  const chatId = query.message.chat.id;
  const userId = String(query.from.id);

  if (!state || state.mode !== "test") {
    await sendMessage(env, chatId, "برای شروع آزمون از منو گزینه آزمون را انتخاب کن.");
    return;
  }

  if (Number(state.index) !== Number(index)) {
    await sendMessage(env, chatId, "این پاسخ مربوط به سوال فعلی نیست.");
    return;
  }

  const question = QUESTIONS[index];
  const option = question.options[optionIndex];
  const nextState = {
    ...state,
    index: index + 1,
    scores: [...state.scores, option.score]
  };

  if (nextState.index >= QUESTION_COUNT) {
    await finishTest(env, chatId, userId, nextState);
    return;
  }

  await setState(env, userId, nextState);
  await sendQuestion(env, chatId, nextState.index);
}
