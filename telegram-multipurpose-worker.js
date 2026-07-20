const CHANNEL_USERNAME = "@cucksclub";
const QUESTION_COUNT = 10;
const MAX_TEXT_LENGTH = 2800;
const MAX_PHOTO_CAPTION_LENGTH = 900;
const POST_COOLDOWN_SECONDS = 90;
const BOOKING_COOLDOWN_SECONDS = 60;
const TEST_COOLDOWN_SECONDS = 20;

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
  [{ text: "🧪 آزمون پژوهشی", callback_data: "menu:test" }],
  [{ text: "📅 نوبت مشاوره", callback_data: "menu:booking" }],
  [{ text: "📝 ارسال پست برای تایید", callback_data: "menu:submit" }],
  [{ text: "ℹ️ راهنما", callback_data: "menu:help" }]
];

const ADMIN_MENU = [
  [{ text: "➕ افزودن زمان مشاوره", callback_data: "admin:add_slot" }],
  [{ text: "🗓 زمان‌های فعال", callback_data: "admin:list_slots" }],
  [{ text: "📊 خروجی Excel درخواست‌ها", callback_data: "admin:export_bookings" }],
  [{ text: "📦 آمار سریع", callback_data: "admin:stats" }]
];

export default {
  async fetch(request, env) {
    if (request.method === "GET") {
      return new Response("C Club Telegram bot is running.");
    }

    let update;
    try {
      update = await request.json();
    } catch {
      return new Response("Bad request", { status: 400 });
    }

    try {
      if (update.callback_query) await handleCallback(update.callback_query, env);
      if (update.message) await handleMessage(update.message, env);
    } catch (error) {
      await notifyAdmin(env, `⚠️ Bot error\n\n${String(error?.stack || error)}`);
    }

    return new Response("OK");
  }
};

async function handleMessage(message, env) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const text = (message.text || "").trim();

  if (text === "/start") {
    await clearState(env, userId);
    await sendHome(env, chatId);
    return;
  }

  if (text === "/admin") {
    if (!isAdmin(env, userId)) {
      await sendMessage(env, chatId, "⛔️ این بخش فقط برای ادمین فعال است.");
      return;
    }
    await clearState(env, userId);
    await sendAdminPanel(env, chatId);
    return;
  }

  if (text === "/cancel") {
    await clearState(env, userId);
    await sendMessage(env, chatId, "✅ عملیات لغو شد.", keyboard(MAIN_MENU));
    return;
  }

  const state = await getState(env, userId);

  if (state?.mode === "admin_add_slot") {
    await finishAddSlot(env, message, text);
    return;
  }

  if (state?.mode === "test") {
    await sendMessage(env, chatId, "🎛 لطفاً جواب آزمون را فقط با دکمه‌های زیر همان سوال انتخاب کن.");
    return;
  }

  if (state?.mode === "booking_name") {
    await handleBookingName(env, message, text);
    return;
  }

  if (state?.mode === "booking_contact") {
    await handleBookingContact(env, message, state, text);
    return;
  }

  if (state?.mode === "booking_topic") {
    await handleBookingTopic(env, message, state, text);
    return;
  }

  if (state?.mode === "submit_post") {
    await handlePostSubmission(env, message);
    return;
  }

  await sendMessage(env, chatId, "از منوی زیر انتخاب کن:", keyboard(MAIN_MENU));
}

async function handleCallback(query, env) {
  const userId = String(query.from.id);
  const chatId = String(query.message.chat.id);
  const data = query.data || "";
  await answerCallback(env, query.id);

  if (data === "menu:help") {
    await sendHelp(env, chatId);
    return;
  }

  if (data === "menu:test") {
    await startTest(env, chatId, userId);
    return;
  }

  if (data === "menu:booking") {
    await startBooking(env, chatId, userId);
    return;
  }

  if (data === "menu:submit") {
    await startPostSubmission(env, chatId, userId);
    return;
  }

  if (data.startsWith("test:")) {
    const state = await getState(env, userId);
    const [, indexText, optionText] = data.split(":");
    await handleTestCallback(query, env, state, Number(indexText), Number(optionText));
    return;
  }

  if (data.startsWith("slot:pick:")) {
    const state = await getState(env, userId);
    await finishBookingWithSlot(env, query, state, data.replace("slot:pick:", ""));
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

  if (data.startsWith("slot:close:")) {
    await closeSlot(env, query, data.replace("slot:close:", ""));
    return;
  }

  if (data.startsWith("admin:")) {
    if (!isAdmin(env, userId)) {
      await sendMessage(env, chatId, "⛔️ دسترسی ادمین نداری.");
      return;
    }
    await handleAdminCallback(env, query, data);
  }
}

async function sendHome(env, chatId) {
  await sendMessage(
    env,
    chatId,
    [
      "🔴⚫️ C CLUB",
      "",
      "به ربات رسمی کلاب خوش آمدی.",
      "از منوی زیر یکی از گزینه‌ها را انتخاب کن.",
      "",
      "⚠️ فقط برای کاربران ۱۸ سال به بالا."
    ].join("\n"),
    keyboard(MAIN_MENU)
  );
}

async function sendHelp(env, chatId) {
  await sendMessage(
    env,
    chatId,
    [
      "ℹ️ راهنما",
      "",
      "🧪 آزمون پژوهشی: پاسخ‌ها را با دکمه‌ها انتخاب کن.",
      "📅 نوبت مشاوره: نام، راه تماس و موضوع را وارد کن و از زمان‌های آزاد یکی را بردار.",
      "📝 ارسال پست: متن یا عکس همراه کپشن بفرست تا ادمین تایید کند.",
      "",
      "لغو هر مسیر: /cancel"
    ].join("\n"),
    keyboard(MAIN_MENU)
  );
}

async function startTest(env, chatId, userId) {
  if (!(await checkCooldown(env, userId, "test", TEST_COOLDOWN_SECONDS))) {
    await sendMessage(env, chatId, "⏳ چند لحظه صبر کن و دوباره آزمون را شروع کن.");
    return;
  }

  await setState(env, userId, { mode: "test", index: 0, scores: [] });
  await sendMessage(
    env,
    chatId,
    [
      "🧪 آزمون پژوهشی",
      "",
      "این آزمون صرفاً خودسنجی و غیرتشخیصی است.",
      "برای روابط بالغ، آگاهانه و رضایتمندانه طراحی شده.",
      "",
      "برای توقف: /cancel"
    ].join("\n")
  );
  await sendQuestion(env, chatId, 0);
}

async function sendQuestion(env, chatId, index) {
  const q = QUESTIONS[index];
  const rows = q.options.map((option, optionIndex) => [
    { text: `${optionIndex + 1}️⃣ ${option.label}`, callback_data: `test:${index}:${optionIndex}` }
  ]);

  await sendMessage(
    env,
    chatId,
    [`🔘 سوال ${index + 1}/${QUESTION_COUNT}`, "", q.text].join("\n"),
    keyboard(rows)
  );
}

async function handleTestCallback(query, env, state, index, optionIndex) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);

  if (!state || state.mode !== "test") {
    await sendMessage(env, chatId, "برای شروع آزمون از منو استفاده کن.", keyboard(MAIN_MENU));
    return;
  }

  if (state.index !== index || !QUESTIONS[index]?.options[optionIndex]) {
    await sendMessage(env, chatId, "این پاسخ با سوال فعلی هماهنگ نیست.");
    return;
  }

  const option = QUESTIONS[index].options[optionIndex];
  const nextState = {
    mode: "test",
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

async function finishTest(env, chatId, userId, state) {
  const total = state.scores.reduce((sum, value) => sum + value, 0);
  const max = QUESTION_COUNT * 3;
  const percent = Math.round((total / max) * 100);

  let title = "🟢 گرایش پایین یا نامشخص";
  let note = "این فانتزی برایت محوریت زیادی ندارد یا هنوز روشن نیست.";
  if (percent >= 35 && percent < 65) {
    title = "🟡 گرایش متوسط";
    note = "کنجکاوی یا فانتزی وجود دارد؛ مرزها، رضایت و تفاوت فانتزی با اجرا باید جدی گرفته شود.";
  }
  if (percent >= 65) {
    title = "🔴 گرایش بالا";
    note = "این فانتزی پررنگ‌تر است؛ هر تصمیم واقعی فقط با رضایت کامل، مرزبندی روشن و حق توقف معنا دارد.";
  }

  await putListItem(env, "test_results", {
    userId,
    total,
    percent,
    createdAt: new Date().toISOString()
  });
  await clearState(env, userId);
  await sendMessage(
    env,
    chatId,
    [`📊 نتیجه آزمون`, "", `امتیاز: ${total}/${max}`, `درصد: ${percent}%`, `سطح: ${title}`, "", note, "", "این نتیجه تشخیص روان‌شناختی نیست."].join("\n"),
    keyboard(MAIN_MENU)
  );
}

async function startBooking(env, chatId, userId) {
  if (!(await checkCooldown(env, userId, "booking", BOOKING_COOLDOWN_SECONDS))) {
    await sendMessage(env, chatId, "⏳ درخواست نوبت خیلی سریع تکرار شده. کمی بعد دوباره امتحان کن.");
    return;
  }

  const slots = await getOpenSlots(env);
  if (!slots.length) {
    await sendMessage(env, chatId, "📅 فعلاً زمان آزادی برای مشاوره ثبت نشده. بعداً دوباره چک کن.", keyboard(MAIN_MENU));
    return;
  }

  await setState(env, userId, { mode: "booking_name" });
  await sendMessage(env, chatId, "📅 نوبت مشاوره\n\nنام یا اسم مستعار را بفرست.\n\nمثال: Ali\nلغو: /cancel");
}

async function handleBookingName(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validateName(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nدوباره نام یا اسم مستعار را بفرست:`);
    return;
  }
  await setState(env, userId, { mode: "booking_contact", name: cleanText(text) });
  await sendMessage(env, chatId, "📱 راه تماس را بفرست.\n\nقبول می‌کنم: شماره موبایل یا آیدی تلگرام مثل @username");
}

async function handleBookingContact(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validateContact(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nشماره موبایل یا آیدی تلگرام معتبر بفرست:`);
    return;
  }
  await setState(env, userId, { ...state, mode: "booking_topic", contact: cleanText(text) });
  await sendMessage(env, chatId, "🧩 موضوع مشاوره را کوتاه بنویس.\n\nحداقل ۱۰ و حداکثر ۵۰۰ کاراکتر.");
}

async function handleBookingTopic(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validateTopic(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nموضوع را دوباره بفرست:`);
    return;
  }

  const slots = await getOpenSlots(env);
  if (!slots.length) {
    await clearState(env, userId);
    await sendMessage(env, chatId, "متأسفانه همین الان زمان آزادی باقی نمانده.", keyboard(MAIN_MENU));
    return;
  }

  await setState(env, userId, { ...state, mode: "booking_slot", topic: cleanText(text) });
  await sendMessage(env, chatId, "🗓 یکی از زمان‌های آزاد را انتخاب کن:", keyboard(slots.slice(0, 12).map((slot) => [
    { text: slot.label, callback_data: `slot:pick:${slot.id}` }
  ])));
}

async function finishBookingWithSlot(env, query, state, slotId) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  if (!state || state.mode !== "booking_slot") {
    await sendMessage(env, chatId, "برای رزرو، از منوی نوبت مشاوره شروع کن.");
    return;
  }

  const slot = await getJson(env, `slot:${slotId}`);
  if (!slot || slot.status !== "open") {
    await sendMessage(env, chatId, "این زمان دیگر آزاد نیست. دوباره نوبت مشاوره را شروع کن.", keyboard(MAIN_MENU));
    await clearState(env, userId);
    return;
  }

  const bookingId = shortId();
  const booking = {
    id: bookingId,
    userId,
    username: query.from.username || "",
    firstName: query.from.first_name || "",
    name: state.name,
    contact: state.contact,
    topic: state.topic,
    slotId,
    slotLabel: slot.label,
    status: "scheduled",
    createdAt: new Date().toISOString()
  };

  slot.status = "booked";
  slot.bookedBy = userId;
  slot.bookingId = bookingId;
  await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
  await env.BOT_KV.put(`booking:${bookingId}`, JSON.stringify(booking));
  await putListItem(env, "bookings", booking);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [`✅ نوبتت ثبت شد`, "", `کد: ${bookingId}`, `زمان: ${slot.label}`, "", "لطفاً در همین زمان آماده باش."].join("\n"),
    keyboard(MAIN_MENU)
  );

  await notifyAdmin(
    env,
    [
      "📅 نوبت جدید ثبت شد",
      "",
      `کد: ${bookingId}`,
      `زمان: ${slot.label}`,
      `کاربر: ${formatUser(query.from)}`,
      `نام: ${booking.name}`,
      `تماس: ${booking.contact}`,
      `موضوع: ${booking.topic}`
    ].join("\n")
  );
}

async function startPostSubmission(env, chatId, userId) {
  if (!(await checkCooldown(env, userId, "post", POST_COOLDOWN_SECONDS))) {
    await sendMessage(env, chatId, "⏳ برای جلوگیری از اسپم، بین ارسال پست‌ها کمی فاصله بگذار.");
    return;
  }

  await setState(env, userId, { mode: "submit_post" });
  await sendMessage(
    env,
    chatId,
    [
      "📝 ارسال پست برای تایید",
      "",
      "یک متن بفرست، یا یک عکس همراه کپشن.",
      "پست بعد از تایید ادمین در کانال ارسال می‌شود.",
      "",
      "حداکثر متن: ۲۸۰۰ کاراکتر",
      "لغو: /cancel"
    ].join("\n")
  );
}

async function handlePostSubmission(env, message) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const post = normalizePost(message);

  if (!post.ok) {
    await sendMessage(env, chatId, `❌ ${post.error}\n\nدوباره متن یا عکس همراه کپشن بفرست.`);
    return;
  }

  const contentHash = await sha256(`${userId}:${post.kind}:${post.text}:${post.fileId || ""}`);
  const duplicate = await env.BOT_KV.get(`post_hash:${contentHash}`);
  if (duplicate) {
    await sendMessage(env, chatId, "❌ این پست تکراری است و دوباره ثبت نمی‌شود.", keyboard(MAIN_MENU));
    await clearState(env, userId);
    return;
  }

  const postId = shortId();
  const finalText = addChannelFooter(post.text);
  const record = {
    id: postId,
    userId,
    username: message.from.username || "",
    firstName: message.from.first_name || "",
    kind: post.kind,
    text: post.text,
    finalText,
    fileId: post.fileId || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(record));
  await env.BOT_KV.put(`post_hash:${contentHash}`, postId, { expirationTtl: 60 * 60 * 24 * 14 });
  await putListItem(env, "posts", record);
  await clearState(env, userId);

  await sendMessage(env, chatId, "✅ پست برای ادمین ارسال شد. نتیجه بعد از بررسی اعلام می‌شود.", keyboard(MAIN_MENU));
  await sendAdminPostPreview(env, record, message.from);
}

async function sendAdminPostPreview(env, post, user) {
  const adminText = [
    "📝 پست جدید برای تایید",
    "",
    `کد: ${post.id}`,
    `کاربر: ${formatUser(user)}`,
    `نوع: ${post.kind === "photo" ? "عکس + کپشن" : "متن"}`,
    "",
    "پیش‌نمایش پست:"
  ].join("\n");

  await sendMessage(env, env.ADMIN_CHAT_ID, adminText);
  const controls = keyboard([[
    { text: "✅ تایید و ارسال", callback_data: `post:approve:${post.id}` },
    { text: "❌ رد", callback_data: `post:reject:${post.id}` }
  ]]);

  if (post.kind === "photo") {
    await sendPhoto(env, env.ADMIN_CHAT_ID, post.fileId, post.finalText, controls);
    return;
  }

  await sendMessage(env, env.ADMIN_CHAT_ID, post.finalText, controls);
}

async function approvePost(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  post.status = "approved";
  post.approvedAt = new Date().toISOString();
  post.approvedBy = String(query.from.id);
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));

  const targetChannel = env.CHANNEL_ID || CHANNEL_USERNAME;
  if (post.kind === "photo") {
    await sendPhoto(env, targetChannel, post.fileId, post.finalText);
  } else {
    await sendMessage(env, targetChannel, post.finalText);
  }

  await sendMessage(env, post.userId, "✅ پستت تایید و در کانال ارسال شد.");
  await sendMessage(env, chatId, `✅ پست تایید و ارسال شد.\nکد: ${postId}`);
}

async function rejectPost(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  post.status = "rejected";
  post.rejectedAt = new Date().toISOString();
  post.rejectedBy = String(query.from.id);
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));

  await sendMessage(env, post.userId, "❌ پستت تایید نشد.");
  await sendMessage(env, chatId, `❌ پست رد شد.\nکد: ${postId}`);
}

async function handleAdminCallback(env, query, data) {
  const chatId = String(query.message.chat.id);

  if (data === "admin:add_slot") {
    await setState(env, String(query.from.id), { mode: "admin_add_slot" });
    await sendMessage(
      env,
      chatId,
      "➕ زمان مشاوره را دقیق وارد کن.\n\nمثال:\nسه‌شنبه ۲۰:۳۰\nیا\n2026-07-22 20:30\n\nلغو: /cancel"
    );
    return;
  }

  if (data === "admin:list_slots") {
    const slots = await getOpenSlots(env, 20);
    if (!slots.length) {
      await sendMessage(env, chatId, "هیچ زمان فعالی ثبت نشده.", keyboard(ADMIN_MENU));
      return;
    }
    await sendMessage(env, chatId, "🗓 زمان‌های فعال:", keyboard(slots.map((slot) => [
      { text: `❌ بستن ${slot.label}`, callback_data: `slot:close:${slot.id}` }
    ])));
    return;
  }

  if (data === "admin:export_bookings") {
    await exportBookings(env, chatId);
    return;
  }

  if (data === "admin:stats") {
    const bookings = await getList(env, "bookings");
    const posts = await getList(env, "posts");
    const tests = await getList(env, "test_results");
    await sendMessage(
      env,
      chatId,
      [`📦 آمار سریع`, "", `نوبت‌ها: ${bookings.length}`, `پست‌ها: ${posts.length}`, `نتایج آزمون: ${tests.length}`].join("\n"),
      keyboard(ADMIN_MENU)
    );
  }
}

async function finishAddSlot(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const slotLabel = cleanText(text);
  if (slotLabel.length < 4 || slotLabel.length > 80) {
    await sendMessage(env, chatId, "❌ زمان باید بین ۴ تا ۸۰ کاراکتر باشد. دوباره بفرست:");
    return;
  }

  const slot = {
    id: shortId(),
    label: slotLabel,
    status: "open",
    createdAt: new Date().toISOString(),
    createdBy: userId
  };
  await env.BOT_KV.put(`slot:${slot.id}`, JSON.stringify(slot));
  await putListItem(env, "slots", slot);
  await clearState(env, userId);
  await sendMessage(env, chatId, `✅ زمان اضافه شد:\n${slot.label}`, keyboard(ADMIN_MENU));
}

async function closeSlot(env, query, slotId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const slot = await getJson(env, `slot:${slotId}`);
  if (!slot) {
    await sendMessage(env, chatId, "زمان پیدا نشد.");
    return;
  }
  slot.status = "closed";
  slot.closedAt = new Date().toISOString();
  await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
  await sendMessage(env, chatId, `✅ زمان بسته شد:\n${slot.label}`, keyboard(ADMIN_MENU));
}

async function sendAdminPanel(env, chatId) {
  await sendMessage(env, chatId, "🛠 پنل ادمین\n\nچه کاری می‌خواهی انجام بدهی؟", keyboard(ADMIN_MENU));
}

async function exportBookings(env, chatId) {
  const bookings = await getList(env, "bookings");
  if (!bookings.length) {
    await sendMessage(env, chatId, "هنوز هیچ درخواست نوبتی ثبت نشده.", keyboard(ADMIN_MENU));
    return;
  }

  const rows = [
    ["id", "status", "slot", "name", "contact", "topic", "telegram_id", "username", "created_at"],
    ...bookings.map((item) => [
      item.id,
      item.status,
      item.slotLabel,
      item.name,
      item.contact,
      item.topic,
      item.userId,
      item.username ? `@${item.username}` : "",
      item.createdAt
    ])
  ];
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\n");
  const filename = `bookings-${new Date().toISOString().slice(0, 10)}.csv`;
  await sendDocument(env, chatId, csv, filename, "📊 فایل خروجی درخواست‌های مشاوره؛ در Excel باز می‌شود.");
}

function normalizePost(message) {
  if (message.photo?.length) {
    const largestPhoto = message.photo[message.photo.length - 1];
    const caption = cleanText(message.caption || "");
    if (!caption || caption.length < 5) {
      return { ok: false, error: "برای عکس باید کپشن معنادار حداقل ۵ کاراکتری بنویسی." };
    }
    if (caption.length > MAX_PHOTO_CAPTION_LENGTH) {
      return { ok: false, error: `کپشن عکس باید حداکثر ${MAX_PHOTO_CAPTION_LENGTH} کاراکتر باشد.` };
    }
    return { ok: true, kind: "photo", fileId: largestPhoto.file_id, text: caption };
  }

  if (message.text) {
    const text = cleanText(message.text);
    if (text.startsWith("/")) return { ok: false, error: "برای ارسال پست، دستور نفرست؛ متن پست را بفرست." };
    if (text.length < 5) return { ok: false, error: "متن پست خیلی کوتاه است. حداقل ۵ کاراکتر لازم است." };
    if (text.length > MAX_TEXT_LENGTH) return { ok: false, error: `متن بیشتر از ${MAX_TEXT_LENGTH} کاراکتر است.` };
    return { ok: true, kind: "text", text };
  }

  return { ok: false, error: "فعلاً فقط متن یا عکس همراه کپشن پشتیبانی می‌شود." };
}

function addChannelFooter(text) {
  const trimmed = cleanText(text);
  if (trimmed.includes(CHANNEL_USERNAME)) return trimmed;
  return `${trimmed}\n\n${CHANNEL_USERNAME}`;
}

function validateName(value) {
  const text = cleanText(value);
  if (text.length < 2) return "نام خیلی کوتاه است.";
  if (text.length > 60) return "نام خیلی طولانی است.";
  if (/https?:\/\/|t\.me|telegram\.me/i.test(text)) return "داخل نام لینک نفرست.";
  return "";
}

function validateContact(value) {
  const text = cleanText(value);
  const phone = /^\+?\d[\d\s-]{7,18}$/.test(text);
  const username = /^@[A-Za-z0-9_]{5,32}$/.test(text);
  if (!phone && !username) return "راه تماس باید شماره موبایل یا آیدی تلگرام مثل @username باشد.";
  return "";
}

function validateTopic(value) {
  const text = cleanText(value);
  if (text.length < 10) return "موضوع خیلی کوتاه است.";
  if (text.length > 500) return "موضوع خیلی طولانی است.";
  if (countUrls(text) > 0) return "در موضوع مشاوره لینک نفرست.";
  return "";
}

async function checkCooldown(env, userId, action, seconds) {
  const key = `cooldown:${action}:${userId}`;
  const exists = await env.BOT_KV.get(key);
  if (exists) return false;
  await env.BOT_KV.put(key, "1", { expirationTtl: seconds });
  return true;
}

async function getOpenSlots(env, limit = 12) {
  const slots = await getList(env, "slots");
  return slots
    .filter((slot) => slot.status === "open")
    .slice(-limit)
    .reverse();
}

async function putListItem(env, listName, item) {
  const list = await getList(env, listName);
  list.push(item);
  const trimmed = list.slice(-500);
  await env.BOT_KV.put(`list:${listName}`, JSON.stringify(trimmed));
}

async function getList(env, listName) {
  return (await getJson(env, `list:${listName}`)) || [];
}

async function getState(env, userId) {
  return getJson(env, `state:${userId}`);
}

async function setState(env, userId, value) {
  await env.BOT_KV.put(`state:${userId}`, JSON.stringify(value), { expirationTtl: 60 * 45 });
}

async function clearState(env, userId) {
  await env.BOT_KV.delete(`state:${userId}`);
}

async function getJson(env, key) {
  const value = await env.BOT_KV.get(key);
  return value ? JSON.parse(value) : null;
}

function isAdmin(env, userId) {
  return String(env.ADMIN_CHAT_ID) === String(userId);
}

function keyboard(inline_keyboard) {
  return { reply_markup: { inline_keyboard } };
}

function formatUser(user) {
  const username = user.username ? `@${user.username}` : "بدون یوزرنیم";
  return `${user.first_name || ""} ${user.last_name || ""} - ${username} - id:${user.id}`.trim();
}

function cleanText(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function countUrls(value) {
  return (String(value).match(/https?:\/\/|t\.me\/|telegram\.me\//gi) || []).length;
}

function shortId() {
  return crypto.randomUUID().split("-")[0];
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function notifyAdmin(env, text) {
  if (env.ADMIN_CHAT_ID) await sendMessage(env, env.ADMIN_CHAT_ID, text);
}

async function telegram(env, method, payload) {
  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const result = await response.json().catch(() => ({}));
  if (!result.ok) throw new Error(`${method} failed: ${JSON.stringify(result)}`);
  return result;
}

async function sendMessage(env, chatId, text, extra = {}) {
  return telegram(env, "sendMessage", {
    chat_id: chatId,
    text,
    disable_web_page_preview: true,
    ...extra
  });
}

async function sendPhoto(env, chatId, photo, caption, extra = {}) {
  return telegram(env, "sendPhoto", {
    chat_id: chatId,
    photo,
    caption,
    ...extra
  });
}

async function answerCallback(env, callbackQueryId) {
  return telegram(env, "answerCallbackQuery", { callback_query_id: callbackQueryId });
}

async function sendDocument(env, chatId, content, filename, caption) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", caption);
  form.append("document", new Blob([content], { type: "text/csv;charset=utf-8" }), filename);

  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: form
  });
  const result = await response.json().catch(() => ({}));
  if (!result.ok) throw new Error(`sendDocument failed: ${JSON.stringify(result)}`);
  return result;
}
