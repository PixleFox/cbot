const CHANNEL_USERNAME = "@cucksclub";
const INSTAGRAM_URL = "https://instagram.com/cucksclub";
const QUESTION_COUNT = 10;
const MAX_TEXT_LENGTH = 2800;
const MAX_PHOTO_CAPTION_LENGTH = 900;
const MAX_VIDEO_CAPTION_LENGTH = 900;
const POST_COOLDOWN_SECONDS = 90;
const BOOKING_COOLDOWN_SECONDS = 60;
const TEST_COOLDOWN_SECONDS = 20;
const REMINDER_WINDOW_MINUTES = 30;

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
  [{ text: "🧪 تست غیرت", callback_data: "menu:test" }],
  [{ text: "📅 نوبت مشاوره", callback_data: "menu:booking" }],
  [{ text: "🖼 ارسال عکس", callback_data: "post:type:media" }],
  [{ text: "✍️ ارسال اعتراف", callback_data: "post:type:confession" }],
  [{ text: "🔞 عضویت در گروه VIP کاکولدی", callback_data: "vip:join" }],
  [{ text: "💧 تخلیه آب بیغیرتی", callback_data: "release:start" }],
  [{ text: "ℹ️ راهنما", callback_data: "menu:help" }]
];

const LOCKED_MENU = [
  [{ text: "📝 ثبت نام", callback_data: "reg:start" }],
  [{ text: "ℹ️ راهنما", callback_data: "menu:help" }]
];

const BACK_TO_MENU = [
  [{ text: "↩️ برگشت به منو", callback_data: "menu:home" }]
];

const GENDER_MENU = [
  [{ text: "زن", callback_data: "reg:gender:female" }, { text: "مرد", callback_data: "reg:gender:male" }]
];

const MARITAL_MENU = [
  [{ text: "مجرد", callback_data: "reg:marital:single" }],
  [{ text: "متاهل", callback_data: "reg:marital:married" }],
  [{ text: "در رابطه", callback_data: "reg:marital:relationship" }]
];

const CITY_OPTIONS = [
  "تهران", "مشهد", "اصفهان", "شیراز", "تبریز", "کرج", "رشت", "اهواز", "قم", "کرمانشاه",
  "ارومیه", "زاهدان", "همدان", "یزد", "اردبیل", "بندرعباس", "اراک", "قزوین", "زنجان", "سنندج",
  "خرم‌آباد", "گرگان", "ساری", "بابل", "کاشان", "بوشهر", "کرمان", "بیرجند", "ایلام", "شهرکرد",
  "سمنان", "یاسوج", "قشم", "کیش", "سایر"
];

const USER_TYPE_LABELS = {
  cuckold: "کاکولد",
  hotwife: "هاتوایف",
  bull: "بول",
  unknown: "نمی‌دانم"
};

const POST_TYPE_MENU = [
  [{ text: "🖼 ارسال عکس در کانال", callback_data: "post:type:media" }],
  [{ text: "✍️ ارسال اعترافات در کانال", callback_data: "post:type:confession" }],
  [{ text: "↩️ برگشت", callback_data: "menu:help" }]
];

const ADMIN_MENU = [
  [{ text: "➕ افزودن زمان مشاوره", callback_data: "admin:add_slot" }],
  [{ text: "💧 افزودن زمان تخلیه آب بیغیرتی", callback_data: "admin:add_release_slot" }],
  [{ text: "🗓 زمان‌های فعال", callback_data: "admin:list_slots" }],
  [{ text: "🧾 بررسی اثبات کاکولدی", callback_data: "admin:list_proofs" }],
  [{ text: "✅ لیست کاکولدهای تایید شده", callback_data: "admin:list_verified_cuckolds" }],
  [{ text: "👥 لیست ثبت نامی‌ها", callback_data: "admin:list_profiles" }],
  [{ text: "📣 ارسال پیام به کاربران", callback_data: "admin:broadcast_start" }],
  [{ text: "📊 خروجی Excel درخواست‌ها", callback_data: "admin:export_bookings" }],
  [{ text: "📈 دریافت اکسل جامع", callback_data: "admin:export_comprehensive" }],
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
      await safeNotifyAdmin(env, `⚠️ Bot error\n\n${String(error?.stack || error)}`);
    }

    return new Response("OK");
  },

  async scheduled(controller, env, ctx) {
    ctx.waitUntil(Promise.all([
      sendDueBookingReminders(env),
      sendDueReleaseReminders(env)
    ]));
  }
};

async function handleMessage(message, env) {
  if (message.chat?.type !== "private") return;

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
    await sendMessage(env, chatId, "✅ عملیات لغو شد.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  const state = await getState(env, userId);

  if (state?.mode === "admin_add_slot") {
    await finishAddSlot(env, message, text);
    return;
  }

  if (state?.mode === "admin_add_release_slot") {
    await finishAddReleaseSlot(env, message, text);
    return;
  }

  if (state?.mode === "admin_broadcast_text") {
    await finishBroadcastText(env, message, text);
    return;
  }

  if (state?.mode === "reg_name") {
    await handleRegistrationName(env, message, text);
    return;
  }

  if (state?.mode === "reg_age") {
    await handleRegistrationAge(env, message, text);
    return;
  }

  if (state?.mode === "proof_voice") {
    await handleProofVoice(env, message, state);
    return;
  }

  if (state?.mode === "proof_selfie") {
    await handleProofSelfie(env, message, state);
    return;
  }

  if (state?.mode === "proof_partner_hijab") {
    await handleProofPartnerHijab(env, message, state);
    return;
  }

  if (state?.mode === "proof_partner_no_hijab") {
    await handleProofPartnerNoHijab(env, message, state);
    return;
  }

  if (state?.mode === "release_voice") {
    await handleReleaseVoice(env, message, state);
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

  if (state?.mode === "booking_phone") {
    await handleBookingPhone(env, message, state, text);
    return;
  }

  if (state?.mode === "booking_topic") {
    await handleBookingTopic(env, message, state, text);
    return;
  }

  if (state?.mode === "post_media_wait_media") {
    await handleMediaPostFile(env, message);
    return;
  }

  if (state?.mode === "post_media_wait_caption") {
    await handleMediaPostCaption(env, message, state, text);
    return;
  }

  if (state?.mode === "post_confession_text") {
    await handleConfessionPost(env, message, text);
    return;
  }

  await sendMessage(env, chatId, "از منوی زیر انتخاب کن:", keyboard(await getMainMenuForUser(env, userId)));
}

async function handleCallback(query, env) {
  const userId = String(query.from.id);
  const chatId = String(query.message.chat.id);
  const data = query.data || "";
  await answerCallback(env, query.id);

  if (query.message.chat?.type !== "private" && !data.startsWith("post:") && !data.startsWith("proof:")) return;

  if (data === "reg:start") {
    await startRegistration(env, chatId, userId, query.from);
    return;
  }

  if (data.startsWith("reg:gender:")) {
    await handleRegistrationGender(env, query, data.replace("reg:gender:", ""));
    return;
  }

  if (data.startsWith("reg:marital:")) {
    await handleRegistrationMarital(env, query, data.replace("reg:marital:", ""));
    return;
  }

  if (data.startsWith("reg:city:")) {
    await handleRegistrationCity(env, query, data.replace("reg:city:", ""));
    return;
  }

  if (data.startsWith("reg:type:")) {
    await finishRegistration(env, query, data.replace("reg:type:", ""));
    return;
  }

  if (data === "proof:start") {
    await startCuckoldProof(env, chatId, userId);
    return;
  }

  if (data === "vip:join") {
    await handleVipJoin(env, chatId, userId);
    return;
  }

  if (data === "release:start") {
    await startReleaseFlow(env, chatId, userId);
    return;
  }

  if (data.startsWith("proof:rel:")) {
    await handleProofRelationship(env, query, data.replace("proof:rel:", ""));
    return;
  }

  if (data === "proof:rel_done") {
    await finishProofRelationshipSelection(env, query);
    return;
  }

  if (data.startsWith("proof:approve:")) {
    if (!isAdmin(env, userId)) return;
    await approveProof(env, query, data.replace("proof:approve:", ""));
    return;
  }

  if (data.startsWith("proof:reject:")) {
    if (!isAdmin(env, userId)) return;
    await rejectProof(env, query, data.replace("proof:reject:", ""));
    return;
  }

  if (data.startsWith("proof:view:")) {
    if (!isAdmin(env, userId)) return;
    await viewProof(env, query, data.replace("proof:view:", ""));
    return;
  }

  if (data === "menu:help") {
    await sendHelp(env, chatId);
    return;
  }

  if (data === "menu:home") {
    await clearState(env, userId);
    await sendHome(env, chatId);
    return;
  }

  if (data === "menu:test") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startTest(env, chatId, userId);
    return;
  }

  if (data === "menu:booking") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startBooking(env, chatId, userId);
    return;
  }

  if (data === "menu:submit") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startPostSubmission(env, chatId, userId);
    return;
  }

  if (data === "post:type:media") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
    await startMediaPost(env, chatId, userId);
    return;
  }

  if (data === "post:type:confession") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startConfessionPost(env, chatId, userId);
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
    if (state?.mode === "release_slot") {
      await finishReleaseWithSlot(env, query, state, data.replace("slot:pick:", ""));
    } else {
      await finishBookingWithSlot(env, query, state, data.replace("slot:pick:", ""));
    }
    return;
  }

  if (data.startsWith("broadcast:send:")) {
    if (!isAdmin(env, userId)) return;
    await sendBroadcast(env, query, data.replace("broadcast:send:", ""));
    return;
  }

  if (data.startsWith("post:approve:")) {
    if (!isAdmin(env, userId)) return;
    await approvePost(env, query, data.replace("post:approve:", ""));
    return;
  }

  if (data.startsWith("post:reject:")) {
    if (!isAdmin(env, userId)) return;
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
  const profile = await getProfile(env, String(chatId));
  if (!profile?.registered) {
    await sendMessage(
      env,
      chatId,
      [
        "🔴⚫️ C CLUB",
        "",
        "برای استفاده از ربات، اول ثبت‌نام کوتاه را کامل کن.",
        "",
        "⚠️ فقط برای کاربران ۱۸ سال به بالا."
      ].join("\n"),
      keyboard(LOCKED_MENU)
    );
    return;
  }

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
    keyboard(await getMainMenuForUser(env, String(chatId)))
  );
}

async function sendHelp(env, chatId) {
  await sendMessage(
    env,
    chatId,
    [
      "ℹ️ راهنما",
      "",
      "برای فعال شدن امکانات باید ثبت‌نام را کامل کنی.",
      "بعد از ثبت‌نام، تست غیرت، نوبت مشاوره، ارسال عکس و ارسال اعتراف فعال می‌شود.",
      "عضویت VIP و تخلیه آب بیغیرتی فقط برای کاکولدهای تایید شده فعال است.",
      "",
      "لغو هر مسیر: /cancel"
    ].join("\n"),
    keyboard((await getProfile(env, String(chatId)))?.registered ? await getMainMenuForUser(env, String(chatId)) : LOCKED_MENU)
  );
}

async function startRegistration(env, chatId, userId, user) {
  await setState(env, userId, {
    mode: "reg_name",
    profile: {
      userId,
      username: user.username ? `@${user.username}` : "",
      firstName: user.first_name || ""
    }
  });
  await sendMessage(env, chatId, "📝 ثبت نام\n\nاسم یا اسم مستعار خودت را بفرست:");
}

async function handleRegistrationName(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const state = await getState(env, userId);
  const error = validateName(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nدوباره اسم را بفرست:`);
    return;
  }

  await setState(env, userId, {
    mode: "reg_age",
    profile: { ...state.profile, name: cleanText(text) }
  });
  await sendMessage(env, chatId, "🎂 سن خودت را به عدد بفرست.\n\nمثال: 29");
}

async function handleRegistrationAge(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const state = await getState(env, userId);
  const age = Number(cleanText(text));
  if (!Number.isInteger(age) || age < 18 || age > 80) {
    await sendMessage(env, chatId, "❌ سن باید عددی بین ۱۸ تا ۸۰ باشد. دوباره بفرست:");
    return;
  }

  await setState(env, userId, {
    mode: "reg_gender",
    profile: { ...state.profile, age }
  });
  await sendMessage(env, chatId, "⚧ جنسیت را انتخاب کن:", keyboard(GENDER_MENU));
}

async function handleRegistrationGender(env, query, gender) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.profile || !["female", "male"].includes(gender)) {
    await startRegistration(env, chatId, userId, query.from);
    return;
  }

  await setState(env, userId, {
    mode: "reg_marital",
    profile: { ...state.profile, gender }
  });
  await sendMessage(env, chatId, "💍 وضعیت تأهل را انتخاب کن:", keyboard(MARITAL_MENU));
}

async function handleRegistrationMarital(env, query, marital) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.profile || !["single", "married", "relationship"].includes(marital)) {
    await startRegistration(env, chatId, userId, query.from);
    return;
  }

  await setState(env, userId, {
    mode: "reg_city",
    profile: { ...state.profile, marital }
  });
  await sendMessage(env, chatId, "🏙 شهر را انتخاب کن:", keyboard(CITY_OPTIONS.map((city) => [
    { text: city, callback_data: `reg:city:${city}` }
  ])));
}

async function handleRegistrationCity(env, query, city) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.profile || !CITY_OPTIONS.includes(city)) {
    await startRegistration(env, chatId, userId, query.from);
    return;
  }

  const profile = { ...state.profile, city };
  await setState(env, userId, { mode: "reg_type", profile });
  await sendMessage(env, chatId, "🔖 نوع را انتخاب کن:", keyboard(getTypeMenu(profile.gender)));
}

async function finishRegistration(env, query, type) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  const allowedTypes = getAllowedTypes(state?.profile?.gender);
  if (!state?.profile || !allowedTypes.includes(type)) {
    await startRegistration(env, chatId, userId, query.from);
    return;
  }

  const profile = {
    ...state.profile,
    type,
    typeLabel: USER_TYPE_LABELS[type],
    registered: true,
    cuckoldVerified: false,
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`profile:${userId}`, JSON.stringify(profile));
  await putListItem(env, "profiles", profile);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [
      "✅ ثبت‌نام کامل شد.",
      "",
      `نام: ${profile.name}`,
      `آیدی: ${profile.username || "ندارد"}`,
      `سن: ${profile.age}`,
      `شهر: ${profile.city}`,
      `نوع: ${profile.typeLabel}`
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
}

async function startCuckoldProof(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (!profile?.registered || profile.type !== "cuckold" || profile.gender !== "male") {
    await sendMessage(env, chatId, "این بخش فقط برای کاربران مرد با نوع کاکولد فعال است.");
    return;
  }
  if (profile.cuckoldVerified) {
    await sendMessage(env, chatId, "✅ اثبات کاکولدی شما قبلاً تایید شده است.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  const pendingProof = await getPendingProofForUser(env, userId);
  if (pendingProof) {
    await sendMessage(
      env,
      chatId,
      [
        "⏳ شما یک درخواست اثبات در انتظار بررسی دارید.",
        "",
        `کد درخواست: ${pendingProof.id}`,
        "تا وقتی ادمین آن را تایید یا رد نکرده، نمی‌توانید درخواست جدید ثبت کنید."
      ].join("\n"),
      keyboard(await getMainMenuForUser(env, userId))
    );
    return;
  }

  await setState(env, userId, { mode: "proof_relationship", selected: [] });
  await sendMessage(
    env,
    chatId,
    [
      "🧾 اثبات کاکولدی",
      "",
      "برای تایید، چند مرحله کوتاه داری.",
      "کیفیت فایل‌ها مهم است؛ تصویر واضح، نور مناسب و چهره‌ها قابل تشخیص باشند.",
      "نکات اخلاقی رعایت شود.",
      "بعد از بررسی ادمین، شناسه فایل‌ها از حافظه ربات پاک می‌شود.",
      "",
      "۱) روی چه شخصی کاکولد هستی؟ می‌توانی چند گزینه را انتخاب کنی:"
    ].join("\n"),
    keyboard(proofRelationshipKeyboard([]))
  );
}

async function handleProofRelationship(env, query, relationship) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state || state.mode !== "proof_relationship") {
    await startCuckoldProof(env, chatId, userId);
    return;
  }

  const allowed = ["wife", "fiancee", "girlfriend"];
  if (!allowed.includes(relationship)) return;

  const selected = new Set(state.selected || []);
  if (selected.has(relationship)) selected.delete(relationship);
  else selected.add(relationship);

  const nextSelected = [...selected];
  await setState(env, userId, { ...state, selected: nextSelected });
  await sendMessage(env, chatId, "گزینه‌های انتخاب‌شده را بررسی کن:", keyboard(proofRelationshipKeyboard(nextSelected)));
}

async function finishProofRelationshipSelection(env, query) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.selected?.length) {
    await sendMessage(env, chatId, "حداقل یک گزینه را انتخاب کن.", keyboard(proofRelationshipKeyboard([])));
    return;
  }

  await setState(env, userId, {
    mode: "proof_voice",
    relationships: state.selected
  });
  await sendMessage(
    env,
    chatId,
    [
      "🎙 مرحله ۲: وویس فانتزی",
      "",
      "فانتزی کاکولدی‌ات را با وویس توضیح بده.",
      "بگو چه صحنه‌ای بیشتر تحریک‌ات می‌کند و چرا.",
      "وویس باید بین ۵ تا ۱۸۰ ثانیه باشد."
    ].join("\n")
  );
}

async function handleProofVoice(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const voice = message.voice;
  if (!voice?.file_id) {
    await sendMessage(env, chatId, "❌ لطفاً فقط وویس تلگرام بفرست.");
    return;
  }
  if (voice.duration < 5 || voice.duration > 180) {
    await sendMessage(env, chatId, "❌ وویس باید بین ۵ تا ۱۸۰ ثانیه باشد. دوباره بفرست:");
    return;
  }

  const target = proofTargetLabel(state.relationships);
  await setState(env, userId, {
    mode: "proof_selfie",
    relationships: state.relationships,
    voiceFileId: voice.file_id,
    voiceDuration: voice.duration,
    target
  });
  await sendMessage(
    env,
    chatId,
    [
      "📷 مرحله ۳: عکس دو نفره",
      "",
      `یک عکس دو نفره از خودت کنار ${target} بفرست.`,
      "چهره‌ها مشخص، کیفیت خوب، نور مناسب.",
      "",
      "بعد از بررسی ادمین، شناسه فایل از حافظه ربات پاک می‌شود."
    ].join("\n")
  );
}

async function handleProofSelfie(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ لطفاً یک عکس معمولی و غیرصریح بفرست.");
    return;
  }

  const profile = await getProfile(env, userId);
  const photo = message.photo[message.photo.length - 1];
  await setState(env, userId, {
    ...state,
    mode: "proof_partner_hijab",
    selfiePhotoFileId: photo.file_id
  });

  await sendMessage(
    env,
    chatId,
    [
      "🧕 مرحله ۴: عکس با حجاب",
      "",
      `یک عکس با حجاب از ${state.target || proofTargetLabel(state.relationships)} بفرست.`,
      "کیفیت خوب، چهره واضح، نکات اخلاقی رعایت شود.",
      "بعد از بررسی ادمین، شناسه فایل از حافظه ربات پاک می‌شود."
    ].join("\n")
  );
}

async function handleProofPartnerHijab(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ لطفاً عکس با کیفیت قابل قبول بفرست.");
    return;
  }

  const photo = message.photo[message.photo.length - 1];
  await setState(env, userId, {
    ...state,
    mode: "proof_partner_no_hijab",
    partnerHijabPhotoFileId: photo.file_id
  });

  await sendMessage(
    env,
    chatId,
    [
      "💫 مرحله ۵: عکس بدون حجاب",
      "",
      `یک عکس بدون حجاب از ${state.target || proofTargetLabel(state.relationships)} بفرست.`,
      "کیفیت خوب، چهره واضح، نکات اخلاقی رعایت شود.",
      "بعد از بررسی ادمین، شناسه فایل از حافظه ربات پاک می‌شود."
    ].join("\n")
  );
}

async function handleProofPartnerNoHijab(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ لطفاً عکس با کیفیت قابل قبول بفرست.");
    return;
  }

  const profile = await getProfile(env, userId);
  const proofId = shortId();
  const photo = message.photo[message.photo.length - 1];
  const proof = {
    id: proofId,
    userId,
    username: message.from.username || "",
    firstName: message.from.first_name || "",
    relationships: state.relationships,
    voiceFileId: state.voiceFileId,
    voiceDuration: state.voiceDuration,
    selfiePhotoFileId: state.selfiePhotoFileId,
    partnerHijabPhotoFileId: state.partnerHijabPhotoFileId,
    partnerNoHijabPhotoFileId: photo.file_id,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await putListItem(env, "proofs", proof);
  await clearState(env, userId);

  await sendMessage(env, chatId, "✅ اطلاعات ثبت شد و منتظر تایید ادمین بمان.", keyboard(await getMainMenuForUser(env, userId)));
  await sendProofToAdmin(env, proof, profile, message.from);
}

async function sendProofToAdmin(env, proof, profile, user) {
  const controls = keyboard([[
    { text: "✅ تایید کاکولد", callback_data: `proof:approve:${proof.id}` },
    { text: "❌ رد", callback_data: `proof:reject:${proof.id}` }
  ]]);

  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    [
      "🧾 درخواست اثبات کاکولدی",
      "",
      `کد: ${proof.id}`,
      `کاربر: ${formatUser(user)}`,
      `نام ثبت‌نام: ${profile?.name || "-"}`,
      `سن: ${profile?.age || "-"}`,
      `شهر: ${profile?.city || "-"}`,
      `گزینه‌ها: ${proof.relationships.map(proofRelationshipLabel).join("، ")}`
    ].join("\n")
  );
  await sendVoice(env, env.ADMIN_CHAT_ID, proof.voiceFileId, `🎙 وویس اثبات - کد ${proof.id}`);
  await sendPhoto(env, env.ADMIN_CHAT_ID, proof.selfiePhotoFileId, `📷 عکس ۱: دو نفره - کد ${proof.id}`);
  await sendPhoto(env, env.ADMIN_CHAT_ID, proof.partnerHijabPhotoFileId, `🧕 عکس ۲: با حجاب - کد ${proof.id}`);
  await sendPhoto(env, env.ADMIN_CHAT_ID, proof.partnerNoHijabPhotoFileId, `💫 عکس ۳: بدون حجاب - کد ${proof.id}`, controls);
}

async function approveProof(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  proof.status = "approved";
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedBy = String(query.from.id);
  proof.voiceFileId = "";
  proof.selfiePhotoFileId = "";
  proof.partnerHijabPhotoFileId = "";
  proof.partnerNoHijabPhotoFileId = "";
  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await updateListItem(env, "proofs", proofId, (item) => ({ ...item, status: "approved", reviewedAt: proof.reviewedAt, reviewedBy: proof.reviewedBy }));

  const profile = await getProfile(env, proof.userId);
  if (profile) {
    profile.cuckoldVerified = true;
    profile.cuckoldVerifiedAt = proof.reviewedAt;
    await env.BOT_KV.put(`profile:${proof.userId}`, JSON.stringify(profile));
  }

  await sendMessage(env, proof.userId, "✅ تایید شد. شما به عنوان کاکولد ثبت نام شدید و اکنون می‌توانید از همه قابلیت‌های ربات استفاده کنید.", keyboard(await getMainMenuForUser(env, proof.userId)));
  await sendMessage(env, chatId, `✅ درخواست تایید شد.\nکد: ${proofId}`);
}

async function rejectProof(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  proof.status = "rejected";
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedBy = String(query.from.id);
  proof.voiceFileId = "";
  proof.selfiePhotoFileId = "";
  proof.partnerHijabPhotoFileId = "";
  proof.partnerNoHijabPhotoFileId = "";
  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await updateListItem(env, "proofs", proofId, (item) => ({ ...item, status: "rejected", reviewedAt: proof.reviewedAt, reviewedBy: proof.reviewedBy }));

  await sendMessage(env, proof.userId, "❌ درخواست اثبات کاکولدی تایید نشد.");
  await sendMessage(env, chatId, `❌ درخواست رد شد.\nکد: ${proofId}`);
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
      "🧪 تست غیرت",
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
    await sendMessage(env, chatId, "برای شروع آزمون از منو استفاده کن.", keyboard(await getMainMenuForUser(env, userId)));
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
    keyboard(await getMainMenuForUser(env, userId))
  );
}

async function startBooking(env, chatId, userId) {
  if (!(await checkCooldown(env, userId, "booking", BOOKING_COOLDOWN_SECONDS))) {
    await sendMessage(env, chatId, "⏳ درخواست نوبت خیلی سریع تکرار شده. کمی بعد دوباره امتحان کن.");
    return;
  }

  const slots = await getOpenSlots(env, 12, "consultation");
  if (!slots.length) {
    await sendMessage(env, chatId, "📅 فعلاً زمان آزادی برای مشاوره ثبت نشده. بعداً دوباره چک کن.", keyboard(await getMainMenuForUser(env, userId)));
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
  const username = message.from.username ? `@${message.from.username}` : "";
  if (username) {
    await setState(env, userId, { mode: "booking_topic", name: cleanText(text), contact: username });
    await sendMessage(env, chatId, `✅ آیدی تلگرامت خودکار دریافت شد: ${username}\n\n🧩 موضوع مشاوره را کوتاه بنویس.\n\nحداقل ۱۰ و حداکثر ۵۰۰ کاراکتر.`);
    return;
  }

  await setState(env, userId, { mode: "booking_phone", name: cleanText(text) });
  await sendMessage(env, chatId, "📱 چون آیدی تلگرام قابل دریافت نیست، شماره تماس را بفرست.\n\nمثال: 09121234567");
}

async function handleBookingPhone(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validatePhone(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nشماره تماس معتبر بفرست:`);
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

  const slots = await getOpenSlots(env, 12, "consultation");
  if (!slots.length) {
    await clearState(env, userId);
    await sendMessage(env, chatId, "متأسفانه همین الان زمان آزادی باقی نمانده.", keyboard(await getMainMenuForUser(env, userId)));
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
    await sendMessage(env, chatId, "این زمان دیگر آزاد نیست. دوباره نوبت مشاوره را شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
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
    startsAt: slot.startsAt || "",
    reminderSent: false,
    status: "scheduled",
    createdAt: new Date().toISOString()
  };

  slot.status = "booked";
  slot.bookedBy = userId;
  slot.bookingId = bookingId;
  await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
  await updateListItem(env, "slots", slotId, (item) => ({ ...item, status: "booked", bookedBy: userId, bookingId }));
  await env.BOT_KV.put(`booking:${bookingId}`, JSON.stringify(booking));
  await putListItem(env, "bookings", booking);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [`✅ نوبتت ثبت شد`, "", `کد: ${bookingId}`, `زمان: ${slot.label}`, "", "لطفاً در همین زمان آماده باش."].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
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

async function handleVipJoin(env, chatId, userId) {
  if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;

  await sendMessage(
    env,
    chatId,
    [
      "🔞 عضویت VIP کاکولدی",
      "",
      "کاکولدی شما تایید شده است.",
      "لینک عضویت:",
      "https://t.me/+-0j3TCOzQMM1ZjJk"
    ].join("\n")
  );
}

async function startReleaseFlow(env, chatId, userId) {
  if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;

  await setState(env, userId, { mode: "release_voice" });
  await sendMessage(
    env,
    chatId,
    [
      "💧 تخلیه آب بیغیرتی",
      "",
      "یک وویس بفرست و دقیقاً بگو:",
      "«آب بیغیرتیم زده بالا بیا کمکم کن»",
      "",
      "بعد از وویس، زمان آزاد را انتخاب می‌کنی."
    ].join("\n")
  );
}

async function handleReleaseVoice(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const voice = message.voice;
  if (!voice?.file_id) {
    await sendMessage(env, chatId, "❌ لطفاً فقط وویس تلگرام بفرست.");
    return;
  }
  if (voice.duration < 2 || voice.duration > 120) {
    await sendMessage(env, chatId, "❌ وویس باید بین ۲ تا ۱۲۰ ثانیه باشد. دوباره بفرست:");
    return;
  }

  const slots = await getOpenSlots(env, 12, "release");
  if (!slots.length) {
    await clearState(env, userId);
    await sendMessage(env, chatId, "فعلاً زمان آزادی برای این درخواست ثبت نشده.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  await setState(env, userId, {
    mode: "release_slot",
    voiceFileId: voice.file_id,
    voiceDuration: voice.duration
  });
  await sendMessage(env, chatId, "🗓 زمان آزاد را انتخاب کن:", keyboard(slots.slice(0, 12).map((slot) => [
    { text: slot.label, callback_data: `slot:pick:${slot.id}` }
  ])));
}

async function finishReleaseWithSlot(env, query, state, slotId) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  if (!state || state.mode !== "release_slot") {
    await sendMessage(env, chatId, "برای ثبت درخواست تخلیه، از منو شروع کن.");
    return;
  }

  const slot = await getJson(env, `slot:${slotId}`);
  if (!slot || slot.status !== "open") {
    await sendMessage(env, chatId, "این زمان دیگر آزاد نیست. دوباره از منو شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
    await clearState(env, userId);
    return;
  }

  const requestId = shortId();
  const request = {
    id: requestId,
    userId,
    username: query.from.username || "",
    firstName: query.from.first_name || "",
    voiceFileId: state.voiceFileId,
    voiceDuration: state.voiceDuration,
    slotId,
    slotLabel: slot.label,
    startsAt: slot.startsAt || "",
    status: "scheduled",
    type: "release",
    reminderSent: false,
    createdAt: new Date().toISOString()
  };

  slot.status = "booked";
  slot.bookedBy = userId;
  slot.releaseRequestId = requestId;
  await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
  await updateListItem(env, "slots", slotId, (item) => ({ ...item, status: "booked", bookedBy: userId, releaseRequestId: requestId }));
  await env.BOT_KV.put(`release:${requestId}`, JSON.stringify(request));
  await putListItem(env, "release_requests", request);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [`✅ درخواست ثبت شد`, "", `کد: ${requestId}`, `زمان: ${slot.label}`].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );

  await notifyAdmin(
    env,
    [
      "💧 درخواست تخلیه آب بیغیرتی",
      "",
      `کد: ${requestId}`,
      `زمان: ${slot.label}`,
      `کاربر: ${formatUser(query.from)}`
    ].join("\n")
  );
  await sendVoice(env, env.ADMIN_CHAT_ID, state.voiceFileId, `🎙 وویس تخلیه - کد ${requestId}`);
}

async function startPostSubmission(env, chatId, userId) {
  if (!(await checkCooldown(env, userId, "post", POST_COOLDOWN_SECONDS))) {
    await sendMessage(env, chatId, "⏳ برای جلوگیری از اسپم، بین ارسال پست‌ها کمی فاصله بگذار.");
    return;
  }

  await sendMessage(
    env,
    chatId,
    [
      "📝 ارسال محتوا",
      "",
      "نوع پست را انتخاب کن:",
      "",
      "🖼 عکس: اول فایل، بعد کپشن",
      "✍️ اعترافات: فقط متن، حداقل ۱۰ کلمه"
    ].join("\n"),
    keyboard(POST_TYPE_MENU)
  );
}

async function startMediaPost(env, chatId, userId) {
  await setState(env, userId, { mode: "post_media_wait_media" });
  await sendMessage(
    env,
    chatId,
    [
      "🖼 ارسال عکس",
      "",
      "اول خود عکس را بفرست.",
      "بعد از دریافت فایل، کپشن را جداگانه می‌پرسم.",
      "",
      "لغو: /cancel"
    ].join("\n")
  );
}

async function startConfessionPost(env, chatId, userId) {
  await setState(env, userId, { mode: "post_confession_text" });
  await sendMessage(
    env,
    chatId,
    [
      "✍️ ارسال اعترافات",
      "",
      "متن اعتراف را بفرست.",
      "حداقل متن: ۱۰ کلمه",
      "",
      "لغو: /cancel"
    ].join("\n")
  );
}

async function handleMediaPostFile(env, message) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const media = normalizeMediaFile(message);

  if (!media.ok) {
    await sendMessage(env, chatId, `❌ ${media.error}\n\nفقط عکس بفرست.`);
    return;
  }

  await setState(env, userId, { mode: "post_media_wait_caption", media });
  await sendMessage(env, chatId, "✅ فایل دریافت شد.\n\nحالا کپشن پست را بفرست.");
}

async function handleMediaPostCaption(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const caption = cleanText(text);
  const limit = MAX_PHOTO_CAPTION_LENGTH;

  if (!caption || caption.length < 5) {
    await sendMessage(env, chatId, "❌ کپشن خیلی کوتاه است. حداقل ۵ کاراکتر بفرست:");
    return;
  }
  if (caption.length > limit) {
    await sendMessage(env, chatId, `❌ کپشن باید حداکثر ${limit} کاراکتر باشد. کوتاه‌ترش کن:`);
    return;
  }

  const post = {
    kind: state.media.kind,
    fileId: state.media.fileId,
    rawText: caption,
    finalText: buildMediaCaption(caption)
  };

  await savePostAndPreview(env, message, post);
}

async function handleConfessionPost(env, message, text) {
  const chatId = String(message.chat.id);
  const confession = cleanText(text);

  if (!message.text || confession.startsWith("/")) {
    await sendMessage(env, chatId, "❌ برای اعترافات فقط متن معمولی بفرست.");
    return;
  }

  if (wordCount(confession) < 10) {
    await sendMessage(env, chatId, "❌ متن اعتراف باید حداقل ۱۰ کلمه باشد. کامل‌تر بنویس:");
    return;
  }

  if (confession.length > MAX_TEXT_LENGTH) {
    await sendMessage(env, chatId, `❌ متن بیشتر از ${MAX_TEXT_LENGTH} کاراکتر است. کوتاه‌ترش کن:`);
    return;
  }

  await savePostAndPreview(env, message, {
    kind: "confession",
    fileId: "",
    rawText: confession,
    finalText: buildConfessionText(confession)
  });
}

async function savePostAndPreview(env, message, post) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const contentHash = await sha256(`${userId}:${post.kind}:${post.rawText}:${post.fileId || ""}`);
  const duplicate = await env.BOT_KV.get(`post_hash:${contentHash}`);
  if (duplicate) {
    await sendMessage(env, chatId, "❌ این پست تکراری است و دوباره ثبت نمی‌شود.", keyboard(await getMainMenuForUser(env, userId)));
    await clearState(env, userId);
    return;
  }

  const postId = shortId();
  const record = {
    id: postId,
    userId,
    username: message.from.username || "",
    firstName: message.from.first_name || "",
    kind: post.kind,
    text: post.rawText,
    finalText: post.finalText,
    fileId: post.fileId || "",
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(record));
  await env.BOT_KV.put(`post_hash:${contentHash}`, postId, { expirationTtl: 60 * 60 * 24 * 14 });
  await putListItem(env, "posts", record);
  await clearState(env, userId);

  await sendMessage(env, chatId, "✅ پست برای ادمین ارسال شد. نتیجه بعد از بررسی اعلام می‌شود.", keyboard(await getMainMenuForUser(env, userId)));
  await sendAdminPostPreview(env, record, message.from);
}

async function sendAdminPostPreview(env, post, user) {
  const adminText = [
    "📝 پست جدید برای تایید",
    "",
    `کد: ${post.id}`,
    `کاربر: ${formatUser(user)}`,
    `نوع: ${postTypeLabel(post.kind)}`,
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

  if (post.kind === "video") {
    await sendVideo(env, env.ADMIN_CHAT_ID, post.fileId, post.finalText, controls);
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

  const targetChannel = env.CHANNEL_ID || CHANNEL_USERNAME;
  try {
    if (post.kind === "photo") {
      await sendPhoto(env, targetChannel, post.fileId, post.finalText);
    } else if (post.kind === "video") {
      await sendVideo(env, targetChannel, post.fileId, post.finalText);
    } else {
      await sendMessage(env, targetChannel, post.finalText);
    }
  } catch (error) {
    await sendMessage(
      env,
      chatId,
      [
        "❌ ارسال به کانال انجام نشد.",
        "",
        `کانال هدف: ${targetChannel}`,
        "ربات باید داخل کانال ادمین باشد و اجازه Post Messages داشته باشد.",
        "",
        String(error?.message || error)
      ].join("\n")
    );
    return;
  }

  post.status = "approved";
  post.approvedAt = new Date().toISOString();
  post.approvedBy = String(query.from.id);
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));

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
      "➕ زمان مشاوره را دقیق وارد کن.\n\nفرمت پیشنهادی:\n2026-07-22 20:30\n\nساعت بر اساس تهران ذخیره می‌شود.\nلغو: /cancel"
    );
    return;
  }

  if (data === "admin:add_release_slot") {
    await setState(env, String(query.from.id), { mode: "admin_add_release_slot" });
    await sendMessage(
      env,
      chatId,
      "💧 زمان تخلیه آب بیغیرتی را وارد کن.\n\nفرمت:\n2026-07-22 20:30\n\nلغو: /cancel"
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

  if (data === "admin:list_proofs") {
    await listPendingProofs(env, chatId);
    return;
  }

  if (data === "admin:list_verified_cuckolds") {
    await listVerifiedCuckolds(env, chatId);
    return;
  }

  if (data === "admin:list_profiles") {
    await listProfiles(env, chatId);
    return;
  }

  if (data === "admin:broadcast_start") {
    await setState(env, String(query.from.id), { mode: "admin_broadcast_text" });
    await sendMessage(env, chatId, "📣 متن پیام را بفرست.\n\nبعد از آن گروه دریافت‌کننده را انتخاب می‌کنی.\nلغو: /cancel");
    return;
  }

  if (data === "admin:export_profiles") {
    await exportProfiles(env, chatId);
    return;
  }

  if (data === "admin:export_verified_cuckolds") {
    await exportVerifiedCuckolds(env, chatId);
    return;
  }

  if (data === "admin:export_comprehensive") {
    await exportComprehensive(env, chatId);
    return;
  }

  if (data === "admin:stats") {
    const bookings = await getList(env, "bookings");
    const posts = await getList(env, "posts");
    const tests = await getList(env, "test_results");
    const profiles = await getProfiles(env);
    const proofs = await getProofs(env);
    const pendingProofs = proofs.filter((proof) => proof.status === "pending");
    const releases = await getList(env, "release_requests");
    const verified = profiles.filter((profile) => profile.cuckoldVerified);
    await sendMessage(
      env,
      chatId,
      [
        `📦 آمار سریع`,
        "",
        `ثبت‌نامی‌ها: ${profiles.length}`,
        `کاکولدهای تایید شده: ${verified.length}`,
        `درخواست‌های اثبات: ${proofs.length}`,
        `اثبات‌های در انتظار: ${pendingProofs.length}`,
        `نوبت‌های مشاوره: ${bookings.length}`,
        `درخواست‌های تخلیه: ${releases.length}`,
        `پست‌ها: ${posts.length}`,
        `نتایج تست غیرت: ${tests.length}`
      ].join("\n"),
      keyboard(ADMIN_MENU)
    );
  }
}

async function finishAddSlot(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const slotLabel = cleanText(text);
  const startsAt = parseTehranDateTime(slotLabel);
  if (!startsAt) {
    await sendMessage(env, chatId, "❌ زمان را با فرمت دقیق بفرست:\n\n2026-07-22 20:30");
    return;
  }

  const slot = {
    id: shortId(),
    label: formatTehranSlot(startsAt),
    startsAt,
    purpose: "consultation",
    status: "open",
    createdAt: new Date().toISOString(),
    createdBy: userId
  };
  await env.BOT_KV.put(`slot:${slot.id}`, JSON.stringify(slot));
  await putListItem(env, "slots", slot);
  await clearState(env, userId);
  await sendMessage(env, chatId, `✅ زمان اضافه شد:\n${slot.label}`, keyboard(ADMIN_MENU));
}

async function finishAddReleaseSlot(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const slotLabel = cleanText(text);
  const startsAt = parseTehranDateTime(slotLabel);
  if (!startsAt) {
    await sendMessage(env, chatId, "❌ زمان را با فرمت دقیق بفرست:\n\n2026-07-22 20:30");
    return;
  }

  const slot = {
    id: shortId(),
    label: formatTehranSlot(startsAt),
    startsAt,
    purpose: "release",
    status: "open",
    createdAt: new Date().toISOString(),
    createdBy: userId
  };
  await env.BOT_KV.put(`slot:${slot.id}`, JSON.stringify(slot));
  await putListItem(env, "slots", slot);
  await clearState(env, userId);
  await sendMessage(env, chatId, `✅ زمان تخلیه اضافه شد:\n${slot.label}`, keyboard(ADMIN_MENU));
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
  await updateListItem(env, "slots", slotId, (item) => ({ ...item, status: "closed", closedAt: slot.closedAt }));
  await sendMessage(env, chatId, `✅ زمان بسته شد:\n${slot.label}`, keyboard(ADMIN_MENU));
}

async function sendAdminPanel(env, chatId) {
  await sendMessage(env, chatId, "🛠 پنل ادمین\n\nچه کاری می‌خواهی انجام بدهی؟", keyboard(ADMIN_MENU));
}

async function listPendingProofs(env, chatId) {
  const proofs = (await getPendingProofs(env)).slice(-10).reverse();
  if (!proofs.length) {
    await sendMessage(env, chatId, "درخواست اثبات در انتظار بررسی نداریم.", keyboard(ADMIN_MENU));
    return;
  }

  const rows = [];
  const lines = ["🧾 درخواست‌های اثبات در انتظار", ""];
  for (const proof of proofs) {
    const profile = await getProfile(env, proof.userId);
    lines.push(`${formatDateTime(proof.createdAt)} | ${profile?.name || proof.firstName || "-"} | ${proof.username ? `@${proof.username}` : proof.userId}`);
    rows.push([{ text: `👁 مشاهده ${profile?.name || proof.firstName || proof.id}`, callback_data: `proof:view:${proof.id}` }]);
    rows.push([
      { text: `✅ تایید ${profile?.name || proof.firstName || proof.id}`, callback_data: `proof:approve:${proof.id}` },
      { text: `❌ رد`, callback_data: `proof:reject:${proof.id}` }
    ]);
  }

  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function viewProof(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست دیگر در انتظار بررسی نیست.", keyboard(ADMIN_MENU));
    return;
  }
  const profile = await getProfile(env, proof.userId);
  await sendProofToAdmin(env, proof, profile, {
    id: proof.userId,
    username: proof.username,
    first_name: proof.firstName
  });
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
  await sendCsv(env, chatId, `bookings-${today()}.csv`, rows, "📊 فایل خروجی درخواست‌های مشاوره؛ در Excel باز می‌شود.");
}

async function listVerifiedCuckolds(env, chatId) {
  const profiles = (await getProfiles(env)).filter((profile) => profile.cuckoldVerified);
  if (!profiles.length) {
    await sendMessage(env, chatId, "هنوز کاکولد تایید شده نداریم.", keyboard(ADMIN_MENU));
    return;
  }

  await sendMessage(env, chatId, formatProfilesTable("✅ کاکولدهای تایید شده", profiles), keyboard([
    [{ text: "📥 Excel کاکولدهای تایید شده", callback_data: "admin:export_verified_cuckolds" }],
    [{ text: "↩️ پنل ادمین", callback_data: "admin:stats" }]
  ]));
}

async function listProfiles(env, chatId) {
  const profiles = await getProfiles(env);
  if (!profiles.length) {
    await sendMessage(env, chatId, "هنوز ثبت‌نامی نداریم.", keyboard(ADMIN_MENU));
    return;
  }

  await sendMessage(env, chatId, formatProfilesTable("👥 ثبت‌نامی‌ها", profiles), keyboard([
    [{ text: "📥 Excel ثبت‌نامی‌ها", callback_data: "admin:export_profiles" }],
    [{ text: "↩️ پنل ادمین", callback_data: "admin:stats" }]
  ]));
}

async function finishBroadcastText(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const body = cleanText(text);
  if (body.length < 2 || body.length > 3500) {
    await sendMessage(env, chatId, "❌ متن پیام باید بین ۲ تا ۳۵۰۰ کاراکتر باشد. دوباره بفرست:");
    return;
  }

  await setState(env, userId, { mode: "admin_broadcast_target", body });
  await sendMessage(env, chatId, "گیرنده‌ها را انتخاب کن:", keyboard([
    [{ text: "همه کاربران", callback_data: "broadcast:send:all" }],
    [{ text: "همه کاکولدها", callback_data: "broadcast:send:cuckolds" }],
    [{ text: "کاکولدهای تایید شده", callback_data: "broadcast:send:verified_cuckolds" }],
    [{ text: "لغو", callback_data: "menu:home" }]
  ]));
}

async function sendBroadcast(env, query, target) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  if (!isAdmin(env, userId)) return;

  const state = await getState(env, userId);
  if (!state?.body) {
    await sendMessage(env, chatId, "متن پیام پیدا نشد. دوباره از پنل ادمین شروع کن.", keyboard(ADMIN_MENU));
    return;
  }

  const profiles = await getProfiles(env);
  const recipients = profiles.filter((profile) => {
    if (target === "all") return true;
    if (target === "cuckolds") return profile.type === "cuckold";
    if (target === "verified_cuckolds") return profile.type === "cuckold" && profile.cuckoldVerified;
    return false;
  });

  let sent = 0;
  let failed = 0;
  for (const profile of recipients) {
    try {
      await sendMessage(env, profile.userId, state.body);
      sent += 1;
    } catch {
      failed += 1;
    }
  }

  await clearState(env, userId);
  await sendMessage(env, chatId, `📣 ارسال پیام تمام شد.\n\nارسال موفق: ${sent}\nناموفق: ${failed}`, keyboard(ADMIN_MENU));
}

async function exportProfiles(env, chatId) {
  const profiles = await getProfiles(env);
  await sendCsv(env, chatId, `profiles-${today()}.csv`, profileRows(profiles), "📥 Excel ثبت‌نامی‌ها");
}

async function exportVerifiedCuckolds(env, chatId) {
  const profiles = (await getProfiles(env)).filter((profile) => profile.cuckoldVerified);
  await sendCsv(env, chatId, `verified-cuckolds-${today()}.csv`, profileRows(profiles), "📥 Excel کاکولدهای تایید شده");
}

async function exportComprehensive(env, chatId) {
  const profiles = await getProfiles(env);
  const bookings = await getList(env, "bookings");
  const releases = await getList(env, "release_requests");
  const posts = await getList(env, "posts");
  const tests = await getList(env, "test_results");
  const proofs = await getProofs(env);

  const rows = [
    ["user_id", "name", "username", "age", "gender", "marital", "city", "type", "cuckold_verified", "registered_at", "test_count", "last_test_percent", "booking_count", "release_count", "post_count", "proof_statuses"],
    ...profiles.map((profile) => {
      const userTests = tests.filter((item) => item.userId === profile.userId);
      const lastTest = userTests[userTests.length - 1];
      return [
        profile.userId,
        profile.name,
        profile.username,
        profile.age,
        profile.gender,
        profile.marital,
        profile.city,
        profile.typeLabel || profile.type,
        profile.cuckoldVerified ? "yes" : "no",
        profile.createdAt,
        userTests.length,
        lastTest?.percent ?? "",
        bookings.filter((item) => item.userId === profile.userId).length,
        releases.filter((item) => item.userId === profile.userId).length,
        posts.filter((item) => item.userId === profile.userId).length,
        proofs.filter((item) => item.userId === profile.userId).map((item) => item.status).join("|")
      ];
    })
  ];

  await sendCsv(env, chatId, `comprehensive-users-${today()}.csv`, rows, "📈 Excel جامع کاربران");
}

function normalizeMediaFile(message) {
  if (message.photo?.length) {
    const largestPhoto = message.photo[message.photo.length - 1];
    return { ok: true, kind: "photo", fileId: largestPhoto.file_id };
  }

  return { ok: false, error: "نوع فایل درست نیست." };
}

function buildMediaCaption(caption) {
  return ["C CLUB", "", "#عکس_ارسالی", cleanText(caption), CHANNEL_USERNAME, `instagram: ${INSTAGRAM_URL}`].join("\n");
}

function buildConfessionText(text) {
  return ["#اعترافات_شما", cleanText(text), CHANNEL_USERNAME, `instagram: ${INSTAGRAM_URL}`].join("\n");
}

function postTypeLabel(kind) {
  if (kind === "photo") return "عکس";
  if (kind === "video") return "فیلم";
  if (kind === "confession") return "اعترافات";
  return kind;
}

function validateName(value) {
  const text = cleanText(value);
  if (text.length < 2) return "نام خیلی کوتاه است.";
  if (text.length > 60) return "نام خیلی طولانی است.";
  if (/https?:\/\/|t\.me|telegram\.me/i.test(text)) return "داخل نام لینک نفرست.";
  return "";
}

function validatePhone(value) {
  const text = cleanText(value);
  const phone = /^\+?\d[\d\s-]{7,18}$/.test(text);
  if (!phone) return "شماره تماس معتبر نیست.";
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

async function getOpenSlots(env, limit = 12, purpose = "") {
  const slotRefs = await getList(env, "slots");
  const slots = [];
  for (const slotRef of slotRefs) {
    const latest = await getJson(env, `slot:${slotRef.id}`);
    if (latest) slots.push(latest);
  }
  const now = Date.now();
  return slots
    .filter((slot) => slot.status === "open")
    .filter((slot) => !purpose || (slot.purpose || "consultation") === purpose)
    .filter((slot) => !slot.startsAt || Date.parse(slot.startsAt) > now)
    .sort((a, b) => Date.parse(a.startsAt || "9999-12-31") - Date.parse(b.startsAt || "9999-12-31"))
    .slice(0, limit);
}

async function putListItem(env, listName, item) {
  const list = await getList(env, listName);
  list.push(item);
  const trimmed = list.slice(-500);
  await env.BOT_KV.put(`list:${listName}`, JSON.stringify(trimmed));
}

async function updateListItem(env, listName, itemId, updater) {
  const list = await getList(env, listName);
  const updated = list.map((item) => item.id === itemId ? updater(item) : item);
  await env.BOT_KV.put(`list:${listName}`, JSON.stringify(updated));
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

async function getProfile(env, userId) {
  return getJson(env, `profile:${userId}`);
}

async function getProfiles(env) {
  const refs = await getList(env, "profiles");
  const byUser = new Map();
  for (const ref of refs) {
    const latest = await getProfile(env, ref.userId);
    if (latest?.registered) byUser.set(latest.userId, latest);
  }
  return [...byUser.values()];
}

async function getProofs(env) {
  const refs = await getList(env, "proofs");
  const byId = new Map();
  for (const ref of refs) {
    const latest = await getJson(env, `proof:${ref.id}`);
    if (latest) byId.set(latest.id, latest);
  }
  return [...byId.values()];
}

async function getPendingProofs(env) {
  return (await getProofs(env)).filter((proof) => proof.status === "pending");
}

async function getPendingProofForUser(env, userId) {
  return (await getPendingProofs(env)).find((proof) => String(proof.userId) === String(userId));
}

async function ensureRegistered(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (profile?.registered) return true;

  await sendMessage(env, chatId, "🔒 برای استفاده از این بخش، اول ثبت‌نام را کامل کن.", keyboard(LOCKED_MENU));
  return false;
}

async function ensureVerifiedCuckold(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (profile?.registered && profile.gender === "male" && profile.type === "cuckold" && profile.cuckoldVerified) {
    return true;
  }

  await sendMessage(
    env,
    chatId,
    [
      "⛔️ کاکولدی شما تایید نشده است.",
      "",
      "این بخش فقط برای کاکولدهای تایید شده فعال است.",
      "اگر کاکولد هستی، اول از دکمه «اثبات کاکولدی» اقدام کن."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
  return false;
}

async function getMainMenuForUser(env, userId) {
  const profile = await getProfile(env, userId);
  if (!profile?.registered) return LOCKED_MENU;

  const rows = [...MAIN_MENU];
  if (profile.gender === "male" && profile.type === "cuckold" && !profile.cuckoldVerified) {
    rows.splice(1, 0, [{ text: "🧾 اثبات کاکولدی", callback_data: "proof:start" }]);
  }
  return rows;
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

function formatProfilesTable(title, profiles) {
  const lines = [title, ""];
  for (const profile of profiles.slice(0, 30)) {
    lines.push(`${profile.name || "-"} | ${profile.username || "-"} | ${profile.age || "-"} | ${profile.city || "-"} | ${profile.typeLabel || profile.type || "-"} | ${profile.cuckoldVerified ? "تایید" : "بدون تایید"}`);
  }
  if (profiles.length > 30) lines.push(`... و ${profiles.length - 30} مورد دیگر`);
  return lines.join("\n");
}

function profileRows(profiles) {
  return [
    ["user_id", "name", "username", "age", "gender", "marital", "city", "type", "cuckold_verified", "registered_at"],
    ...profiles.map((profile) => [
      profile.userId,
      profile.name,
      profile.username,
      profile.age,
      profile.gender,
      profile.marital,
      profile.city,
      profile.typeLabel || profile.type,
      profile.cuckoldVerified ? "yes" : "no",
      profile.createdAt
    ])
  ];
}

function formatDateTime(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: "Asia/Tehran",
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(value));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function wordCount(value) {
  return cleanText(value).split(/\s+/).filter(Boolean).length;
}

function getAllowedTypes(gender) {
  if (gender === "female") return ["hotwife", "unknown"];
  if (gender === "male") return ["cuckold", "bull", "unknown"];
  return ["unknown"];
}

function getTypeMenu(gender) {
  return getAllowedTypes(gender).map((type) => [
    { text: USER_TYPE_LABELS[type], callback_data: `reg:type:${type}` }
  ]);
}

function proofRelationshipLabel(value) {
  const labels = {
    wife: "همسر",
    fiancee: "نامزد",
    girlfriend: "دوست دختر"
  };
  return labels[value] || value;
}

function proofRelationshipKeyboard(selected) {
  const selectedSet = new Set(selected);
  const options = ["wife", "fiancee", "girlfriend"];
  const rows = options.map((value) => [{
    text: `${selectedSet.has(value) ? "✅ " : ""}${proofRelationshipLabel(value)}`,
    callback_data: `proof:rel:${value}`
  }]);
  rows.push([{ text: "ادامه", callback_data: "proof:rel_done" }]);
  return rows;
}

function proofTargetLabel(relationships = []) {
  const priority = ["wife", "girlfriend", "fiancee"];
  const selected = priority.find((item) => relationships.includes(item)) || relationships[0];
  return proofRelationshipLabel(selected);
}

function countUrls(value) {
  return (String(value).match(/https?:\/\/|t\.me\/|telegram\.me\//gi) || []).length;
}

function parseTehranDateTime(value) {
  const match = cleanText(value).match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/);
  if (!match) return "";

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return "";

  const utcMs = Date.UTC(year, month - 1, day, hour - 3, minute - 30, 0);
  const startsAt = new Date(utcMs).toISOString();
  if (Date.parse(startsAt) <= Date.now()) return "";
  return startsAt;
}

function formatTehranSlot(startsAt) {
  const date = new Date(startsAt);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

async function sendDueBookingReminders(env) {
  const bookings = await getList(env, "bookings");
  const now = Date.now();
  const reminderMs = REMINDER_WINDOW_MINUTES * 60 * 1000;

  for (const booking of bookings) {
    if (booking.status !== "scheduled" || booking.reminderSent || !booking.startsAt) continue;

    const startsAtMs = Date.parse(booking.startsAt);
    const shouldRemind = startsAtMs > now && startsAtMs - now <= reminderMs;
    if (!shouldRemind) continue;

    const reminderText = [
      "⏰ یادآوری نوبت مشاوره",
      "",
      `زمان: ${booking.slotLabel}`,
      `کد: ${booking.id}`,
      "",
      "مشاوره تا حدود ۳۰ دقیقه دیگر شروع می‌شود."
    ].join("\n");

    await sendMessage(env, booking.userId, reminderText);
    await notifyAdmin(
      env,
      [
        "⏰ یادآوری نوبت مشاوره برای ادمین",
        "",
        `زمان: ${booking.slotLabel}`,
        `کد: ${booking.id}`,
        `نام: ${booking.name}`,
        `تماس: ${booking.contact}`,
        `موضوع: ${booking.topic}`
      ].join("\n")
    );

    booking.reminderSent = true;
    booking.reminderSentAt = new Date().toISOString();
    await env.BOT_KV.put(`booking:${booking.id}`, JSON.stringify(booking));
  }

  await env.BOT_KV.put("list:bookings", JSON.stringify(bookings));
}

async function sendDueReleaseReminders(env) {
  const requests = await getList(env, "release_requests");
  const now = Date.now();
  const reminderMs = REMINDER_WINDOW_MINUTES * 60 * 1000;

  for (const request of requests) {
    if (request.status !== "scheduled" || request.reminderSent || !request.startsAt) continue;

    const startsAtMs = Date.parse(request.startsAt);
    const shouldRemind = startsAtMs > now && startsAtMs - now <= reminderMs;
    if (!shouldRemind) continue;

    await sendMessage(
      env,
      request.userId,
      ["⏰ یادآوری تخلیه آب بیغیرتی", "", `زمان: ${request.slotLabel}`, `کد: ${request.id}`].join("\n")
    );
    await notifyAdmin(
      env,
      ["⏰ یادآوری درخواست تخلیه برای ادمین", "", `زمان: ${request.slotLabel}`, `کد: ${request.id}`, `کاربر: @${request.username || "-"}`].join("\n")
    );

    request.reminderSent = true;
    request.reminderSentAt = new Date().toISOString();
    await env.BOT_KV.put(`release:${request.id}`, JSON.stringify(request));
  }

  await env.BOT_KV.put("list:release_requests", JSON.stringify(requests));
}

function shortId() {
  return crypto.randomUUID().split("-")[0];
}

function csvCell(value) {
  return `"${String(value || "").replace(/"/g, '""')}"`;
}

async function sendCsv(env, chatId, filename, rows, caption) {
  const csv = "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\n");
  await sendDocument(env, chatId, csv, filename, caption);
}

async function sha256(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function notifyAdmin(env, text) {
  if (env.ADMIN_CHAT_ID) await sendMessage(env, env.ADMIN_CHAT_ID, text);
}

async function safeNotifyAdmin(env, text) {
  try {
    await notifyAdmin(env, text);
  } catch {
    // Avoid recursive error reporting loops when Telegram rejects admin delivery.
  }
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

async function sendVideo(env, chatId, video, caption, extra = {}) {
  return telegram(env, "sendVideo", {
    chat_id: chatId,
    video,
    caption,
    ...extra
  });
}

async function sendVoice(env, chatId, voice, caption, extra = {}) {
  return telegram(env, "sendVoice", {
    chat_id: chatId,
    voice,
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
