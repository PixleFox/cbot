import { strToU8, zipSync } from "fflate";

const CHANNEL_USERNAME = "@cuckzclub";
const MEDIA_CHANNEL_USERNAME = "@cclubmedia";
const INSTAGRAM_URL = "https://instagram.com/cucksclub";
const EXCHANGE_GROUP_URL = "https://t.me/+Y2FjepdJAGkxM2Fk";
const PHOTO_GUIDE_IMAGE_URL = "https://raw.githubusercontent.com/PixleFox/cbot/main/assets/photo-guide-v2.png";
const BOT_SHORT_DESCRIPTION = "C Club | تست غیرت، ارسال محتوا، نوبت و پشتیبانی";
const BOT_DESCRIPTION = [
  "🟢 C Club یک فضای خصوصی و مرحله‌به‌مرحله برای تست غیرت، ارسال اعتراف، ارسال عکس و فیلم، نوبت مشاوره، پشتیبانی و خدمات ویژه کاربران تاییدشده است.",
  "",
  "برای فعال شدن منوها اول ثبت‌نام کوتاه را کامل کنید. این ربات فقط برای کاربران ۱۸ سال به بالا طراحی شده است."
].join("\n");
const QUESTION_COUNT = 18;
const MAX_TEXT_LENGTH = 2800;
const MAX_PHOTO_CAPTION_LENGTH = 900;
const MAX_VIDEO_CAPTION_LENGTH = 900;
const POST_COOLDOWN_SECONDS = 90;
const BOOKING_COOLDOWN_SECONDS = 60;
const INVALID_SUBMISSION_LIMIT = 3;
const USER_BAN_SECONDS = 60 * 60 * 24 * 2;
const TEST_FEATURE_ENABLED = true;
const REMINDER_WINDOW_MINUTES = 30;
const DEFAULT_POST_HOUR = 17;
const DEFAULT_POST_MINUTE = 48;
const BROADCAST_BATCH_SIZE = 12;
const POINTS_VERSION = 1;
const POINT_REWARDS = { photo: 3, video: 5, confession: 1, proof: 1 };
const SERVICE_COSTS = { release: 5, custom_video: 15, gif: 10, custom_image: 5, consultation: 1 };
const CUSTOM_IMAGE_SCENARIOS = {
  selfie_two_men: "بین دو مرد، در حال گرفتن سلفی",
  magazine_model: "مدل عکس روی مجله با لباس سکسی",
  bed_selfie: "روی تخت، در آغوش یک مرد و در حال گرفتن سلفی"
};
const POST_REJECT_REASONS = {
  low_quality: "کیفیت نامناسب عکس یا فیلم",
  ethics: "عدم رعایت نکات اخلاقی در محتوا",
  not_attractive: "عدم جذابیت لازم محتوا"
};
const PROOF_REJECT_REASONS = {
  low_quality: "کیفیت عکس‌ها یا وویس قابل قبول نیست",
  incomplete: "اطلاعات یا فایل‌های ارسالی کامل نیست",
  mismatch: "اطلاعات ارسالی با ثبت‌نام همخوانی ندارد"
};

const QUESTIONS = [
  {
    id: "g1",
    section: "general",
    text: "کدام گزینه در مورد شما درست است؟",
    options: [
      { label: "هفته‌ای یک بار خودارضایی می‌کنم.", score: 3 },
      { label: "تقریباً هر روز خودارضایی می‌کنم.", score: 1 },
      { label: "هفته‌ای ۳ بار یا بیشتر خودارضایی می‌کنم.", score: 2 },
      { label: "خیلی کم یا اصلاً خودارضایی نمی‌کنم.", score: 4 }
    ]
  },
  {
    id: "g2",
    section: "general",
    text: "کدام گزینه در مورد شما درست است؟",
    options: [
      { label: "پورن زیاد نگاه می‌کنم و تقریباً فکر می‌کنم به پورن اعتیاد دارم.", score: 1 },
      { label: "اهل پورن دیدن هستم ولی فقط گاهی اوقات می‌بینم.", score: 2 },
      { label: "خیلی پورن کم نگاه می‌کنم.", score: 3 },
      { label: "از پورن بدم میاد و نگاه نمی‌کنم.", score: 4 }
    ]
  },
  {
    id: "g3",
    section: "general",
    text: "در هنگام رابطه جنسی به نظرتان چه چیزی بیشتر از همه لذت‌بخش است؟",
    options: [
      { label: "لذت بردن طرف مقابل از کارهایی که می‌کنم.", score: 1 },
      { label: "اینکه هر دو در هم آمیخته می‌شویم و عشق و علاقه را تحکیم می‌کنیم.", score: 2 },
      { label: "فارغ از عشق و علاقه، لذت فیزیکی که ایجاد می‌شود فوق‌العاده است.", score: 3 },
      { label: "اینکه روی طرف مقابل تسلط دارم و دارم ازش لذت می‌برم.", score: 4 }
    ]
  },
  {
    id: "g4",
    section: "general",
    text: "کدام مورد در خصوص شما صدق می‌کند؟",
    options: [
      { label: "حس می‌کنم توان جنسی من نسبت به بقیه کمتر است با این که شهوتم زیاد است.", score: 1 },
      { label: "توان جنسی من بالاست ولی از لحاظ فیزیکی چندان خود را قوی نمی‌بینم.", score: 2 },
      { label: "توان جنسی و فیزیکی متوسطی دارم.", score: 3 },
      { label: "فکر می‌کنم از اکثر مردها بهتر هستم از نظر توان جنسی و فیزیکی.", score: 4 }
    ]
  },
  {
    id: "g5",
    section: "general",
    text: "کدام مورد در خصوص شما صدق می‌کند؟",
    options: [
      { label: "همواره در زندگی در موضع ضعف بوده‌ام و دیگران به من زور می‌گویند.", score: 1 },
      { label: "اکثر اوقات نمی‌توانم حقم را ثابت کنم.", score: 2 },
      { label: "معمولاً از پس خودم برمی‌آیم و حقم را نمی‌گذارم کسی پایمال کند.", score: 3 },
      { label: "من حق بقیه را هم می‌خورم معمولاً.", score: 4 }
    ]
  },
  {
    id: "g6",
    section: "general",
    text: "در جمع‌های دوستانه یا فامیلی، وقتی صحبت از خیانت یا بی‌وفایی می‌شود، اولین حس درونی شما چیست؟",
    options: [
      { label: "هم حس ترس دارم هم هیجان؛ اگر برای خودم اتفاق بیفتد نابود می‌شوم ولی ته دلم تحریک‌کننده است.", score: 1 },
      { label: "برایم جذاب است، دوست دارم بیشتر در موردش بشنوم و سناریوهای مختلف را تصور کنم.", score: 2 },
      { label: "موضوعی معمولی است، برای هر کسی ممکن است پیش بیاید.", score: 3 },
      { label: "از این صحبت‌ها بدم میاد، به من چه ربطی داره.", score: 4 }
    ]
  },
  {
    id: "g7",
    section: "general",
    text: "اگر فردی غریبه در شبکه‌های اجتماعی از پارتنر یا همسر شما تعریف کند، چه واکنشی دارید؟",
    options: [
      { label: "تشویقش می‌کنم بیشتر تعریف کند و لذت می‌برم.", score: 1 },
      { label: "بد نیست، حس افتخار بهم دست می‌دهد.", score: 2 },
      { label: "بی‌تفاوت می‌مانم، حوصله جواب دادن ندارم.", score: 3 },
      { label: "سریع بلاک می‌کنم و به پارتنرم هم می‌گویم مواظب باشد.", score: 4 }
    ]
  },
  {
    id: "g8",
    section: "general",
    text: "کدام توصیف به شخصیت جنسی شما نزدیک‌تر است؟",
    options: [
      { label: "همیشه ته دلم می‌خواهم یک مرد قوی‌تر و مسلط‌تر بیاید و کنترل را از من بگیرد.", score: 1 },
      { label: "گاهی دلم می‌خواهد کسی مرا تحقیر کند یا ناتوانی‌ام را به رخم بکشد.", score: 2 },
      { label: "حالم با خودم هم خوب است، نه به دنبال تحقیرم نه تحقیر کردن کسی.", score: 3 },
      { label: "تحقیر شدن یا ضعیف دیده شدن برایم مثل کابوس است و تحملش را ندارم.", score: 4 }
    ]
  },
  {
    id: "r1",
    section: "relationship",
    text: "کدام گزینه در مورد شما صدق می‌کند؟",
    options: [
      { label: "پارتنرم معمولاً خیلی آزادانه لباس می‌پوشد و این خیلی برایم لذت‌بخش است.", score: 1 },
      { label: "پارتنرم متأسفانه آزادانه لباس نمی‌پوشد علی‌رغم اصرار من.", score: 2 },
      { label: "پارتنرم معمولاً آزادانه لباس می‌پوشد و من با این موضوع مشکل جدی دارم.", score: 3 },
      { label: "پارتنرم اینطوری که من می‌خوام لباس می‌پوشد.", score: 4 }
    ]
  },
  {
    id: "r2",
    section: "relationship",
    text: "کدام گزینه در مورد شما صدق می‌کند؟",
    options: [
      { label: "پارتنرم قبل از اینکه با من باشد با افراد متعددی بوده و این خیلی برایم تحریک‌آمیز است.", score: 1 },
      { label: "پارتنرم با افراد زیادی قبل از من نبوده ولی کاش بود.", score: 2 },
      { label: "پارتنرم با افرادی قبل از من بوده ولی در موردش کنجکاو نیستم.", score: 3 },
      { label: "پارتنرم با آدم‌های زیادی نبوده و ترجیح می‌دهم در موردش ندانم اگر هم بوده چون باعث ناراحتی است.", score: 4 }
    ]
  },
  {
    id: "r3",
    section: "relationship",
    text: "پارتنر شما در یک مهمانی لباس خاصی پوشیده که خیلی جذاب به نظر می‌رسد. کدام گزینه در مورد شما صدق می‌کند؟",
    options: [
      { label: "ای کاش نظر بقیه به او جلب شود تا به اوج برسم.", score: 1 },
      { label: "جذابیت او جذابیت من است، باعث افتخاره.", score: 2 },
      { label: "خیلی در مورد این موضوع کنجکاوی ندارم، هر اتفاقی بیفتد اوکی هست.", score: 3 },
      { label: "هر نگاهی که به او می‌شود مایه عذاب من است و می‌خواهم زودتر مهمانی تمام شود تا دعوا راه نینداخته باشم.", score: 4 }
    ]
  },
  {
    id: "r4",
    section: "relationship",
    text: "به صورت غیرمنتظره پارتنر خودتان را با مرد دیگری داخل ماشین می‌بینید. دوست دارید چه اتفاقی بیفتد؟",
    options: [
      { label: "کاش بعد از بوسه طولانی، پارتنرم سرش را بین پاهای مرد قرار دهد و او را به اوج برساند.", score: 1 },
      { label: "اگر در حد بوسه باشد اوکی هست و به رویش نمی‌آورم.", score: 2 },
      { label: "خیلی در مورد این موضوع کنجکاوی ندارم، هر اتفاقی بیفتد اوکی هست.", score: 3 },
      { label: "بهتر است با یک دست دادن و خداحافظی ساده تمام شود.", score: 4 }
    ]
  },
  {
    id: "r5",
    section: "relationship",
    text: "پارتنر شما ساعت ۹ شب پیامی می‌دهد که امشب پیش دوستش می‌ماند. کدام اقدام را می‌کنید؟",
    options: [
      { label: "با فکر به اینکه دروغ می‌گوید و با فرد دیگری در حال رابطه جنسی است خودم را چندین بار ارضا می‌کنم.", score: 1 },
      { label: "پرس‌وجو می‌کنم تا بفهمم دروغ می‌گوید یا راست. اگر راست بگوید، حتی پیش مردی هم باشد اوکی هست.", score: 2 },
      { label: "خیلی در مورد این موضوع کنجکاوی ندارم، هر اتفاقی بیفتد اوکی هست.", score: 3 },
      { label: "اگر بفهمم دروغ می‌گوید همه چیز تمام است.", score: 4 }
    ]
  },
  {
    id: "r6",
    section: "relationship",
    text: "پارتنر شما چت یا پیامکی با همکار جذابش دارد که شما می‌بینیدش. اولین فکرتان چیست؟",
    options: [
      { label: "ته دلم ذوق می‌کنم، شاید بالاخره یک اتفاق بیفتد و من شاهدش باشم.", score: 1 },
      { label: "ناراحت نمی‌شوم، ولی کنجکاوم ببینم تا کجا پیش می‌رود.", score: 2 },
      { label: "پیگیر می‌شوم ببینم چقدر جدی است، اگر شوخی باشد اشکال ندارد.", score: 3 },
      { label: "بلافاصله گوشی را برمی‌دارم و توضیح می‌خواهم.", score: 4 }
    ]
  },
  {
    id: "r7",
    section: "relationship",
    text: "اگر پارتنرت به شما بگوید یکی از همکارانم خیلی شبیه تو حساس و باهوش است و رابطه‌مان نزدیک شده، چه حسی می‌گیرید؟",
    options: [
      { label: "ته دلم می‌خواهم بگویم بیارش خانه، ببینم چقدر شبیه من است.", score: 1 },
      { label: "حسودی و نگرانی خفیفی می‌گیرم ولی در کل جذاب است.", score: 2 },
      { label: "می‌گویم خب، دوست خوبی پیدا کردی، تبریک.", score: 3 },
      { label: "از کوره در می‌روم، این توهین است.", score: 4 }
    ]
  },
  {
    id: "r8",
    section: "relationship",
    text: "اگر پارتنرتان با شخصی که از نظر شما جذاب‌تر و قوی‌تر است بیرون برود، در نبودش چه می‌کنید؟",
    options: [
      { label: "تصورش می‌کنم و بارها خودارضایی می‌کنم.", score: 1 },
      { label: "یکم استرس دارم ولی ذهنم درگیر سناریوهای مختلف می‌شود.", score: 2 },
      { label: "کار خودم را می‌کنم، اتفاق خاصی نمی‌افتد.", score: 3 },
      { label: "مدام زنگ می‌زنم، پیام می‌دهم تا زود برگردد.", score: 4 }
    ]
  },
  {
    id: "r9",
    section: "relationship",
    text: "یک شب پارتنرتان مست یا خیلی خسته می‌آید و در خواب اسم کس دیگری را می‌آورد. واکنش شما چیست؟",
    options: [
      { label: "خودم را می‌زنم به خواب، صبح هم به روش نمیارم چون ته دلم کیف داد.", score: 1 },
      { label: "صبح شوخی می‌کنم و اسمشو می‌پرسم، جذاب بود.", score: 2 },
      { label: "شاید خواب دیده، مهم نیست.", score: 3 },
      { label: "بیدارش می‌کنم، دعوا راه می‌اندازم، بی‌احترامی است.", score: 4 }
    ]
  },
  {
    id: "r10",
    section: "relationship",
    text: "به شما پیشنهاد شود که به مدت یک هفته پارتنرتان را با یک مرد مسلط و مجرب تنها بگذارید، در ازای آن پول خوبی هم بگیرید.",
    options: [
      { label: "حتی بی‌پول هم قبول می‌کنم، فقط تماشایش کنم کافی است.", score: 1 },
      { label: "پولش خوب باشد چرا که نه، ولی دوست دارم جزئیات را بدانم.", score: 2 },
      { label: "وسوسه‌انگیز است ولی احتمالاً قبول نمی‌کنم.", score: 3 },
      { label: "هرگز، ناموسم را نمی‌فروشم.", score: 4 }
    ]
  }
];

const TEST_TYPES = [
  {
    min: 0,
    max: 10,
    title: "سوپر کاکولد",
    summary: `### شخصیت‌شناسی
تو در انتهای طیف بی‌غیرتیِ جنسی قرار داری. این برای تو صرفاً یک فتیشِ گاه‌به‌گاه نیست، بلکه به هستهٔ اصلی هویت جنسی و حتی عاطفی‌ات تبدیل شده. تقریباً تمام لذت تو از رابطه، از طریق تماشای شریک عاطفی‌ات با فردی قوی‌تر، مسلط‌تر و به‌قول خودت «مَردتر» تأمین می‌شود. احساس تحقیر شدن، نادیده گرفته شدن و سپردن کامل کنترل به دیگری برایت حکم سوختِ روانی را دارد. در ذهنت، جایگاه «مردِ اصلی» را به بول دادی و خودت نقش تماشاچی، خدمت‌گزار یا حتی فاقد حق جنسی را پذیرفتی. سناریوهایی مثل بارداری همسر از بول، ازدواج مجدد او، یا قطع کامل رابطه جنسی خودت با او، دیگر کابوس نیستند؛ آرزوی تو هستند.`,
    advice: `### توصیه‌ها
۱. **خودآگاهی، نه خودتخریبی:** تا زمانی که این سبک زندگی با رضایت کامل هر سه طرف (تو، پارتنرت و بول) و بدون آسیب جسمی یا روانی پیش برود، یک انتخاب شخصی است. اما مراقب باش که «تحقیر شدن» از نقش‌بازی خارج نشود و به تخریب عزت‌نفس در همهٔ ابعاد زندگی (شغل، اجتماع، خانواده) منجر نشود.
۲. **مرزهای مشخص:** با پارتنرت قرارداد شفاف و مرزهای امن تعریف کن. چون در این سطح، احتمال گم‌کردن خط قرمزها و فروپاشی کامل رابطه وجود دارد.
۳. **مدیریت هیجانات:** گاهی این احساسات از زخم‌های قدیمی یا اختلالات اضطرابی می‌آیند. اگر حس می‌کنی این نیاز از روی خودتحقیریِ ریشه‌ای می‌آید نه لذت سالم، صحبت با یک درمانگر متخصص سلامت جنسی می‌تواند مفید باشد.
۴. **توازن در زندگی:** لذت جنسی تنها یکی از بخش‌های زندگی است. مطمئن شو که هویت کلی‌ات در «کاکولد بودن» خلاصه نشده باشد.`
  },
  {
    min: 10,
    max: 20,
    title: "کاکولد واقعی",
    summary: `### شخصیت‌شناسی
کاکولدی برای تو دیگر در حد فانتزی نیست؛ یک سبک زندگی پذیرفته‌شده است. تفاوتت با سوپر کاکولد شاید در این باشد که هنوز بخش‌هایی از رابطهٔ عاطفی را برای خودت محفوظ نگه می‌داری، اما بخش بزرگ لذت جنسی‌ات را از آگاهی به ارتباط پارتنرت با دیگران می‌گیری. تحقیر شدن، مقایسه شدن با بول، و گاهی حتی دیدن بی‌توجهی پارتنرت به نیازهای خودت، تغذیه‌کنندهٔ روانی‌ات است. این را یک «ضعف» نمی‌بینی، بلکه برعکس، آن را نقطهٔ اوج رهایی و صمیمیت در رابطه می‌دانی. با این حال، ته دلت گاهی ممکن است جرقه‌هایی از حسادت سنتی روشن شود که به سرعت به هیجان جنسی تبدیلش می‌کنی.`,
    advice: `### توصیه‌ها
۱. **ارتباط صادقانه:** پارتنرت باید کاملاً از این پویایی آگاه و مشتاق باشد. اگر او فقط برای خوشحال کردن تو وارد این مسیر شده، زنگ خطر است. مدام چک‌این کنید که هر دو از این بازی لذت می‌برید.
۲. **مراقبت از خود:** در نقش کاکولد، نیازهای عاطفی و فیزیکی خودت ممکن است فراموش شود. زمانی را برای «بازسازی صمیمیت دو نفره» (بعد از سناریوهای سه‌نفره) اختصاص بدهید تا پیوندتان گسسته نشود.
۳. **مهارت «خارج شدن از نقش»:** یاد بگیر بعد از پایان سناریو، از نقش کاکولد خارج شوی و دوباره یک شریک برابر باشی. اگر ۲۴ ساعته در آن نقش بمانی، سلامت روانت به خطر می‌افتد.
۴. **حریم خصوصی:** دربارهٔ اینکه چه کسانی از سبک زندگی‌تان باخبر شوند بسیار محتاط باش. انگ اجتماعی ممکن است آسیب‌های جانبی به زندگی شغلی و خانوادگی بزند.`
  },
  {
    min: 20,
    max: 30,
    title: "کاکولد",
    summary: `### شخصیت‌شناسی
تو کاکولدی را به‌عنوان یک انتخاب آگاهانه و بخشی از هویت جنسی‌ات پذیرفتی. به احتمال زیاد یک یا چند تجربهٔ واقعی (با برنامه‌ریزی یا خودجوش) داشته‌ای که به تو نشان داده این سبک برایت لذت‌بخش است. هنوز ممکن است تردیدهای گاه‌به‌گاه اخلاقی یا حسادت‌های لحظه‌ای را تجربه کنی، اما در مجموع می‌دانی که این فضا برای رابطه‌ات مفید و هیجان‌انگیز است. برخلاف تیپ‌های بالاتر، هنوز «مردانگی» خودت را کاملاً کنار نگذاشته‌ای؛ فقط تعریف جدیدی برایش ساختی: اینکه آنقدر قوی هستی که بتوانی لذت پارتنرت را با دیگری سهیم شوی.`,
    advice: `### توصیه‌ها
۱. **قاعدهٔ «فقط فانتزی» و «واقعیت» را قاطی نکن:** الان در مرحله‌ای هستی که تعادل شکننده است. اگر پارتنرت ناگهان بدون هماهنگی پا را فراتر بگذارد، ممکن است آسیب جدی ببینی. مرزهای سخت و نرم را مشخص کن.
۲. **خودت را فراموش نکن:** گاهی کاکولدها آنقدر در لذت پارتنر غرق می‌شوند که نیازهای خودشان نادیده گرفته می‌شود. از پارتنرت بخواه که در طول ماجرا به تو توجه کلامی یا فیزیکی داشته باشد (حتی تحقیرآمیز، اما هدفمند).
۳. **حسادت را تبدیل به لذت کن، نه زخم:** تکنیک‌های ذهنی مثل نوشتن احساسات بعد از هر تجربه کمک می‌کند بفهمی کجای کار حسادت واقعی (مخرّب) و کجا حسادت اروتیک (لذت‌بخش) است.
۴. **جامعهٔ امن:** ارتباط با گروه‌های حمایتی آنلاین یا دوستان مورد اعتماد در این سبک زندگی می‌تواند از حس تنهایی و انگ اجتماعی بکاهد.`
  },
  {
    min: 30,
    max: 40,
    title: "کاکولد بلا تکلیف",
    summary: `### شخصیت‌شناسی
تو در مرز میان فانتزی و واقعیت ایستاده‌ای. ذهنت پر از سناریوهای کاکولدی است، بارها با آنها خودارضایی کرده‌ای و کاملاً می‌دانی که این ایده تحریک‌کننده برایت جذاب است. اما وقتی پایت به دنیای واقعی می‌رسد، ترمز می‌کشی. ترس از پشیمانی، قضاوت اجتماعی، آسیب به رابطه، و یا از دست دادن احترام پارتنرت مانع اجرایی شدن فانتزی‌هایت می‌شود. ممکن است بارها به پارتنرت اشاره کرده باشی اما بعد عقب‌نشینی کرده باشی. این بلاتکلیفی می‌تواند اضطراب‌زا باشد و حتی باعث رفتارهای متناقض با پارتنرت شود.`,
    advice: `### توصیه‌ها
۱. **قدم‌های کوچک، نه شیرجهٔ کامل:** لازم نیست یکباره وارد یک رابطهٔ کامل کاکولدی شوی. با «وانموده‌سازی» در اتاق خواب شروع کنید: نقش‌بازی، تعریف داستان، یا حتی صحبت فرضی دربارهٔ یک غریبه. واکنش واقعی خودت و پارتنرت را بسنج.
۲. **گفتگوی بدون فشار:** در یک فضای آرام و غیرجنسی با پارتنرت دربارهٔ تخیلاتت حرف بزن. توضیح بده که این یک فانتزی است، نه اینکه او برایت کافی نیست. ببین او چه حسی دارد.
۳. **کنجکاوی را مدیریت کن:** اگر وسوسهٔ تجربه واقعی داری، ابتدا به شکل «نرم» وارد شو؛ مثلاً تماشای واکنش پارتنرت به نگاه دیگران در یک بار، بدون دخالت مستقیم.
۴. **خودقضاوتی را کنار بگذار:** بسیاری از مردان این فانتزی را دارند. کاکولد بودن یا نبودن ارزش انسانی‌ات را تعیین نمی‌کند. اگر بعد از بررسی به این نتیجه رسیدی که این فقط یک فانتزی ذهنی است و بس، همان را بپذیر و لذت ببر.`
  },
  {
    min: 40,
    max: 50,
    title: "بلا تکلیف",
    summary: `### شخصیت‌شناسی
تو در میانهٔ طیف ایستاده‌ای، و این وسط بودن دارد کلافه‌ات می‌کند. بعضی روزها ذهنت با تصور خیانت پارتنرت روشن می‌شود، و فردایش با فکر به همان تصویر دچار اضطراب و تهوع می‌شوی. نه می‌توانی با خیال راحت خودت را یک کاکولد بدانی، نه مثل مردهای سنتی به قطعیت می‌رسی که «هرگز». ممکن است نوسانات خلقی داشته باشی؛ یک هفته با خیال‌پردازی‌های تحقیرآمیز ارضا شوی و هفتهٔ بعد از خودت بپرسی «من چه مرگمه؟». این سردرگمی اغلب ریشه در تعارضات درونی دارد: بین ارزش‌های فرهنگی، عزت نفس، و تمایلات ناخودآگاه.`,
    advice: `### توصیه‌ها
۱. **تحلیل الگو:** برای دو هفته یک دفترچهٔ احساسات داشته باش. چه موقع‌هایی فانتزی کاکولدی جذاب می‌شود؟ (وقتی استرس داری؟ وقتی حس ناتوانی می‌کنی؟ یا فقط هنگام تحریک جنسی؟) این الگوها خیلی چیزها را روشن می‌کند.
۲. **از برچسب زدن فرار کن:** لازم نیست حتماً اسمی روی خودت بگذاری. انسان پیچیده‌تر از این برچسب‌هاست. می‌توانی صرفاً یک «مرد با فانتزی‌های متنوع» باشی بدون اینکه در دستهٔ خاصی قرار بگیری.
۳. **تقویت عزت نفس:** گاهی این نوسانات از عزت نفس شکننده می‌آید. روی توانمندی‌های شخصی، بدنی و حرفه‌ای‌ات کار کن. هرچه خودت را قوی‌تر ببینی، تصمیم‌گیری دربارهٔ این تمایلات برایت آسان‌تر و کم‌استرس‌تر می‌شود.
۴. **مشاورهٔ جنسی:** یک متخصص می‌تواند کمک کند تا این تعارضات را حل کنی و به یک تصویر یکپارچه از خودت برسی.`
  },
  {
    min: 50,
    max: 60,
    title: "بی‌تفاوت",
    summary: `### شخصیت‌شناسی
برخلاف بیشتر تیپ‌ها، مسئلهٔ خیانت یا وفاداری برای تو بار عاطفی چندانی ندارد. نه از فکر کاکولد بودن تحریک می‌شوی، نه از غیرت ورزیدن کیف می‌کنی. رابطه برایت بیشتر بر پایهٔ رفاقت، احترام و راحتی متقابل شکل گرفته تا جاذبهٔ جنسی آتشین. اگر پارتنرت با کسی دیگر باشد، احتمالاً بیشتر نگران بیماری‌های مقاربتی یا دروغ‌شناسی هستی تا خیانت عاطفی. حسادت در تو کم‌فروغ است، که این لزوماً نقطه‌ضعف نیست؛ فقط سبک دلبستگی‌ات «اجتنابی» یا «مستقل» است. با این حال، ممکن است پارتنرت این بی‌تفاوتی را به حساب بی‌عشقی بگذارد.`,
    advice: `### توصیه‌ها
۱. **ارتباط با پارتنر:** اگر پارتنرت آدمی عاطفی‌تر است، بی‌تفاوتی تو ممکن است برایش زجرآور باشد. شفاف توضیح بده که این سبک توست، نه بی‌علاقگی. گاهی ابراز عشق را «تمرین» کن حتی اگر خودت نیاز چندانی نمی‌بینی.
۲. **بازنگری در مرزها:** چون برایت «خیانت» تعریف پررنگی ندارد، ممکن است ناخواسته پا را از مرزهای پارتنرت فراتر بگذاری. دربارهٔ اینکه «خط قرمز» او چیست بپرس و حتی اگر با آن همدل نیستی، احترام بگذار.
۳. **خودشناسی:** مطمئن شو این بی‌تفاوتی انتخابی است یا ناشی از نوعی سرکوب هیجانی یا افسردگی خفیف. اگر از قبل احساساتت سرکوب شده، رسیدگی به آن به سلامت کلی روانت کمک می‌کند.`
  },
  {
    min: 60,
    max: 70,
    title: "نمیچه کاکولد",
    summary: `### شخصیت‌شناسی
تو اساساً کاکولد نیستی، یعنی فانتزی یا لذت جنسی از شریک شدن پارتنرت نداری. اما یک ترس نهفته، یک حس ضعف و ناامنی درونی داری که باعث می‌شود نگران باشی «نکند یکی بیاید و پارتنرت را از چنگت در بیاورد». ممکن است رفتارهای ملتمسانه، کنترل‌گرانهٔ خفیف، یا حسادت‌های بیش از اندازه نشان بدهی که ریشه در اعتماد به نفسِ شکننده دارند. نه از فکر خیانت تحریک می‌شوی، بلکه از آن می‌ترسی. در واقع تو برعکس کاکولدها، از تحقیر شدن فراری هستی اما نگرانی داری که نکند آنقدر قوی نباشی که از قلمرو عاطفی‌ات محافظت کنی.`,
    advice: `### توصیه‌ها
۱. **تقویت اعتماد به نفس:** روی بدن، مهارت‌های اجتماعی و دستاوردهای شخصی‌ات کار کن. هرچه احساس توانمندی بیشتری بکنی، حسادت ناامن‌کننده کمتر می‌شود.
۲. **حسادت را به شفافیت تبدیل کن:** به جای کنترل یا بازجویی، نیازت به امنیت را با پارتنرت در میان بگذار: «من گاهی می‌ترسم از دستت بدم، می‌شود گاهی بیشتر بهم اطمینان بدی؟» این آسیب‌پذیری شجاعانه رابطه را محکم‌تر می‌کند.
۳. **فانتزی و واقعیت را جدا کن:** اگر احیاناً گاهی تصویری از خیانت به ذهنت می‌آید و سریع پسش می‌زنی، بدان که این وسواس فکری (و نه فانتزی) ناشی از اضطراب است. تکنیک‌های ذهن‌آگاهی و تمرکز بر زمان حال کمک می‌کند.
۴. **مراقب رفتارهای سمی باش:** کنترل کردن، چک کردن گوشی، یا منع کردن از لباس خاص، رابطه را مسموم می‌کند. این رفتارها را با گفتگو جایگزین کن.`
  },
  {
    min: 70,
    max: 80,
    title: "مرد زندگی (آلفا)",
    summary: `### شخصیت‌شناسی
تو نماد تعادل و سلامت در رابطه هستی. غیرتت نه کور و خشن است، نه سست و بی‌خاصیت. به پارتنرت اعتماد داری، برای آزادی و استقلالش احترام قائلی، ولی همزمان مرزهای روشنی داری و اجازه نمی‌دهی حریم رابطه خدشه‌دار شود. عشق و صمیمیت برای تو اولویت است و رابطهٔ جنسی را با عاطفه گره می‌زنی. فانتزی کاکولدی برایت نه جذاب است نه تهدیدآمیز؛ صرفاً جزو علایق شخصی دیگران می‌دانی‌اش. اعتماد به نفس جنسی و فیزیکی خوبی داری، بدون اینکه نیاز به اثبات مداوم به دیگران داشته باشی.`,
    advice: `### توصیه‌ها
۱. **حفظ این تعادل:** تو در نقطهٔ شیرینی هستی. مواظب باش فشارهای فرهنگی («باید بی‌غیرت‌تر باشی» یا «باید خشن‌تر باشی») این بالانس را به هم نزند.
۲. **پارتنرت را در اوج ببین:** گاهی این تیپ شخصیتی آنقدر در احترام متقابل غرق می‌شود که از ماجراجویی‌های سالم جنسی (در چارچوب رابطه) غافل می‌ماند. فانتزی‌های مشترک را کشف کنید، بدون ترس از قضاوت.
۳. **الگو باش:** اطرافیان ممکن است از تو الگوی غیرت سالم و رابطهٔ برابر را یاد بگیرند. تجربیاتت را با دوستان نزدیک که در تیپ‌های «نمیچه کاکولد» یا «بلا تکلیف» گیر کرده‌اند، به اشتراک بگذار.`
  },
  {
    min: 80,
    max: 90,
    title: "بول",
    summary: `### شخصیت‌شناسی
تو سرشار از اعتماد به نفس جنسی و فیزیکی هستی. جایگاه خودت را به‌عنوان یک مرد قدرتمند می‌شناسی و برایش ارزش قائلی. گاهی ممکن است فانتزی‌های سلطه‌گری، سه‌نفره، یا حتی تصاحب زنِ مردِ ضعیف‌تر در ذهنت جرقه بزند، اما در عمل، نسبت به شریک عاطفی خودت به شدت مالکیت‌گرا و محافظه‌کاری. حاضر نیستی او را با هیچ مردی تقسیم کنی. از اینکه کسی تو را ضعیف ببیند بیزاری، و احتمالاً در برخورد با کاکولدها (اگر بشناسی‌شان) حس تحقیر یا ترحم داری. «احترام» برایت همه‌چیز است.`,
    advice: `### توصیه‌ها
۱. **انعطاف‌پذیری عاطفی:** این حجم از قدرت و غیرت گاهی باعث می‌شود نتوانی آسیب‌پذیری نشان دهی. پارتنرت ممکن است گاهی به «مرد پشت نقاب» نیاز داشته باشد. گاهی اسلحه را زمین بگذار و احساسات واقعی‌ات را نشان بده.
۲. **مرز باریک بین قدرت و خشونت:** مطمئن شو که تسلط‌طلبی‌ات در رختخواب یا رابطه با رضایت کامل پارتنر همراه است. غرور بی‌مهار می‌تواند به رابطه آسیب بزند.
۳. **پذیرش تنوع:** درک کن که مردانی که تیپ کاکولد دارند لزوماً «ضعیف» یا «بی‌ارزش» نیستند؛ آنها فقط سیم‌کشی جنسی متفاوتی دارند. قضاوت نکردن، دنیای ذهنی خودت را گسترده‌تر می‌کند.
۴. **کانالیزه کردن انرژی:** این قدرت درونی می‌تواند صرف ورزش، رهبری یا خلاقیت شود. از آن برای رشد خودت و پارتنرت استفاده کن، نه تخریب دیگران.`
  },
  {
    min: 90,
    max: 100.01,
    title: "سوپر بول",
    summary: `### شخصیت‌شناسی
تو تجسم کامل «مردانگیِ حساس به غیرت» هستی. نه تنها تحمل خیانت و بی‌احترامی را نداری، بلکه فکرش هم برایت سم است. همیشه در موضع قدرت فیزیکی، روانی و جنسی هستی و آن را بدیهی می‌دانی. واژهٔ «کاکولد» برایت یک توهین نابخشودنی است. جالب اینکه احتمالاً توانایی بالقوهٔ این را داری که نقش بول را برای زوج‌های کاکولد بازی کنی – یعنی همان مرد مسلطی که کاکولدها در فانتزی‌هایشان می‌جویند. با این حال، وارد رابطهٔ عاطفی خودت که می‌شوی، مرزهای آهنینی می‌کشی. وفاداری و انحصار جنسی برایت مقدس است.`,
    advice: `### توصیه‌ها
۱. **دما را پایین بیاور:** این سطح از حساسیت بالا نسبت به «ناموس» گاهی از اضطراب عمیق یا باورهای سفت و سخت فرهنگی می‌آید. بررسی کن که آیا این غیرت در خدمت خوشحالی تو و پارتنرت است یا دارد شما را خفه می‌کند.
۲. **گوش دادن به پارتنر:** ممکن است پارتنرت از این همه کنترل یا حساسیت بالا خسته شود. اگر او حس کند که تحت مراقبت پلیسی است، صمیمیت از بین می‌رود. به نیازهایش برای آزادی (حتی در پوشش یا معاشرت بی‌خطر) احترام بگذار.
۳. **تخلیهٔ امن هیجان:** خشونت یا پرخاشگری (حتی کلامی) را سرکوب نکن، اما راه امنی برایش پیدا کن: ورزش‌های رزمی، تمرینات تنفسی، یا رقابت‌های سالم.
۴. **انسانیت پشت قدرت:** به خودت اجازه بده لحظاتی «مرد آلفا» نباشی. گاهی خستگی، تردید و ضعف نشان دادن، تو را در چشم پارتنرت واقعی‌تر و دوست‌داشتنی‌تر می‌کند.`
  }
];

const MAIN_MENU = [
  [{ text: "🧪 تست غیرت", callback_data: "menu:test" }],
  [{ text: "⭐ امتیاز من", callback_data: "points:show" }],
  [
    { text: "🎬 ارسال عکس و فیلم", callback_data: "post:type:media" },
    { text: "✍️ ارسال اعتراف", callback_data: "post:type:confession" }
  ],
  [{ text: "💧 تخلیه آب بیغیرتی | ۵ ⭐", callback_data: "release:start" }],
  [
    { text: "🔞 عضویت در گروه VIP", callback_data: "vip:join" },
    { text: "🔁 عضویت در گروه تبادل", callback_data: "exchange:join" }
  ],
  [{ text: "🖼 ساخت عکس با چهره دلخواه | ۵ ⭐", callback_data: "custom_image:start" }],
  [{ text: "🎭 ساخت فیلم با چهره دلخواه | ۱۵ ⭐", callback_data: "face:create" }],
  [{ text: "🟢 ساخت گیف با کپشن بیغیرتی | ۱۰ ⭐", callback_data: "gif:create" }],
  [
    { text: "📅 مشاوره | ۱ ⭐", callback_data: "menu:booking" },
    { text: "🆘 پشتیبانی", callback_data: "support:start" }
  ],
  [
    { text: "📸 راهنمای ارسال عکس", callback_data: "guide:photo" },
    { text: "ℹ️ راهنما", callback_data: "menu:help" }
  ]
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
  [
    { text: "🎬 عکس و فیلم", callback_data: "post:type:media" },
    { text: "✍️ اعترافات", callback_data: "post:type:confession" }
  ],
  [{ text: "📸 راهنمای ارسال عکس", callback_data: "guide:photo" }],
  [{ text: "↩️ برگشت", callback_data: "menu:help" }]
];

const ADMIN_MENU = [
  [{ text: "🖼 درخواست‌های ساخت عکس", callback_data: "admin:list_custom_images" }],
  [
    { text: "⭐ ساخت پست ویژه", callback_data: "admin:special_post_start" },
    { text: "🗓 پست‌های ویژه", callback_data: "admin:list_special_posts" }
  ],
  [
    { text: "➕ زمان مشاوره", callback_data: "admin:add_slot" },
    { text: "💧 زمان تخلیه", callback_data: "admin:add_release_slot" }
  ],
  [
    { text: "🗓 زمان‌های فعال", callback_data: "admin:list_slots" },
    { text: "📌 پست‌های انتشار", callback_data: "admin:list_scheduled_posts" }
  ],
  [{ text: "🟡 پست‌های در انتظار بررسی", callback_data: "admin:list_pending_posts" }],
  [
    { text: "🧾 بررسی اثبات", callback_data: "admin:list_proofs" },
    { text: "🆘 پشتیبانی", callback_data: "admin:list_support" }
  ],
  [
    { text: "✅ تایید شده‌ها", callback_data: "admin:list_verified_cuckolds" },
    { text: "👥 ثبت نامی‌ها", callback_data: "admin:list_profiles" }
  ],
  [
    { text: "📣 ارسال پیام", callback_data: "admin:broadcast_start" },
    { text: "📊 Excel نوبت‌ها", callback_data: "admin:export_bookings" }
  ],
  [
    { text: "🚫 لیست بن‌شده‌ها", callback_data: "admin:list_banned" },
    { text: "⛔️ بن کردن کاربر", callback_data: "admin:ban_user" }
  ],
  [{ text: "🟢 افزودن لیست کاکولدهای تایید شده", callback_data: "admin:add_preverified_cuckolds" }],
  [{ text: "🟢 تنظیم توضیحات اولیه ربات", callback_data: "admin:set_bot_profile" }],
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
      processBroadcastQueue(env),
      publishDueSpecialPosts(env),
      sendDueBookingReminders(env),
      sendDueReleaseReminders(env),
      publishDuePosts(env)
    ]));
  }
};

async function handleMessage(message, env) {
  if (message.chat?.type !== "private") return;

  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const text = (message.text || "").trim();

  if (!isAdmin(env, userId) && await notifyIfBanned(env, chatId, userId)) return;

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

  const broadcastReply = isAdmin(env, userId)
    ? parseBroadcastReply(message.reply_to_message?.text)
    : null;
  if (broadcastReply) {
    await handleBroadcastReply(env, message, broadcastReply, text);
    return;
  }

  const state = await getState(env, userId);

  if (state?.mode === "custom_image_wait_photo") {
    await handleCustomImagePhoto(env, message);
    return;
  }

  if (state?.mode === "admin_custom_image_reply") {
    await finishCustomImageReply(env, message, state);
    return;
  }

  if (state?.mode === "special_wait_photo") {
    await handleSpecialPostPhoto(env, message, state);
    return;
  }

  if (state?.mode === "special_wait_text") {
    await handleSpecialPostText(env, message, state, text);
    return;
  }

  if (state?.mode === "special_wait_button_text") {
    await handleSpecialPostButtonText(env, message, state, text);
    return;
  }

  if (state?.mode === "special_wait_button_url") {
    await handleSpecialPostButtonUrl(env, message, state, text);
    return;
  }

  if (state?.mode === "special_wait_schedule") {
    await handleSpecialPostSchedule(env, message, state, text);
    return;
  }

  if (state?.mode === "admin_broadcast_compose") {
    await handleBroadcastReply(env, message, { kind: "group", target: state.target }, text);
    return;
  }

  if (state?.mode === "admin_broadcast_individual_target") {
    await handleBroadcastReply(env, message, { kind: "individual_target" }, text);
    return;
  }

  if (state?.mode === "admin_broadcast_individual_body") {
    await handleBroadcastReply(env, message, { kind: "individual_body", userId: state.targetUserId }, text);
    return;
  }

  if (state?.mode === "admin_add_slot") {
    await finishAddSlot(env, message, text);
    return;
  }

  if (state?.mode === "admin_add_release_slot") {
    await finishAddReleaseSlot(env, message, text);
    return;
  }

  if (state?.mode === "admin_preverified_cuckolds") {
    await finishPreverifiedCuckoldIds(env, message, text);
    return;
  }

  if (state?.mode === "admin_ban_user") {
    await finishManualUserBan(env, message, text);
    return;
  }

  if (state?.mode === "support_text") {
    await finishSupportTicket(env, message, text);
    return;
  }

  if (state?.mode === "admin_support_reply") {
    await finishSupportReply(env, message, state, text);
    return;
  }

  if (state?.mode === "admin_edit_post_text") {
    await finishEditPostText(env, message, state, text);
    return;
  }

  if (state?.mode === "admin_edit_post_media") {
    await finishEditPostMedia(env, message, state);
    return;
  }

  if (state?.mode === "admin_reject_post_custom") {
    await finishCustomPostReject(env, message, state, text);
    return;
  }

  if (state?.mode === "admin_reject_proof_custom") {
    await finishCustomProofReject(env, message, state, text);
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

  if (state?.mode === "proof_instagram") {
    await handleProofInstagram(env, message, state, text);
    return;
  }

  if (state?.mode === "release_voice") {
    await handleReleaseVoice(env, message, state);
    return;
  }

  if (state?.mode === "test") {
    if (!TEST_FEATURE_ENABLED) {
      await clearState(env, userId);
      await sendDisabledTestMessage(env, chatId, userId);
      return;
    }
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
  if (!isAdmin(env, userId) && await notifyIfBanned(env, chatId, userId)) return;

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
    await startProof(env, chatId, userId);
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

  if (data === "points:show") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
    await showPoints(env, chatId, userId);
    return;
  }

  if (data === "custom_image:start") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
    await startCustomImageRequest(env, chatId, userId);
    return;
  }

  if (data.startsWith("custom_image:scenario:")) {
    await selectCustomImageScenario(env, query, data.replace("custom_image:scenario:", ""));
    return;
  }

  if (data === "custom_image:confirm") {
    await confirmCustomImageRequest(env, query);
    return;
  }

  if (data.startsWith("custom_image:reply:")) {
    if (!isAdmin(env, userId)) return;
    await startCustomImageReply(env, query, data.replace("custom_image:reply:", ""));
    return;
  }

  if (data.startsWith("custom_image:view:")) {
    if (!isAdmin(env, userId)) return;
    await viewCustomImageRequest(env, query, data.replace("custom_image:view:", ""));
    return;
  }

  if (data.startsWith("custom_image:reject:")) {
    if (!isAdmin(env, userId)) return;
    await rejectCustomImageRequest(env, query, data.replace("custom_image:reject:", ""));
    return;
  }

  if (data.startsWith("service:cancel:")) {
    if (!isAdmin(env, userId)) return;
    const [, , kind, requestId] = data.split(":");
    await cancelPointServiceRequest(env, query, kind, requestId);
    return;
  }

  if (data === "exchange:join") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await sendExchangeGroup(env, chatId);
    return;
  }

  if (data === "face:create") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
    await sendMessage(env, chatId, "🎭 ساخت فیلم با چهره دلخواه\n\n🟢 این سرویس به زودی فعال می‌شود.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  if (data === "gif:create") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
    await sendMessage(env, chatId, "🟢 ساخت گیف با کپشن بیغیرتی\n\nاین بخش به زودی فعال می‌شود.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  if (data === "support:start") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startSupportTicket(env, chatId, userId);
    return;
  }

  if (data === "guide:photo") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await sendPhotoGuide(env, chatId, userId);
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

  if (data.startsWith("proof:aware:")) {
    await finishProofPartnerAwareness(env, query, data.replace("proof:aware:", ""));
    return;
  }

  if (data.startsWith("proof:approve:")) {
    if (!isAdmin(env, userId)) return;
    await approveProof(env, query, data.replace("proof:approve:", ""));
    return;
  }

  if (data.startsWith("proof:reject:")) {
    if (!isAdmin(env, userId)) return;
    await askProofRejectReason(env, query, data.replace("proof:reject:", ""));
    return;
  }

  if (data.startsWith("proof:reject_reason:")) {
    if (!isAdmin(env, userId)) return;
    const [, , proofId, reasonKey] = data.split(":");
    await rejectProofWithReason(env, query, proofId, PROOF_REJECT_REASONS[reasonKey] || "");
    return;
  }

  if (data.startsWith("proof:reject_custom:")) {
    if (!isAdmin(env, userId)) return;
    await startCustomProofReject(env, query, data.replace("proof:reject_custom:", ""));
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
    if (!TEST_FEATURE_ENABLED) {
      await sendDisabledTestMessage(env, chatId, userId);
      return;
    }
    await startTest(env, chatId, userId);
    return;
  }

  if (data === "menu:booking") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
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
    if (!(await ensureVerifiedContentSubmitter(env, chatId, userId))) return;
    await startMediaPost(env, chatId, userId);
    return;
  }

  if (data === "post:type:confession") {
    if (!(await ensureRegistered(env, chatId, userId))) return;
    await startConfessionPost(env, chatId, userId);
    return;
  }

  if (data.startsWith("t2c:")) {
    await cancelStatelessTest(query, env);
    return;
  }

  if (data.startsWith("t2:")) {
    await handleStatelessTestCallback(query, env);
    return;
  }

  if (data.startsWith("test:")) {
    if (!TEST_FEATURE_ENABLED) {
      await clearState(env, userId);
      await sendDisabledTestMessage(env, chatId, userId);
      return;
    }
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
    await showBroadcastRecipientMenu(env, query);
    return;
  }

  if (data.startsWith("broadcast:compose:")) {
    if (!isAdmin(env, userId)) return;
    await startBroadcastCompose(env, query, data.replace("broadcast:compose:", ""));
    return;
  }

  if (data === "broadcast:pick_individual") {
    if (!isAdmin(env, userId)) return;
    await askBroadcastIndividualTarget(env, query);
    return;
  }

  if (data.startsWith("special:type:")) {
    if (!isAdmin(env, userId)) return;
    await startSpecialPostType(env, query, data.replace("special:type:", ""));
    return;
  }

  if (data === "special:button:add") {
    if (!isAdmin(env, userId)) return;
    await askSpecialPostButtonText(env, query);
    return;
  }

  if (data === "special:button:none") {
    if (!isAdmin(env, userId)) return;
    await askSpecialPostSchedule(env, query, false);
    return;
  }

  if (data.startsWith("special:repeat:")) {
    if (!isAdmin(env, userId)) return;
    await finishSpecialPost(env, query, data.replace("special:repeat:", ""));
    return;
  }

  if (data.startsWith("special:cancel:")) {
    if (!isAdmin(env, userId)) return;
    await cancelSpecialPost(env, query, data.replace("special:cancel:", ""));
    return;
  }

  if (data === "special:abort") {
    if (!isAdmin(env, userId)) return;
    await clearState(env, userId);
    await sendAdminPanel(env, chatId);
    return;
  }

  if (data.startsWith("bc:")) {
    if (!isAdmin(env, userId)) return;
    await showBroadcastRecipientMenu(env, query);
    return;
  }

  if (data === "broadcast:individual" || data.startsWith("broadcast:individual:") || data.startsWith("bci:")) {
    if (!isAdmin(env, userId)) return;
    await showBroadcastRecipientMenu(env, query);
    return;
  }

  if (data.startsWith("support:view:")) {
    if (!isAdmin(env, userId)) return;
    await viewSupportTicket(env, query, data.replace("support:view:", ""));
    return;
  }

  if (data.startsWith("support:reply:")) {
    if (!isAdmin(env, userId)) return;
    await startSupportReply(env, query, data.replace("support:reply:", ""));
    return;
  }

  if (data.startsWith("post:approve:")) {
    if (!isAdmin(env, userId)) return;
    await askPostPublishDate(env, query, data.replace("post:approve:", ""));
    return;
  }

  if (data.startsWith("post:edit_text:")) {
    if (!isAdmin(env, userId)) return;
    await startEditPostText(env, query, data.replace("post:edit_text:", ""));
    return;
  }

  if (data.startsWith("post:edit_media:")) {
    if (!isAdmin(env, userId)) return;
    await startEditPostMedia(env, query, data.replace("post:edit_media:", ""));
    return;
  }

  if (data.startsWith("post:edit_back:")) {
    if (!isAdmin(env, userId)) return;
    await clearState(env, userId);
    await viewPendingPost(env, query, data.replace("post:edit_back:", ""));
    return;
  }

  if (data.startsWith("post:edit:")) {
    if (!isAdmin(env, userId)) return;
    await showPostEditMenu(env, query, data.replace("post:edit:", ""));
    return;
  }

  if (data.startsWith("post:reject:")) {
    if (!isAdmin(env, userId)) return;
    await askPostRejectReason(env, query, data.replace("post:reject:", ""));
    return;
  }

  if (data.startsWith("post:reject_reason:")) {
    if (!isAdmin(env, userId)) return;
    const [, , postId, reasonKey] = data.split(":");
    await rejectPostWithReason(env, query, postId, POST_REJECT_REASONS[reasonKey] || "");
    return;
  }

  if (data.startsWith("post:reject_custom:")) {
    if (!isAdmin(env, userId)) return;
    await startCustomPostReject(env, query, data.replace("post:reject_custom:", ""));
    return;
  }

  if (data.startsWith("post:schedule:")) {
    if (!isAdmin(env, userId)) return;
    const [, , postId, dateKey] = data.split(":");
    await schedulePost(env, query, postId, dateKey);
    return;
  }

  if (data.startsWith("post:cancel:")) {
    if (!isAdmin(env, userId)) return;
    await cancelScheduledPost(env, query, data.replace("post:cancel:", ""));
    return;
  }

  if (data.startsWith("post:view:")) {
    if (!isAdmin(env, userId)) return;
    await viewPendingPost(env, query, data.replace("post:view:", ""));
    return;
  }

  if (data.startsWith("slot:close:")) {
    await closeSlot(env, query, data.replace("slot:close:", ""));
    return;
  }

  if (data.startsWith("ban:unban:")) {
    if (!isAdmin(env, userId)) return;
    await unbanUser(env, query, data.replace("ban:unban:", ""));
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
        "🟢 C CLUB",
        "",
        "خوش اومدی.",
        "اینجا همه‌چیز مرحله‌به‌مرحله و خصوصی جلو می‌رود: تست غیرت، ارسال اعتراف، ارسال عکس و فیلم، نوبت مشاوره، پشتیبانی و خدمات ویژه کاربران تاییدشده.",
        "",
        "برای اینکه فضای کلاب امن، مرتب و قابل اعتماد بماند، قبل از هر کاری ثبت‌نام کوتاه را کامل کن.",
        "",
        "بعدش منو کامل برات باز می‌شه.",
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
      "🟢 C CLUB",
      "",
      "خوش برگشتی.",
      "اینجا می‌تونی تست بدی، محتوا بفرستی، نوبت بگیری یا از پشتیبانی پیام بذاری.",
      "با خیال راحت انتخاب کن؛ مسیرها مرحله‌به‌مرحله راهنمایی‌ات می‌کنند.",
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
      "C Club برای ارسال امن‌تر و مرتب‌تر محتوا ساخته شده.",
      "",
      "ثبت‌نام برای همه بخش‌ها لازم است.",
      "ارسال اعتراف برای همه کاربران ثبت‌نام‌کرده باز است.",
      "ارسال عکس و فیلم فقط برای کاکولدهای تایید شده و هاتوایف‌های تایید شده فعال می‌شود.",
      "عضویت VIP و تخلیه آب بیغیرتی فقط برای کاکولدهای تایید شده است.",
      "",
      "قبل از ارسال عکس یا فیلم، حتماً راهنمای ارسال عکس را بخوان.",
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
  await sendMessage(env, chatId, "📝 ثبت نام\n\nاسم یا اسم مستعار خودت را بفرست:", keyboard(BACK_TO_MENU));
}

async function handleRegistrationName(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const state = await getState(env, userId);
  const error = validateName(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nدوباره اسم را بفرست:`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    mode: "reg_age",
    profile: { ...state.profile, name: cleanText(text) }
  });
  await sendMessage(env, chatId, "🎂 سن خودت را به عدد بفرست.\n\nمثال: 29", keyboard(BACK_TO_MENU));
}

async function handleRegistrationAge(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const state = await getState(env, userId);
  const age = Number(normalizeDigits(cleanText(text)));
  if (!Number.isInteger(age) || age < 18 || age > 80) {
    await sendMessage(env, chatId, "❌ سن باید عددی بین ۱۸ تا ۸۰ باشد. دوباره بفرست:", keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    mode: "reg_gender",
    profile: { ...state.profile, age }
  });
  await sendMessage(env, chatId, "⚧ جنسیت را انتخاب کن:", keyboard([...GENDER_MENU, ...BACK_TO_MENU]));
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
  await sendMessage(env, chatId, "💍 وضعیت تأهل را انتخاب کن:", keyboard([...MARITAL_MENU, ...BACK_TO_MENU]));
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
  await sendMessage(env, chatId, "🏙 شهر را انتخاب کن:", keyboard(cityKeyboard()));
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
  await sendMessage(env, chatId, "🔖 کدوم هستید؟", keyboard([...getTypeMenu(profile.gender), ...BACK_TO_MENU]));
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

  const preverifiedCuckold = type === "cuckold" && await isPreverifiedCuckold(env, state.profile.username);
  const profile = {
    ...state.profile,
    type,
    typeLabel: USER_TYPE_LABELS[type],
    registered: true,
    cuckoldVerified: preverifiedCuckold,
    cuckoldVerifiedAt: preverifiedCuckold ? new Date().toISOString() : "",
    cuckoldPreverified: preverifiedCuckold,
    hotwifeVerified: false,
    pointsVersion: POINTS_VERSION,
    pointsBalance: 0,
    pointsLifetimeEarned: 0,
    pointsLifetimeSpent: 0,
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
      `نوع: ${profile.typeLabel}`,
      "",
      preverifiedCuckold ? "🟢 شما کاکولد اثبات شده هستید و نیازی به ارسال اثبات ندارید." : "🟢 منوی اصلی برای شما فعال شد."
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
}

async function startProof(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (profile?.registered && profile.gender === "female" && profile.type === "hotwife") {
    await startHotwifeProof(env, chatId, userId);
    return;
  }
  await startCuckoldProof(env, chatId, userId);
}

async function startCuckoldProof(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (!profile?.registered || profile.type !== "cuckold" || profile.gender !== "male") {
    await sendMessage(env, chatId, "این بخش فقط برای کاکولدها و هاتوایف‌ها فعال است.", keyboard(BACK_TO_MENU));
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
      "❇️ مزیت‌های ثبت‌نام به عنوان کاکولد",
      "",
      "1⃣ فقط یک‌بار اثبات می‌دی و آیدی تلگرام و اینستاگرامت به عنوان تایید شده ثبت می‌شه.",
      "2⃣ سرویس ساخت ویدیو با سناریوی شما و چهره فرد مورد نظرتان سریع‌تر انجام می‌شود.",
      "3⃣ سرویس تخلیه آب بیغیرتی فوری، بدون درخواست اطلاعات اضافه، برای شما انجام می‌شود.",
      "4⃣ سرویس جق روی عکس ارسالی شما فعال می‌شود؛ عکس به بول‌ها داده می‌شود و ویدیو برای شما ارسال می‌شود.",
      "5⃣ عکس شما می‌تواند در کانال و استوری اینستاگرام به صورت اختصاصی منتشر شود و کامنت بگیرد.",
      "6⃣ امکان عضویت در گروه گپ و تبادل عکس با اعضای کاکولد را خواهید داشت.",
      "7⃣ با ادمین مستقیم در ارتباط خواهید بود.",
      "",
      "🟪 شرط‌های اولیه ثبت‌نام کاکولدی",
      "",
      "1⃣ باید متاهل باشید یا رابطه پایدار داشته باشید.",
      "2⃣ فرم را دقیق و بدون اطلاعات فیک تکمیل کنید.",
      "3⃣ تا تایید اطلاعات صبر کنید.",
      "",
      "❇️ جمع کردن افراد با گرایش کاکولدی دور هم کار ساده‌ای نیست و احراز افراد هم زمان و انرژی می‌برد. لطفاً تا جای ممکن از ارسال عکس فیک، اطلاعات فیک و موارد مشابه خودداری کنید و اخلاق را رعایت کنید.",
      "",
      "🟡 توجه: عضویت و همه موارد پایه رایگان است.",
      "",
      "۱) روی چه شخصی کاکولد هستی؟ می‌توانی چند گزینه را انتخاب کنی:"
    ].join("\n"),
    keyboard(proofRelationshipKeyboard([]))
  );
}

async function startHotwifeProof(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  if (!profile?.registered || profile.type !== "hotwife" || profile.gender !== "female") {
    await sendMessage(env, chatId, "این بخش فقط برای کاربران هاتوایف فعال است.", keyboard(BACK_TO_MENU));
    return;
  }
  if (profile.hotwifeVerified) {
    await sendMessage(env, chatId, "✅ هاتوایفی شما قبلاً تایید شده است.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  const pendingProof = await getPendingProofForUser(env, userId);
  if (pendingProof) {
    await sendMessage(
      env,
      chatId,
      [
        "⏳ یک درخواست اثبات در انتظار بررسی داری.",
        "",
        `کد درخواست: ${pendingProof.id}`,
        "بعد از بررسی ادمین نتیجه همین‌جا برات ارسال می‌شه."
      ].join("\n"),
      keyboard(await getMainMenuForUser(env, userId))
    );
    return;
  }

  await setState(env, userId, { mode: "proof_voice", proofType: "hotwife" });
  await sendMessage(
    env,
    chatId,
    [
      "🧾 اثبات هاتوایفی",
      "",
      "برای تایید، فقط یک وویس کوتاه لازم داریم.",
      "لطفاً با صدای واضح بگو:",
      "",
      `«سلام سی کلاب من ${profile.name || "..." } هستم هاتوایف لطفا من رو تایید کن.»`,
      "",
      "وویس باید بین ۲ تا ۶۰ ثانیه باشد.",
      "بعد از بررسی ادمین، شناسه فایل از حافظه ربات پاک می‌شود."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleProofRelationship(env, query, relationship) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state || state.mode !== "proof_relationship") {
    await startProof(env, chatId, userId);
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
    mode: "proof_selfie",
    relationships: state.selected,
    target: proofTargetLabel(state.selected)
  });
  await sendMessage(
    env,
    chatId,
    [
      "❇️ دریافت اثبات ۱",
      "",
      "لطفاً یک عکس/فیلم دو نفره از خودت و پارتنرت جهت اثبات ارسال کن.",
      "",
      "🟡 توجه: عکس یا فیلم بدون چهره قابلیت احراز ندارد، چون ممکن است از اینترنت پیدا شده باشد و اثبات محسوب نمی‌شود.",
      "",
      "🔓 جهت حفظ حریم شخصی شما، پس از تایید یا رد درخواست، فایل ارسالی از حافظه ربات پاک می‌شود.",
      "",
      "✅ عکس/فیلم را ترجیحاً به صورت فایل ارسال کن تا کیفیت آن کاهش پیدا نکند."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleProofVoice(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const voice = message.voice;
  if (!voice?.file_id) {
    if (await recordInvalidSubmission(env, message, "به جای وویس، نوع دیگری از پیام فرستاده شد.", "وویس تلگرام")) return;
    await sendMessage(env, chatId, "❌ لطفاً فقط وویس تلگرام بفرست.", keyboard(BACK_TO_MENU));
    return;
  }
  if (state.proofType === "hotwife") {
    if (voice.duration < 2 || voice.duration > 60) {
      await sendMessage(env, chatId, "❌ وویس اثبات هاتوایفی باید بین ۲ تا ۶۰ ثانیه باشد. دوباره بفرست:", keyboard(BACK_TO_MENU));
      return;
    }
    await saveHotwifeProof(env, message, state, voice);
    return;
  }

  if (voice.duration < 5 || voice.duration > 180) {
    await sendMessage(env, chatId, "❌ وویس باید بین ۵ تا ۱۸۰ ثانیه باشد. دوباره بفرست:", keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "proof_instagram",
    voiceFileId: voice.file_id,
    voiceDuration: voice.duration
  });
  await sendMessage(
    env,
    chatId,
    [
      "📷 اینستاگرام",
      "",
      "لطفاً آیدی یا یوزرنیم اینستاگرام خودت را ارسال کن.",
      "برای ارتباط مستقیم در اینستاگرام استفاده می‌شود.",
      "",
      "مثال: @cucksclub"
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleProofInstagram(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const instagram = normalizeInstagramUsername(text);
  if (!instagram) {
    await sendMessage(env, chatId, "❌ آیدی اینستاگرام معتبر نیست.\n\nمثال درست: @cucksclub", keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "proof_partner_awareness",
    instagram
  });

  await sendMessage(
    env,
    chatId,
    [
      "آیا پارتنر/همسر شما از کاکولدی شما باخبر است؟",
      "",
      "یکی از گزینه‌ها را انتخاب کن:"
    ].join("\n"),
    keyboard([
      [{ text: "بله، می‌داند و همکاری می‌کند", callback_data: "proof:aware:knows_cooperates" }],
      [{ text: "بله، می‌داند ولی همکاری نمی‌کند", callback_data: "proof:aware:knows_no_coop" }],
      [{ text: "نمی‌داند", callback_data: "proof:aware:does_not_know" }],
      ...BACK_TO_MENU
    ])
  );
}

async function finishProofPartnerAwareness(env, query, awareness) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  const allowed = ["knows_cooperates", "knows_no_coop", "does_not_know"];
  if (!state || state.mode !== "proof_partner_awareness" || !allowed.includes(awareness)) {
    await sendMessage(env, chatId, "برای ثبت اثبات، دوباره از منو شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
    await clearState(env, userId);
    return;
  }

  const profile = await getProfile(env, userId);
  const proofId = shortId();
  const proof = {
    id: proofId,
    proofType: "cuckold",
    userId,
    username: query.from.username || "",
    firstName: query.from.first_name || "",
    relationships: state.relationships,
    instagram: state.instagram,
    partnerAwareness: awareness,
    voiceFileId: state.voiceFileId,
    voiceDuration: state.voiceDuration,
    proofMedia1Kind: state.proofMedia1Kind,
    proofMedia1FileId: state.proofMedia1FileId,
    proofMedia2Kind: state.proofMedia2Kind,
    proofMedia2FileId: state.proofMedia2FileId,
    proofMedia3Kind: state.proofMedia3Kind,
    proofMedia3FileId: state.proofMedia3FileId,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await putListItem(env, "proofs", proof);
  await clearState(env, userId);

  await sendMessage(env, chatId, "✅ اطلاعات ثبت شد و برای بررسی ادمین ارسال شد.\n\nنتیجه همین‌جا اعلام می‌شود.", keyboard(await getMainMenuForUser(env, userId)));
  await sendProofToAdmin(env, proof, profile, query.from);
}

async function saveHotwifeProof(env, message, state, voice) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const profile = await getProfile(env, userId);
  const proofId = shortId();
  const proof = {
    id: proofId,
    proofType: "hotwife",
    userId,
    username: message.from.username || "",
    firstName: message.from.first_name || "",
    voiceFileId: voice.file_id,
    voiceDuration: voice.duration,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await putListItem(env, "proofs", proof);
  await clearState(env, userId);

  await sendMessage(env, chatId, "✅ وویس اثبات ثبت شد و برای ادمین رفت.\n\nنتیجه بررسی همین‌جا بهت اعلام می‌شه.", keyboard(await getMainMenuForUser(env, userId)));
  await sendProofToAdmin(env, proof, profile, message.from);
}

async function handleProofSelfie(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const media = normalizeProofMedia(message);
  if (!media.ok) {
    if (await recordInvalidSubmission(env, message, media.error, "عکس/فیلم معتبر برای اثبات")) return;
    await sendMessage(env, chatId, `❌ ${media.error}\n\nلطفاً عکس/فیلم دو نفره معتبر بفرست.`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "proof_partner_hijab",
    proofMedia1Kind: media.kind,
    proofMedia1FileId: media.fileId
  });

  await sendMessage(
    env,
    chatId,
    [
      "❇️ دریافت اثبات ۲",
      "",
      "لطفاً یک عکس/فیلم با حجاب از پارتنر خودت ارسال کن.",
      "",
      "🟡 عکس بدون چهره قابلیت احراز ندارد.",
      "🟡 این فایل نباید تکراری یا همان فایل قبلی باشد.",
      "",
      "🔓 جهت حفظ حریم شخصی شما، پس از تایید یا رد درخواست، فایل ارسالی از حافظه ربات پاک می‌شود.",
      "",
      "✅ عکس/فیلم را ترجیحاً به صورت فایل ارسال کن تا کیفیت آن کاهش پیدا نکند."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleProofPartnerHijab(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const media = normalizeProofMedia(message);
  if (!media.ok) {
    if (await recordInvalidSubmission(env, message, media.error, "عکس/فیلم با حجاب معتبر")) return;
    await sendMessage(env, chatId, `❌ ${media.error}\n\nلطفاً عکس/فیلم با حجاب معتبر بفرست.`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "proof_partner_no_hijab",
    proofMedia2Kind: media.kind,
    proofMedia2FileId: media.fileId
  });

  await sendMessage(
    env,
    chatId,
    [
      "❇️ دریافت اثبات ۳",
      "",
      "لطفاً یک عکس/فیلم جذاب با لباس سکسی از پارتنر خودت ارسال کن.",
      "",
      "🟡 عکس بدون چهره قابلیت احراز ندارد.",
      "🟡 این فایل نباید تکراری یا همان فایل‌های قبلی باشد.",
      "🟪 این اثبات برای این گرفته می‌شود که مشخص شود فایل واقعاً مربوط به رابطه شماست، نه یک عکس عمومی یا دانلودی.",
      "",
      "🔓 جهت حفظ حریم شخصی شما، پس از تایید یا رد درخواست، فایل ارسالی از حافظه ربات پاک می‌شود.",
      "",
      "✅ عکس/فیلم را ترجیحاً به صورت فایل ارسال کن تا کیفیت آن کاهش پیدا نکند."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleProofPartnerNoHijab(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const media = normalizeProofMedia(message);
  if (!media.ok) {
    if (await recordInvalidSubmission(env, message, media.error, "عکس/فیلم جذاب معتبر")) return;
    await sendMessage(env, chatId, `❌ ${media.error}\n\nلطفاً عکس/فیلم جذاب معتبر بفرست.`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "proof_voice",
    proofMedia3Kind: media.kind,
    proofMedia3FileId: media.fileId
  });

  await sendMessage(
    env,
    chatId,
    [
      "💟 فانتزی کاکولدی",
      "",
      "لطفاً فانتزی خودت رو به صورت وویس 🎙 بفرست.",
      "",
      "⚠️ نوشتن فانتزی مورد قبول نیست؛ فقط وویس.",
      "وویس باید بین ۵ تا ۱۸۰ ثانیه باشد."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function sendProofToAdmin(env, proof, profile, user) {
  const isHotwife = proof.proofType === "hotwife";
  const controls = keyboard([[
    { text: isHotwife ? "✅ تایید هاتوایف" : "✅ تایید کاکولد", callback_data: `proof:approve:${proof.id}` },
    { text: "❌ رد", callback_data: `proof:reject:${proof.id}` }
  ]]);

  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    [
      isHotwife ? "🧾 درخواست اثبات هاتوایفی" : "🧾 درخواست اثبات کاکولدی",
      "",
      `کد: ${proof.id}`,
      `کاربر: ${formatUser(user)}`,
      `نام ثبت‌نام: ${profile?.name || "-"}`,
      `سن: ${profile?.age || "-"}`,
      `شهر: ${profile?.city || "-"}`,
      isHotwife ? "نوع اثبات: وویس هاتوایفی" : `گزینه‌ها: ${proof.relationships.map(proofRelationshipLabel).join("، ")}`,
      isHotwife ? "" : `اینستاگرام: ${proof.instagram || "-"}`,
      isHotwife ? "" : `اطلاع پارتنر: ${partnerAwarenessLabel(proof.partnerAwareness)}`
    ].join("\n")
  );
  await sendVoice(env, env.ADMIN_CHAT_ID, proof.voiceFileId, `🎙 وویس اثبات - کد ${proof.id}`, isHotwife ? controls : {});
  if (isHotwife) return;

  await sendProofMedia(env, env.ADMIN_CHAT_ID, proof.proofMedia1Kind || "photo", proof.proofMedia1FileId || proof.selfiePhotoFileId, `📷 اثبات ۱: دو نفره - کد ${proof.id}`);
  await sendProofMedia(env, env.ADMIN_CHAT_ID, proof.proofMedia2Kind || "photo", proof.proofMedia2FileId || proof.partnerHijabPhotoFileId, `🧕 اثبات ۲: با حجاب - کد ${proof.id}`);
  await sendProofMedia(env, env.ADMIN_CHAT_ID, proof.proofMedia3Kind || "photo", proof.proofMedia3FileId || proof.partnerNoHijabPhotoFileId, `💫 اثبات ۳: جذاب - کد ${proof.id}`, controls);
}

async function approveProof(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  const profileBeforeApproval = await getProfile(env, proof.userId);
  const hadPointAccount = profileBeforeApproval?.pointsVersion === POINTS_VERSION;

  proof.status = "approved";
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedBy = String(query.from.id);
  proof.voiceFileId = "";
  proof.selfiePhotoFileId = "";
  proof.partnerHijabPhotoFileId = "";
  proof.partnerNoHijabPhotoFileId = "";
  proof.proofMedia1FileId = "";
  proof.proofMedia2FileId = "";
  proof.proofMedia3FileId = "";
  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await updateListItem(env, "proofs", proofId, (item) => ({ ...item, status: "approved", reviewedAt: proof.reviewedAt, reviewedBy: proof.reviewedBy }));

  const profile = await getProfile(env, proof.userId);
  if (profile) {
    if (proof.proofType === "hotwife") {
      profile.hotwifeVerified = true;
      profile.hotwifeVerifiedAt = proof.reviewedAt;
    } else {
      profile.cuckoldVerified = true;
      profile.cuckoldVerifiedAt = proof.reviewedAt;
    }
    await env.BOT_KV.put(`profile:${proof.userId}`, JSON.stringify(profile));
  }

  let pointResult = null;
  if (proof.proofType !== "hotwife") {
    pointResult = hadPointAccount
      ? await changePoints(env, proof.userId, POINT_REWARDS.proof, `earn:proof:${proof.id}`, "تکمیل اثبات کاکولدی")
      : { ok: true, balance: Number((await ensurePointAccount(env, proof.userId))?.pointsBalance || 0) };
  }

  const approvedText = proof.proofType === "hotwife"
    ? "✅ تایید شد. شما به عنوان هاتوایف تایید شدید و اکنون می‌توانید محتوای عکس و فیلم ارسال کنید."
    : `✅ تایید شد. شما به عنوان کاکولد ثبت نام شدید و اکنون می‌توانید از همه قابلیت‌های ربات استفاده کنید.\n\n⭐ موجودی امتیاز: ${pointResult?.balance || 0}`;
  await sendMessage(env, proof.userId, approvedText, keyboard(await getMainMenuForUser(env, proof.userId)));
  await sendMessage(env, chatId, `✅ درخواست تایید شد.\nکد: ${proofId}`);
}

async function askProofRejectReason(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  await sendMessage(env, chatId, `❌ دلیل رد شدن اثبات را انتخاب کن:\n\nکد: ${proofId}`, keyboard([
    [{ text: "کیفیت فایل‌ها قابل قبول نیست", callback_data: `proof:reject_reason:${proofId}:low_quality` }],
    [{ text: "اطلاعات یا فایل‌ها کامل نیست", callback_data: `proof:reject_reason:${proofId}:incomplete` }],
    [{ text: "عدم همخوانی اطلاعات", callback_data: `proof:reject_reason:${proofId}:mismatch` }],
    [{ text: "✍️ نوشتن دلیل دلخواه", callback_data: `proof:reject_custom:${proofId}` }]
  ]));
}

async function rejectProofWithReason(env, query, proofId, reason) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }
  const finalReason = cleanText(reason);
  if (!finalReason) {
    await sendMessage(env, chatId, "دلیل رد شدن خالی است.");
    return;
  }

  proof.status = "rejected";
  proof.reviewedAt = new Date().toISOString();
  proof.reviewedBy = String(query.from.id);
  proof.rejectReason = finalReason;
  proof.voiceFileId = "";
  proof.selfiePhotoFileId = "";
  proof.partnerHijabPhotoFileId = "";
  proof.partnerNoHijabPhotoFileId = "";
  proof.proofMedia1FileId = "";
  proof.proofMedia2FileId = "";
  proof.proofMedia3FileId = "";
  await env.BOT_KV.put(`proof:${proofId}`, JSON.stringify(proof));
  await updateListItem(env, "proofs", proofId, (item) => ({ ...item, status: "rejected", reviewedAt: proof.reviewedAt, reviewedBy: proof.reviewedBy, rejectReason: finalReason }));

  const rejectedTitle = proof.proofType === "hotwife" ? "❌ درخواست اثبات هاتوایفی تایید نشد." : "❌ درخواست اثبات کاکولدی تایید نشد.";
  await sendMessage(env, proof.userId, [rejectedTitle, "", `دلیل: ${finalReason}`].join("\n"), keyboard(BACK_TO_MENU));
  await sendMessage(env, chatId, `❌ درخواست رد شد.\nکد: ${proofId}\nدلیل: ${finalReason}`);
}

async function startCustomProofReject(env, query, proofId) {
  const chatId = String(query.message.chat.id);
  if (!isAdmin(env, String(query.from.id))) return;

  const proof = await getJson(env, `proof:${proofId}`);
  if (!proof || proof.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }
  await setState(env, String(query.from.id), { mode: "admin_reject_proof_custom", proofId });
  await sendMessage(env, chatId, `✍️ دلیل رد شدن اثبات را بنویس:\n\nکد: ${proofId}\nلغو: /cancel`);
}

async function finishCustomProofReject(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;
  const reason = cleanText(text);
  if (reason.length < 3 || reason.length > 500) {
    await sendMessage(env, chatId, "❌ دلیل باید بین ۳ تا ۵۰۰ کاراکتر باشد. دوباره بنویس:");
    return;
  }
  await clearState(env, userId);
  await rejectProofWithReason(env, { message, from: message.from }, state.proofId, reason);
}

async function startTest(env, chatId, userId) {
  if (!TEST_FEATURE_ENABLED) {
    await sendDisabledTestMessage(env, chatId, userId);
    return;
  }

  const profile = await getProfile(env, userId);
  const mode = ["married", "relationship"].includes(profile?.marital) ? "r" : "g";
  const sessionId = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const issuedAt = Math.floor(Date.now() / 60000).toString(36);
  const questionCount = getStatelessTestQuestions(mode).length;
  await sendMessage(
    env,
    chatId,
    [
      "🧪 تست غیرت",
      "",
      "این آزمون صرفاً برای خودشناسی است و ملاک قطعی یا تشخیص محسوب نمی‌شود.",
      questionCount === 8 ? "برای شما ۸ سوال عمومی نمایش داده می‌شود." : "برای شما ۸ سوال عمومی + ۱۰ سوال رابطه نمایش داده می‌شود.",
      "",
      "برای توقف از دکمه «انصراف از آزمون» استفاده کن."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
  await sendStatelessQuestion(env, chatId, userId, mode, sessionId, issuedAt, "");
}

async function sendDisabledTestMessage(env, chatId, userId) {
  await sendMessage(
    env,
    chatId,
    [
      "🧪 تست غیرت",
      "",
      "فعلاً غیرفعال است.",
      "برای مدیریت مصرف پلن رایگان Cloudflare، این بخش موقتاً بسته شده و بعداً دوباره فعال می‌شود."
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
}

let testSigningKeyToken = "";
let testSigningKeyPromise = null;

function getStatelessTestQuestions(mode) {
  return QUESTIONS.filter((question) => question.section === "general" || (mode === "r" && question.section === "relationship"));
}

async function getTestSigningKey(env) {
  if (!testSigningKeyPromise || testSigningKeyToken !== env.BOT_TOKEN) {
    testSigningKeyToken = env.BOT_TOKEN;
    testSigningKeyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(env.BOT_TOKEN),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  }
  return testSigningKeyPromise;
}

async function signTestProgress(env, userId, mode, sessionId, issuedAt, answers) {
  const key = await getTestSigningKey(env);
  const payload = `${userId}|${mode}|${sessionId}|${issuedAt}|${answers}`;
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return [...new Uint8Array(signature).slice(0, 6)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function buildTestCallbackData(env, userId, mode, sessionId, issuedAt, answers) {
  const signature = await signTestProgress(env, userId, mode, sessionId, issuedAt, answers);
  return `t2:${mode}:${sessionId}:${issuedAt}:${answers}:${signature}`;
}

async function sendStatelessQuestion(env, chatId, userId, mode, sessionId, issuedAt, answers, messageId = null) {
  const questions = getStatelessTestQuestions(mode);
  const index = answers.length;
  const question = questions[index];
  if (!question) return;

  const callbackData = await Promise.all(question.options.map((_, optionIndex) =>
    buildTestCallbackData(env, userId, mode, sessionId, issuedAt, `${answers}${optionIndex}`)
  ));
  const cancelData = (await buildTestCallbackData(env, userId, mode, sessionId, issuedAt, answers)).replace(/^t2:/, "t2c:");
  const rows = question.options.map((option, optionIndex) => [{
    text: `گزینه ${optionIndex + 1}`,
    callback_data: callbackData[optionIndex]
  }]);
  const optionText = question.options.map((option, optionIndex) => `${optionIndex + 1}ـ ${option.label}`).join("\n\n");
  const text = [`🔘 سوال ${index + 1}/${questions.length}`, "", question.text, "", optionText].join("\n");
  const replyMarkup = keyboard([...rows, [{ text: "↩️ انصراف از آزمون", callback_data: cancelData }]]);

  if (messageId) {
    try {
      await editMessageText(env, chatId, messageId, text, replyMarkup);
      return;
    } catch {
      // If Telegram can no longer edit the original message, continue in a new one.
    }
  }
  await sendMessage(env, chatId, text, replyMarkup);
}

async function cancelStatelessTest(query, env) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const [, mode, sessionId, issuedAt, answers = "", signature] = String(query.data || "").split(":");
  const issuedMinute = Number.parseInt(issuedAt, 36);
  const ageMinutes = Math.floor(Date.now() / 60000) - issuedMinute;
  const validShape = ["g", "r"].includes(mode)
    && /^[a-f0-9]{8}$/.test(sessionId || "")
    && /^[0-3]{0,18}$/.test(answers)
    && Number.isFinite(issuedMinute)
    && ageMinutes >= -5
    && ageMinutes <= 24 * 60;
  const expectedSignature = validShape
    ? await signTestProgress(env, userId, mode, sessionId, issuedAt, answers)
    : "";
  if (!validShape || signature !== expectedSignature) return;

  const text = "↩️ آزمون لغو شد. هر زمان خواستی می‌توانی دوباره از منو شروع کنی.";
  const replyMarkup = keyboard(await getMainMenuForUser(env, userId));
  try {
    await editMessageText(env, chatId, query.message.message_id, text, replyMarkup);
  } catch {
    await sendMessage(env, chatId, text, replyMarkup);
  }
}

async function handleStatelessTestCallback(query, env) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const parts = String(query.data || "").split(":");
  const [, mode, sessionId, issuedAt, answers, signature] = parts;
  const questions = getStatelessTestQuestions(mode);
  const issuedMinute = Number.parseInt(issuedAt, 36);
  const ageMinutes = Math.floor(Date.now() / 60000) - issuedMinute;
  const validShape = ["g", "r"].includes(mode)
    && /^[a-f0-9]{8}$/.test(sessionId || "")
    && /^[0-3]{1,18}$/.test(answers || "")
    && answers.length <= questions.length
    && Number.isFinite(issuedMinute)
    && ageMinutes >= -5
    && ageMinutes <= 24 * 60;
  const expectedSignature = validShape
    ? await signTestProgress(env, userId, mode, sessionId, issuedAt, answers)
    : "";

  if (!validShape || signature !== expectedSignature) {
    await sendMessage(env, chatId, "این مرحله آزمون معتبر نیست یا بیشتر از ۲۴ ساعت از آن گذشته است. آزمون را دوباره از منو شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  if (answers.length >= questions.length) {
    await finishStatelessTest(env, query, mode, sessionId, issuedAt, answers);
    return;
  }

  await sendStatelessQuestion(env, chatId, userId, mode, sessionId, issuedAt, answers, query.message.message_id);
}

async function finishStatelessTest(env, query, mode, sessionId, issuedAt, encodedAnswers) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const questions = getStatelessTestQuestions(mode);
  const answers = [...encodedAnswers].map((value, index) => {
    const optionIndex = Number(value);
    const question = questions[index];
    return { questionId: question.id, optionIndex, score: question.options[optionIndex].score };
  });
  const total = answers.reduce((sum, answer) => sum + answer.score, 0);
  const questionCount = questions.length;
  const min = questionCount;
  const max = questionCount * 4;
  const percent = Math.round(((total - min) / (max - min)) * 100);
  const result = getTestType(percent);
  const id = (await sha256(`${userId}:${sessionId}:${issuedAt}`)).slice(0, 12);
  const testResult = {
    id,
    userId,
    questionCount,
    total,
    min,
    max,
    percent,
    type: result.title,
    answers,
    createdAt: new Date().toISOString()
  };

  const profile = await getProfile(env, userId);
  if (!profile?.registered) {
    await sendMessage(env, chatId, "ثبت‌نام شما پیدا نشد. ابتدا ثبت‌نام را کامل کن.", keyboard(LOCKED_MENU));
    return;
  }
  const history = Array.isArray(profile.testHistory) ? profile.testHistory : [];
  const existing = history.find((item) => item.id === id);
  const savedResult = existing || testResult;
  if (!existing) {
    const updatedProfile = {
      ...profile,
      testHistory: [...history, testResult].slice(-10),
      testCount: Number(profile.testCount || 0) + 1,
      lastTestResult: testResult
    };
    await env.BOT_KV.put(`profile:${userId}`, JSON.stringify(updatedProfile));
  }

  const savedType = getTestType(savedResult.percent);
  const resultText = buildTestResultText(savedResult, savedType);
  const replyMarkup = { parse_mode: "HTML", ...keyboard(await getMainMenuForUser(env, userId)) };
  try {
    await editMessageText(env, chatId, query.message.message_id, resultText, replyMarkup);
  } catch {
    await sendMessage(env, chatId, resultText, replyMarkup);
  }
}

function buildTestResultText(testResult, result) {
  return [
    "🟢 <b><u>نتیجه تست غیرت</u></b>",
    "━━━━━━━━━━━━",
    "",
    `🎭 <b>تیپ شخصیت:</b> <u>${escapeHtml(result.title)}</u>`,
    `📊 <b>درصد طیف:</b> ${testResult.percent}%`,
    `🧮 <b>نمره خام:</b> ${testResult.total}`,
    `📍 <b>بازه نمره:</b> ${testResult.min} تا ${testResult.max}`,
    "",
    decorateTestText(result.summary),
    "",
    decorateTestText(result.advice),
    "",
    "━━━━━━━━━━━━",
    "🌱 <i>این آزمون صرفاً برای خودشناسی است و ملاک قطعی محسوب نمی‌شود.</i>"
  ].join("\n");
}

async function sendQuestion(env, chatId, state) {
  const index = state.index;
  state.questionIds = state.questionIds || QUESTIONS.map((question) => question.id);
  const q = getQuestionById(state.questionIds[index]);
  const rows = q.options.map((option, optionIndex) => [
    { text: `گزینه ${optionIndex + 1}`, callback_data: `test:${index}:${optionIndex}` }
  ]);
  const optionText = q.options.map((option, optionIndex) => `${optionIndex + 1}ـ ${option.label}`).join("\n\n");

  await sendMessage(
    env,
    chatId,
    [`🔘 سوال ${index + 1}/${state.questionIds.length}`, "", q.text, "", optionText].join("\n"),
    keyboard([...rows, ...BACK_TO_MENU])
  );
}

async function handleTestCallback(query, env, state, index, optionIndex) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);

  if (!state || state.mode !== "test") {
    await sendMessage(env, chatId, "برای شروع آزمون از منو استفاده کن.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }
  state.questionIds = state.questionIds || QUESTIONS.map((question) => question.id);

  const question = getQuestionById(state.questionIds?.[index]);
  if (state.index !== index || !question?.options[optionIndex]) {
    await sendMessage(env, chatId, "این پاسخ با سوال فعلی هماهنگ نیست.");
    return;
  }

  const option = question.options[optionIndex];
  const nextState = {
    mode: "test",
    index: index + 1,
    questionIds: state.questionIds,
    scores: [...state.scores, option.score],
    answers: [...(state.answers || []), { questionId: question.id, optionIndex, score: option.score }]
  };

  if (nextState.index >= state.questionIds.length) {
    await finishTest(env, chatId, userId, nextState);
    return;
  }

  await setState(env, userId, nextState);
  await sendQuestion(env, chatId, nextState);
}

async function finishTest(env, chatId, userId, state) {
  const total = state.scores.reduce((sum, value) => sum + value, 0);
  const questionCount = state.questionIds.length;
  const min = questionCount;
  const max = questionCount * 4;
  const percent = Math.round(((total - min) / (max - min)) * 100);
  const result = getTestType(percent);

  const testResult = {
    id: shortId(),
    userId,
    questionCount,
    total,
    min,
    max,
    percent,
    type: result.title,
    answers: state.answers || [],
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`test:${testResult.id}`, JSON.stringify(testResult));
  await putListItem(env, "test_results", testResult);
  await clearState(env, userId);
  await sendMessage(
    env,
    chatId,
    [
      "🟢 <b><u>نتیجه تست غیرت</u></b>",
      "━━━━━━━━━━━━",
      "",
      `🎭 <b>تیپ شخصیت:</b> <u>${escapeHtml(result.title)}</u>`,
      `📊 <b>درصد طیف:</b> ${percent}%`,
      `🧮 <b>نمره خام:</b> ${total}`,
      `📍 <b>بازه نمره:</b> ${min} تا ${max}`,
      "",
      decorateTestText(result.summary),
      "",
      decorateTestText(result.advice),
      "",
      "━━━━━━━━━━━━",
      "🌱 <i>این آزمون صرفاً برای خودشناسی است و ملاک قطعی محسوب نمی‌شود.</i>"
    ].join("\n"),
    { parse_mode: "HTML", ...keyboard(await getMainMenuForUser(env, userId)) }
  );
}

async function startBooking(env, chatId, userId) {
  const pointProfile = await ensurePointAccount(env, userId);
  if (Number(pointProfile?.pointsBalance || 0) < SERVICE_COSTS.consultation) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.consultation);
    return;
  }
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
  await sendMessage(env, chatId, "📅 نوبت مشاوره\n\nنام یا اسم مستعار را بفرست.\n\nمثال: Ali\nلغو: /cancel", keyboard(BACK_TO_MENU));
}

async function handleBookingName(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validateName(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nدوباره نام یا اسم مستعار را بفرست:`, keyboard(BACK_TO_MENU));
    return;
  }
  const username = message.from.username ? `@${message.from.username}` : "";
  if (username) {
    await setState(env, userId, { mode: "booking_topic", name: cleanText(text), contact: username });
    await sendMessage(env, chatId, `✅ آیدی تلگرامت خودکار دریافت شد: ${username}\n\n🧩 موضوع مشاوره را کوتاه بنویس.\n\nحداقل ۱۰ و حداکثر ۵۰۰ کاراکتر.`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, { mode: "booking_phone", name: cleanText(text) });
  await sendMessage(env, chatId, "📱 چون آیدی تلگرام قابل دریافت نیست، شماره تماس را بفرست.\n\nمثال: 09121234567", keyboard(BACK_TO_MENU));
}

async function handleBookingPhone(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validatePhone(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nشماره تماس معتبر بفرست:`, keyboard(BACK_TO_MENU));
    return;
  }
  await setState(env, userId, { ...state, mode: "booking_topic", contact: cleanText(text) });
  await sendMessage(env, chatId, "🧩 موضوع مشاوره را کوتاه بنویس.\n\nحداقل ۱۰ و حداکثر ۵۰۰ کاراکتر.", keyboard(BACK_TO_MENU));
}

async function handleBookingTopic(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const error = validateTopic(text);
  if (error) {
    await sendMessage(env, chatId, `❌ ${error}\n\nموضوع را دوباره بفرست:`, keyboard(BACK_TO_MENU));
    return;
  }

  const slots = await getOpenSlots(env, 12, "consultation");
  if (!slots.length) {
    await clearState(env, userId);
    await sendMessage(env, chatId, "متأسفانه همین الان زمان آزادی باقی نمانده.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  await setState(env, userId, { ...state, mode: "booking_slot", topic: cleanText(text) });
  await sendMessage(env, chatId, "🗓 یکی از زمان‌های آزاد را انتخاب کن:", keyboard([...slots.slice(0, 12).map((slot) => [
    { text: slot.label, callback_data: `slot:pick:${slot.id}` }
  ]), ...BACK_TO_MENU]));
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
  const pointCharge = await spendPoints(
    env,
    userId,
    SERVICE_COSTS.consultation,
    `spend:consultation:${bookingId}`,
    "رزرو مشاوره"
  );
  if (!pointCharge.ok) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.consultation);
    return;
  }
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
    pointsCost: SERVICE_COSTS.consultation,
    pointsTransactionId: `spend:consultation:${bookingId}`,
    status: "scheduled",
    createdAt: new Date().toISOString()
  };

  slot.status = "booked";
  slot.bookedBy = userId;
  slot.bookingId = bookingId;
  try {
    await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
    await updateListItem(env, "slots", slotId, (item) => ({ ...item, status: "booked", bookedBy: userId, bookingId }));
    await env.BOT_KV.put(`booking:${bookingId}`, JSON.stringify(booking));
    await putListItem(env, "bookings", booking);
  } catch (error) {
    await refundPoints(env, userId, SERVICE_COSTS.consultation, `refund:consultation:${bookingId}`, "بازگشت امتیاز رزرو ناموفق");
    throw error;
  }
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [`✅ نوبتت ثبت شد`, "", `کد: ${bookingId}`, `زمان: ${slot.label}`, `هزینه: ${SERVICE_COSTS.consultation} ⭐`, `موجودی: ${pointCharge.balance} ⭐`, "", "لطفاً در همین زمان آماده باش."].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );

  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    [
      "📅 نوبت جدید ثبت شد",
      "",
      `کد: ${bookingId}`,
      `زمان: ${slot.label}`,
      `کاربر: ${formatUser(query.from)}`,
      `نام: ${booking.name}`,
      `تماس: ${booking.contact}`,
      `موضوع: ${booking.topic}`,
      `هزینه: ${SERVICE_COSTS.consultation} ⭐`
    ].join("\n"),
    keyboard([[{ text: "❌ لغو و بازگشت امتیاز", callback_data: `service:cancel:booking:${bookingId}` }]])
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

async function sendExchangeGroup(env, chatId) {
  await sendMessage(
    env,
    chatId,
    [
      "🔁 گروه تبادل عکس و فیلم",
      "",
      "برای عضویت روی دکمه زیر بزن."
    ].join("\n"),
    keyboard([
      [{ text: "ورود به گروه تبادل", url: EXCHANGE_GROUP_URL }],
      [{ text: "↩️ برگشت به منو", callback_data: "menu:home" }]
    ])
  );
}

async function startSupportTicket(env, chatId, userId) {
  await setState(env, userId, { mode: "support_text" });
  await sendMessage(
    env,
    chatId,
    [
      "🆘 پشتیبانی",
      "",
      "مشکل یا پیام خودت را کامل بنویس.",
      "ادمین پاسخ را همین‌جا از طریق ربات برایت می‌فرستد.",
      "",
      "لغو: /cancel"
    ].join("\n")
  );
}

async function finishSupportTicket(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const body = cleanText(text);
  if (!message.text || body.startsWith("/")) {
    if (await recordInvalidSubmission(env, message, "به جای متن پشتیبانی، نوع دیگری از پیام فرستاده شد.", "متن معمولی")) return;
    await sendMessage(env, chatId, "❌ لطفاً پیام پشتیبانی را به صورت متن معمولی بفرست.", keyboard(BACK_TO_MENU));
    return;
  }
  if (body.length < 5 || body.length > 2000) {
    await sendMessage(env, chatId, "❌ متن پشتیبانی باید بین ۵ تا ۲۰۰۰ کاراکتر باشد. دوباره بنویس:", keyboard(BACK_TO_MENU));
    return;
  }

  const ticketId = shortId();
  const profile = await getProfile(env, userId);
  const ticket = {
    id: ticketId,
    userId,
    username: message.from.username || "",
    firstName: message.from.first_name || "",
    profileName: profile?.name || "",
    body,
    status: "open",
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`support:${ticketId}`, JSON.stringify(ticket));
  await putListItem(env, "support_tickets", ticket);
  await clearState(env, userId);

  await sendMessage(env, chatId, `✅ پیام پشتیبانی ثبت شد.\n\nکد پیگیری: ${ticketId}`, keyboard(await getMainMenuForUser(env, userId)));
  await sendAdminSupportTicket(env, ticket);
}

async function sendAdminSupportTicket(env, ticket) {
  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    [
      "🆘 درخواست پشتیبانی جدید",
      "",
      `کد: ${ticket.id}`,
      `کاربر: ${ticket.profileName || ticket.firstName || "-"} | ${ticket.username ? `@${ticket.username}` : ticket.userId}`,
      `زمان: ${formatDateTime(ticket.createdAt)}`,
      "",
      ticket.body
    ].join("\n"),
    keyboard([[
      { text: "✉️ پاسخ", callback_data: `support:reply:${ticket.id}` }
    ]])
  );
}

async function startReleaseFlow(env, chatId, userId) {
  if (!(await ensureVerifiedCuckold(env, chatId, userId))) return;
  const pointProfile = await ensurePointAccount(env, userId);
  if (Number(pointProfile?.pointsBalance || 0) < SERVICE_COSTS.release) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.release);
    return;
  }

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
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleReleaseVoice(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const voice = message.voice;
  if (!voice?.file_id) {
    if (await recordInvalidSubmission(env, message, "به جای وویس تخلیه، نوع دیگری از پیام فرستاده شد.", "وویس تلگرام")) return;
    await sendMessage(env, chatId, "❌ لطفاً فقط وویس تلگرام بفرست.", keyboard(BACK_TO_MENU));
    return;
  }
  if (voice.duration < 2 || voice.duration > 120) {
    await sendMessage(env, chatId, "❌ وویس باید بین ۲ تا ۱۲۰ ثانیه باشد. دوباره بفرست:", keyboard(BACK_TO_MENU));
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
  await sendMessage(env, chatId, "🗓 زمان آزاد را انتخاب کن:", keyboard([...slots.slice(0, 12).map((slot) => [
    { text: slot.label, callback_data: `slot:pick:${slot.id}` }
  ]), ...BACK_TO_MENU]));
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
  const pointCharge = await spendPoints(
    env,
    userId,
    SERVICE_COSTS.release,
    `spend:release:${requestId}`,
    "رزرو تخلیه آب بیغیرتی"
  );
  if (!pointCharge.ok) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.release);
    return;
  }
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
    pointsCost: SERVICE_COSTS.release,
    pointsTransactionId: `spend:release:${requestId}`,
    reminderSent: false,
    createdAt: new Date().toISOString()
  };

  slot.status = "booked";
  slot.bookedBy = userId;
  slot.releaseRequestId = requestId;
  try {
    await env.BOT_KV.put(`slot:${slotId}`, JSON.stringify(slot));
    await updateListItem(env, "slots", slotId, (item) => ({ ...item, status: "booked", bookedBy: userId, releaseRequestId: requestId }));
    await env.BOT_KV.put(`release:${requestId}`, JSON.stringify(request));
    await putListItem(env, "release_requests", request);
  } catch (error) {
    await refundPoints(env, userId, SERVICE_COSTS.release, `refund:release:${requestId}`, "بازگشت امتیاز رزرو ناموفق");
    throw error;
  }
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [`✅ درخواست ثبت شد`, "", `کد: ${requestId}`, `زمان: ${slot.label}`, `هزینه: ${SERVICE_COSTS.release} ⭐`, `موجودی: ${pointCharge.balance} ⭐`].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );

  await sendMessage(
    env,
    env.ADMIN_CHAT_ID,
    [
      "💧 درخواست تخلیه آب بیغیرتی",
      "",
      `کد: ${requestId}`,
      `زمان: ${slot.label}`,
      `کاربر: ${formatUser(query.from)}`,
      `هزینه: ${SERVICE_COSTS.release} ⭐`
    ].join("\n"),
    keyboard([[{ text: "❌ لغو و بازگشت امتیاز", callback_data: `service:cancel:release:${requestId}` }]])
  );
  await sendVoice(env, env.ADMIN_CHAT_ID, state.voiceFileId, `🎙 وویس تخلیه - کد ${requestId}`);
}

async function startCustomImageRequest(env, chatId, userId) {
  const profile = await ensurePointAccount(env, userId);
  if (Number(profile?.pointsBalance || 0) < SERVICE_COSTS.custom_image) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.custom_image);
    return;
  }
  await setState(env, userId, { mode: "custom_image_wait_photo" });
  await sendMessage(
    env,
    chatId,
    [
      "🖼 ساخت عکس با چهره دلخواه",
      "",
      `هزینه درخواست: ${SERVICE_COSTS.custom_image} ⭐`,
      `موجودی شما: ${profile.pointsBalance} ⭐`,
      "",
      "یک عکس واضح و باکیفیت از روبه‌رو بفرست.",
      "صورت کامل، نور مناسب و بدون عینک یا پوشاندن چهره باشد."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function handleCustomImagePhoto(env, message) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ فقط یک عکس واضح از روبه‌رو بفرست.", keyboard(BACK_TO_MENU));
    return;
  }
  const photo = message.photo[message.photo.length - 1];
  if (Number(photo.width || 0) < 600 || Number(photo.height || 0) < 600) {
    await sendMessage(env, chatId, "❌ کیفیت عکس پایین است. عکس واضح‌تری بفرست که حداقل ۶۰۰ پیکسل باشد.", keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, { mode: "custom_image_wait_scenario", sourcePhotoFileId: photo.file_id });
  await sendMessage(env, chatId, "✅ عکس دریافت شد.\n\nکدام تصویر ساخته شود؟", keyboard([
    [{ text: "۱. سلفی بین دو مرد", callback_data: "custom_image:scenario:selfie_two_men" }],
    [{ text: "۲. مدل روی مجله", callback_data: "custom_image:scenario:magazine_model" }],
    [{ text: "۳. سلفی روی تخت کنار یک مرد", callback_data: "custom_image:scenario:bed_selfie" }],
    ...BACK_TO_MENU
  ]));
}

async function selectCustomImageScenario(env, query, scenarioKey) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (state?.mode !== "custom_image_wait_scenario" || !state.sourcePhotoFileId || !CUSTOM_IMAGE_SCENARIOS[scenarioKey]) {
    await sendMessage(env, chatId, "اطلاعات درخواست پیدا نشد. دوباره از منو شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }
  const profile = await ensurePointAccount(env, userId);
  await setState(env, userId, { ...state, mode: "custom_image_wait_confirm", scenarioKey });
  await sendMessage(
    env,
    chatId,
    [
      "🖼 تایید نهایی درخواست",
      "",
      `سناریو: ${CUSTOM_IMAGE_SCENARIOS[scenarioKey]}`,
      `هزینه: ${SERVICE_COSTS.custom_image} ⭐`,
      `موجودی فعلی: ${profile?.pointsBalance || 0} ⭐`,
      "",
      "با ثبت قطعی، امتیاز از حسابت کم می‌شود."
    ].join("\n"),
    keyboard([
      [{ text: `✅ ثبت قطعی | ${SERVICE_COSTS.custom_image} ⭐`, callback_data: "custom_image:confirm" }],
      ...BACK_TO_MENU
    ])
  );
}

async function confirmCustomImageRequest(env, query) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (state?.mode !== "custom_image_wait_confirm" || !state.sourcePhotoFileId || !CUSTOM_IMAGE_SCENARIOS[state.scenarioKey]) {
    await sendMessage(env, chatId, "اطلاعات درخواست کامل نیست. دوباره از منو شروع کن.", keyboard(await getMainMenuForUser(env, userId)));
    return;
  }

  const requestId = shortId();
  const charge = await spendPoints(
    env,
    userId,
    SERVICE_COSTS.custom_image,
    `spend:custom_image:${requestId}`,
    "ساخت عکس با چهره دلخواه"
  );
  if (!charge.ok) {
    await sendInsufficientPoints(env, chatId, userId, SERVICE_COSTS.custom_image);
    return;
  }

  const request = {
    id: requestId,
    userId,
    username: query.from.username || "",
    firstName: query.from.first_name || "",
    sourcePhotoFileId: state.sourcePhotoFileId,
    scenarioKey: state.scenarioKey,
    scenarioLabel: CUSTOM_IMAGE_SCENARIOS[state.scenarioKey],
    pointsCost: SERVICE_COSTS.custom_image,
    status: "pending",
    createdAt: new Date().toISOString()
  };
  try {
    await env.BOT_KV.put(`custom_image:${requestId}`, JSON.stringify(request));
    await putListItem(env, "custom_image_requests", request);
  } catch (error) {
    await refundPoints(env, userId, SERVICE_COSTS.custom_image, `refund:custom_image:${requestId}`, "بازگشت امتیاز ثبت ناموفق");
    throw error;
  }
  await clearState(env, userId);
  await sendMessage(
    env,
    chatId,
    `✅ درخواست ساخت عکس ثبت شد.\n\nکد: ${requestId}\nهزینه: ${SERVICE_COSTS.custom_image} ⭐\nموجودی: ${charge.balance} ⭐`,
    keyboard(await getMainMenuForUser(env, userId))
  );
  await sendCustomImageRequestToAdmin(env, request);
}

async function sendCustomImageRequestToAdmin(env, request) {
  await sendPhoto(
    env,
    env.ADMIN_CHAT_ID,
    request.sourcePhotoFileId,
    [
      "🖼 درخواست ساخت عکس",
      "",
      `کد: ${request.id}`,
      `کاربر: ${request.firstName || "-"} | ${request.username ? `@${request.username}` : request.userId}`,
      `سناریو: ${request.scenarioLabel}`,
      `هزینه پرداخت‌شده: ${request.pointsCost} ⭐`
    ].join("\n"),
    keyboard([[
      { text: "📤 ارسال عکس نهایی", callback_data: `custom_image:reply:${request.id}` },
      { text: "❌ رد و بازگشت امتیاز", callback_data: `custom_image:reject:${request.id}` }
    ]])
  );
}

async function listCustomImageRequests(env, chatId) {
  const refs = await getList(env, "custom_image_requests");
  const pending = refs.filter((item) => item.status === "pending").slice(-25).reverse();
  if (!pending.length) {
    await sendMessage(env, chatId, "درخواست ساخت عکسِ در انتظار وجود ندارد.", keyboard(ADMIN_MENU));
    return;
  }
  const rows = pending.map((request) => [{
    text: `🖼 ${request.firstName || request.username || request.id} | ${request.id}`,
    callback_data: `custom_image:view:${request.id}`
  }]);
  rows.push([{ text: "↩️ پنل ادمین", callback_data: "admin:panel" }]);
  await sendMessage(env, chatId, `🖼 درخواست‌های ساخت عکس\n\nتعداد در انتظار: ${pending.length}`, keyboard(rows));
}

async function startCustomImageReply(env, query, requestId) {
  const chatId = String(query.message.chat.id);
  const request = await getJson(env, `custom_image:${requestId}`);
  if (!request || request.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً پاسخ داده شده است.", keyboard(ADMIN_MENU));
    return;
  }
  await setState(env, String(query.from.id), { mode: "admin_custom_image_reply", requestId });
  await sendPhoto(
    env,
    chatId,
    request.sourcePhotoFileId,
    `📤 عکس نهایی ساخته‌شده را بفرست.\n\nکد: ${request.id}\nسناریو: ${request.scenarioLabel}`,
    keyboard([[{ text: "↩️ لغو", callback_data: "admin:list_custom_images" }]])
  );
}

async function viewCustomImageRequest(env, query, requestId) {
  const request = await getJson(env, `custom_image:${requestId}`);
  if (!request || request.status !== "pending") {
    await sendMessage(env, String(query.message.chat.id), "این درخواست پیدا نشد یا قبلاً تعیین تکلیف شده است.", keyboard(ADMIN_MENU));
    return;
  }
  await sendCustomImageRequestToAdmin(env, request);
}

async function finishCustomImageReply(env, message, state) {
  const chatId = String(message.chat.id);
  const adminId = String(message.from.id);
  if (!isAdmin(env, adminId)) return;
  const request = await getJson(env, `custom_image:${state.requestId}`);
  if (!request || request.status !== "pending") {
    await clearState(env, adminId);
    await sendMessage(env, chatId, "این درخواست دیگر در انتظار نیست.", keyboard(ADMIN_MENU));
    return;
  }
  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ عکس نهایی را به‌صورت Photo بفرست.");
    return;
  }
  const photo = message.photo[message.photo.length - 1];
  await sendPhoto(env, request.userId, photo.file_id, `✅ عکس درخواستی شما آماده شد.\n\nکد: ${request.id}`);
  request.status = "completed";
  request.completedAt = new Date().toISOString();
  request.completedBy = adminId;
  request.sourcePhotoFileId = "";
  await env.BOT_KV.put(`custom_image:${request.id}`, JSON.stringify(request));
  await updateListItem(env, "custom_image_requests", request.id, (item) => ({ ...item, status: "completed", completedAt: request.completedAt, sourcePhotoFileId: "" }));
  await clearState(env, adminId);
  await sendMessage(env, chatId, `✅ عکس نهایی برای کاربر ارسال شد.\nکد: ${request.id}`, keyboard(ADMIN_MENU));
}

async function rejectCustomImageRequest(env, query, requestId) {
  const chatId = String(query.message.chat.id);
  const request = await getJson(env, `custom_image:${requestId}`);
  if (!request || request.status !== "pending") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً تعیین تکلیف شده است.", keyboard(ADMIN_MENU));
    return;
  }
  const refund = await refundPoints(
    env,
    request.userId,
    request.pointsCost,
    `refund:custom_image:${request.id}`,
    "بازگشت امتیاز درخواست ردشده ساخت عکس"
  );
  request.status = "rejected";
  request.rejectedAt = new Date().toISOString();
  request.rejectedBy = String(query.from.id);
  request.sourcePhotoFileId = "";
  await env.BOT_KV.put(`custom_image:${request.id}`, JSON.stringify(request));
  await updateListItem(env, "custom_image_requests", request.id, (item) => ({ ...item, status: "rejected", rejectedAt: request.rejectedAt, sourcePhotoFileId: "" }));
  await sendMessage(env, request.userId, `❌ درخواست ساخت عکس رد شد.\n\n⭐ ${request.pointsCost} امتیاز برگشت داده شد.\nموجودی: ${refund.balance} ⭐`);
  await sendMessage(env, chatId, `✅ درخواست رد شد و ${request.pointsCost} ⭐ برگشت داده شد.`, keyboard(ADMIN_MENU));
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
      "📝 ارسال محتوا در C Club",
      "",
      "خوشحالیم که تصمیم گرفتی تصویر، فیلم یا اعترافت رو با ما به اشتراک بذاری.",
      "قبل از ارسال عکس و فیلم، راهنما رو بخون تا پستت سریع‌تر تایید بشه.",
      "",
      "نوع محتوا رو انتخاب کن:",
      "",
      "🎬 عکس یا فیلم: اول فایل، بعد کپشن",
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
      "🎬 ارسال عکس و فیلم",
      "",
      "خوشحالیم که تصمیم گرفتی با C Club محتوات رو به اشتراک بذاری.",
      "",
      "برای اینکه پستت شانس تایید بیشتری داشته باشه:",
      "• عکس/فیلم واضح، جذاب و با کیفیت بفرست.",
      "• محتوای مخفیانه، واترمارک‌دار یا دستکاری‌شده تایید نمی‌شه.",
      "• محتوای نود کامل قابل انتشار نیست.",
      "",
      "اول خود عکس یا فیلم رو بفرست؛ بعد کپشن رو جداگانه ازت می‌پرسم.",
      "",
      "لغو: /cancel"
    ].join("\n"),
    keyboard([
      [{ text: "📸 راهنمای ارسال عکس", callback_data: "guide:photo" }],
      ...BACK_TO_MENU
    ])
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
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
}

async function sendPhotoGuide(env, chatId, userId) {
  try {
    await sendPhoto(
      env,
      chatId,
      PHOTO_GUIDE_IMAGE_URL,
      [
        "📸 راهنمای تصویری ارسال عکس",
        "",
        "سمت چپ: ۵ نمونه اشتباه با ضربدر",
        "سمت راست: یک نمونه درست با تیک"
      ].join("\n")
    );
  } catch {
    // Text guide below is still useful if Telegram cannot fetch the hosted image.
  }

  await sendMessage(
    env,
    chatId,
    [
      "📸 راهنمای ارسال عکس و فیلم",
      "",
      "خوشحالیم که تصمیم گرفتی با ما تصاویر و فیلم‌های خودت رو به اشتراک بذاری.",
      "قبل از ادامه، لطفاً این نکات رو با دقت بخون تا هم حریم خصوصی حفظ بشه، هم پستت سریع‌تر تایید بشه.",
      "",
      "🌻 نکات اخلاقی",
      "",
      "1⃣ برای حفظ حریم خصوصی افراد، عکس یا فیلم باید از همسر، نامزد یا دوست‌دختر شما باشد. عکس از افراد دیگر مورد پذیرش نیست و در بررسی اثبات لحاظ می‌شود.",
      "",
      "2⃣ عکس یا فیلم مخفیانه مورد قبول نیست. عکس‌های مخفیانه معمولاً با رضایت افراد نیستند و تایید نمی‌شوند.",
      "",
      "3⃣ جهت حفظ حریم خصوصی، امکان ذخیره و به‌اشتراک‌گذاری مستقیم فایل‌ها از کانال بسته شده است.",
      "",
      "❇️ نکات فنی",
      "",
      "1⃣ عکس/فیلم بی‌کیفیت مورد قبول نیست.",
      "",
      "2⃣ عکس/فیلمی که واترمارک، نوشته یا دستکاری داشته باشد، مثل حذف بک‌گراند، کات کردن، پوشاندن چهره با Brush و موارد مشابه، تایید نمی‌شود.",
      "",
      "3⃣ عکس/فیلم باید جذاب و تحریک‌کننده باشد؛ محتوای خیلی عادی که جاذبه خاصی ندارد معمولاً تایید نمی‌شود.",
      "",
      "4⃣ عکس/فیلم نباید نود کامل باشد. به دلیل محدودیت‌های تلگرام امکان انتشار عکس‌های کاملاً لخت وجود ندارد.",
      "",
      "❌ پنج نمونه اشتباه",
      "• عکس کم‌کیفیت یا تار",
      "• عکس زیادی زوم‌شده",
      "• عکس خیلی عادی و غیرجذاب",
      "• عکس مخفیانه",
      "• عکس واترمارک‌دار یا دستکاری‌شده",
      "",
      "✅ نمونه درست",
      "عکس واضح، با نور مناسب، کادر تمیز، حالت جذاب، بدون واترمارک و بدون حس مخفیانه."
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
}

async function handleMediaPostFile(env, message) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const media = normalizeMediaFile(message);

  if (!media.ok) {
    if (await recordInvalidSubmission(env, message, media.error, "عکس یا فیلم تلگرام")) return;
    await sendMessage(env, chatId, `❌ ${media.error}\n\nفقط عکس یا فیلم تلگرام بفرست.`, keyboard(BACK_TO_MENU));
    return;
  }

  await setState(env, userId, { mode: "post_media_wait_caption", media });
  await sendMessage(env, chatId, "✅ فایل دریافت شد.\n\nحالا کپشن پست را بفرست.", keyboard(BACK_TO_MENU));
}

async function handleMediaPostCaption(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const caption = cleanText(text);
  const limit = MAX_PHOTO_CAPTION_LENGTH;

  if (!caption || caption.length < 5) {
    if (await recordInvalidSubmission(env, message, "کپشن ارسال نشده یا بیش از حد کوتاه بود.", "کپشن متنی")) return;
    await sendMessage(env, chatId, "❌ کپشن خیلی کوتاه است. حداقل ۵ کاراکتر بفرست:", keyboard(BACK_TO_MENU));
    return;
  }
  if (caption.length > limit) {
    await sendMessage(env, chatId, `❌ کپشن باید حداکثر ${limit} کاراکتر باشد. کوتاه‌ترش کن:`, keyboard(BACK_TO_MENU));
    return;
  }

  const post = {
    kind: state.media.kind,
    fileId: state.media.fileId,
    rawText: caption,
    finalText: buildMediaCaption(caption, state.media.kind)
  };

  await savePostAndPreview(env, message, post);
}

async function handleConfessionPost(env, message, text) {
  const chatId = String(message.chat.id);
  const confession = cleanText(text);

  if (!message.text || confession.startsWith("/")) {
    if (await recordInvalidSubmission(env, message, "به جای متن اعتراف، نوع دیگری از پیام فرستاده شد.", "متن اعتراف")) return;
    await sendMessage(env, chatId, "❌ برای اعترافات فقط متن معمولی بفرست.", keyboard(BACK_TO_MENU));
    return;
  }

  if (wordCount(confession) < 10) {
    if (await recordInvalidSubmission(env, message, "متن اعتراف کمتر از حداقل ۱۰ کلمه بود.", "متن اعتراف حداقل ۱۰ کلمه‌ای")) return;
    await sendMessage(env, chatId, "❌ متن اعتراف باید حداقل ۱۰ کلمه باشد. کامل‌تر بنویس:", keyboard(BACK_TO_MENU));
    return;
  }

  if (confession.length > MAX_TEXT_LENGTH) {
    await sendMessage(env, chatId, `❌ متن بیشتر از ${MAX_TEXT_LENGTH} کاراکتر است. کوتاه‌ترش کن:`, keyboard(BACK_TO_MENU));
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
    scheduleKind: getPostScheduleKind(post.kind),
    createdAt: new Date().toISOString()
  };

  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(record));
  await env.BOT_KV.put(`post_hash:${contentHash}`, postId, { expirationTtl: 60 * 60 * 24 * 14 });
  await putListItem(env, "posts", record);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [
      "✅ پست برای ادمین ارسال شد. نتیجه بعد از بررسی اعلام می‌شود.",
      "",
      `⭐ امتیاز پس از تایید و انتشار: +${POINT_REWARDS[record.kind] || 0}`,
      "این امتیاز برای کاکولدهای تأییدشده ثبت می‌شود."
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
  await sendAdminPostPreview(env, record, message.from);
}

async function sendAdminPostPreview(env, post, user) {
  const adminText = [
    post.editedAt ? "✏️ پیش‌نمایش پست ویرایش‌شده" : "📝 پست جدید برای تایید",
    "",
    `کد: ${post.id}`,
    `کاربر: ${formatUser(user)}`,
    `نوع: ${postTypeLabel(post.kind)}`,
    "",
    "پیش‌نمایش پست:"
  ].join("\n");

  await sendMessage(env, env.ADMIN_CHAT_ID, adminText);
  const controls = keyboard([
    [
      { text: "✅ تایید و زمان‌بندی", callback_data: `post:approve:${post.id}` },
      { text: "❌ رد", callback_data: `post:reject:${post.id}` }
    ],
    [{ text: "✏️ ویرایش پست", callback_data: `post:edit:${post.id}` }]
  ]);

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

async function askPostPublishDate(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || !["pending", "approved_waiting_schedule"].includes(post.status)) {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  const options = await getAvailablePublishDates(env, getPostScheduleKind(post.kind), 8);
  if (!options.length) {
    await sendMessage(env, chatId, "فعلاً روز آزادی برای زمان‌بندی پیدا نشد. بعداً دوباره تلاش کن.");
    return;
  }

  post.status = "approved_waiting_schedule";
  post.approvedAt = post.approvedAt || new Date().toISOString();
  post.approvedBy = post.approvedBy || String(query.from.id);
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));
  await updateListItem(env, "posts", postId, (item) => ({ ...item, status: post.status, approvedAt: post.approvedAt, approvedBy: post.approvedBy }));

  await sendMessage(
    env,
    chatId,
    [
      "✅ پست تایید شد.",
      "",
      "حالا روز انتشار را انتخاب کن.",
      `ساعت انتشار پیش‌فرض: ${pad2(DEFAULT_POST_HOUR)}:${pad2(DEFAULT_POST_MINUTE)} تهران`,
      "",
      "روزهایی که همین نوع پست دارند نمایش داده نمی‌شوند."
    ].join("\n"),
    keyboard(options.map((option) => [
      { text: option.label, callback_data: `post:schedule:${postId}:${option.dateKey}` }
    ]))
  );
}

async function schedulePost(env, query, postId, dateKey) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || !["pending", "approved_waiting_schedule"].includes(post.status)) {
    await sendMessage(env, chatId, "این پست پیدا نشد یا دیگر قابل زمان‌بندی نیست.");
    return;
  }

  const scheduleKind = getPostScheduleKind(post.kind);
  const posts = await getPosts(env);
  if (isPublishDateTaken(posts, scheduleKind, dateKey, postId)) {
    await sendMessage(env, chatId, "این روز همین الان پر شده. دوباره تایید را بزن و یک روز آزاد انتخاب کن.");
    return;
  }

  const scheduledAt = tehranDateKeyToIso(dateKey, DEFAULT_POST_HOUR, DEFAULT_POST_MINUTE);
  if (!scheduledAt || Date.parse(scheduledAt) <= Date.now()) {
    await sendMessage(env, chatId, "این زمان دیگر قابل استفاده نیست. یک روز آینده را انتخاب کن.");
    return;
  }

  post.status = "scheduled";
  post.scheduleKind = scheduleKind;
  post.scheduledDate = dateKey;
  post.scheduledAt = scheduledAt;
  post.scheduledLabel = formatTehranSlot(scheduledAt);
  post.scheduledBy = String(query.from.id);
  post.scheduledCreatedAt = new Date().toISOString();
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));
  await updateListItem(env, "posts", postId, (item) => ({
    ...item,
    status: "scheduled",
    scheduleKind,
    scheduledDate: dateKey,
    scheduledAt,
    scheduledLabel: post.scheduledLabel,
    scheduledBy: post.scheduledBy
  }));

  await sendMessage(env, post.userId, `✅ پستت تایید شد و برای انتشار زمان‌بندی شد.\n\nزمان انتشار: ${post.scheduledLabel}`);
  await sendMessage(env, chatId, `✅ زمان‌بندی شد.\nکد: ${postId}\nزمان انتشار: ${post.scheduledLabel}`);
}

async function askPostRejectReason(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }

  await sendMessage(env, chatId, `❌ دلیل رد شدن پست را انتخاب کن:\n\nکد: ${postId}`, keyboard([
    [{ text: "کیفیت نامناسب عکس/فیلم", callback_data: `post:reject_reason:${postId}:low_quality` }],
    [{ text: "عدم رعایت نکات اخلاقی", callback_data: `post:reject_reason:${postId}:ethics` }],
    [{ text: "عدم جذابیت لازم", callback_data: `post:reject_reason:${postId}:not_attractive` }],
    [{ text: "✍️ نوشتن دلیل دلخواه", callback_data: `post:reject_custom:${postId}` }]
  ]));
}

async function rejectPostWithReason(env, query, postId, reason) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }
  const finalReason = cleanText(reason);
  if (!finalReason) {
    await sendMessage(env, chatId, "دلیل رد شدن خالی است.");
    return;
  }

  post.status = "rejected";
  post.rejectedAt = new Date().toISOString();
  post.rejectedBy = String(query.from.id);
  post.rejectReason = finalReason;
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));
  await updateListItem(env, "posts", postId, (item) => ({ ...item, status: "rejected", rejectedAt: post.rejectedAt, rejectedBy: post.rejectedBy, rejectReason: finalReason }));

  await sendMessage(env, post.userId, ["❌ پستت تایید نشد.", "", `دلیل: ${finalReason}`].join("\n"));
  await sendMessage(env, chatId, `❌ پست رد شد.\nکد: ${postId}\nدلیل: ${finalReason}`);
}

async function startCustomPostReject(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا قبلاً بررسی شده.");
    return;
  }
  await setState(env, String(query.from.id), { mode: "admin_reject_post_custom", postId });
  await sendMessage(env, chatId, `✍️ دلیل رد شدن پست را بنویس:\n\nکد: ${postId}\nلغو: /cancel`);
}

async function finishCustomPostReject(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;
  const reason = cleanText(text);
  if (reason.length < 3 || reason.length > 500) {
    await sendMessage(env, chatId, "❌ دلیل باید بین ۳ تا ۵۰۰ کاراکتر باشد. دوباره بنویس:");
    return;
  }
  await clearState(env, userId);
  await rejectPostWithReason(env, { message, from: message.from }, state.postId, reason);
}

async function handleAdminCallback(env, query, data) {
  const chatId = String(query.message.chat.id);

  if (data === "admin:panel") {
    await clearState(env, String(query.from.id));
    await sendAdminPanel(env, chatId);
    return;
  }

  if (data === "admin:special_post_start") {
    await clearState(env, String(query.from.id));
    await startSpecialPost(env, query);
    return;
  }

  if (data === "admin:list_custom_images") {
    await clearState(env, String(query.from.id));
    await listCustomImageRequests(env, chatId);
    return;
  }

  if (data === "admin:list_special_posts") {
    await listSpecialPosts(env, chatId);
    return;
  }

  if (data === "admin:add_slot") {
    await setState(env, String(query.from.id), { mode: "admin_add_slot" });
    await sendMessage(
      env,
      chatId,
      "➕ زمان مشاوره را وارد کن.\n\nمثال:\nامروز ۲۰:۰۰\nفردا ۰۴:۰۰\nیکشنبه ۰۳:۰۰\n2026-07-22 20:30\n\nساعت بر اساس تهران ذخیره می‌شود.\nلغو: /cancel"
    );
    return;
  }

  if (data === "admin:add_release_slot") {
    await setState(env, String(query.from.id), { mode: "admin_add_release_slot" });
    await sendMessage(
      env,
      chatId,
      "💧 زمان تخلیه آب بیغیرتی را وارد کن.\n\nمثال:\nامروز ۲۰:۰۰\nفردا ۰۴:۰۰\nیکشنبه ۰۳:۰۰\n2026-07-22 20:30\n\nلغو: /cancel"
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

  if (data === "admin:list_scheduled_posts") {
    await listScheduledPosts(env, chatId);
    return;
  }

  if (data === "admin:list_pending_posts") {
    await listPendingPosts(env, chatId);
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

  if (data === "admin:list_support") {
    await listSupportTickets(env, chatId);
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
    await clearState(env, String(query.from.id));
    await showBroadcastRecipientMenu(env, query);
    return;
  }

  if (data === "admin:list_banned") {
    await listBannedUsers(env, chatId);
    return;
  }

  if (data === "admin:ban_user") {
    await setState(env, String(query.from.id), { mode: "admin_ban_user" });
    await sendMessage(
      env,
      chatId,
      [
        "⛔️ بن کردن کاربر",
        "",
        "یوزرنیم، آیدی عددی، یا نام ثبت‌نامی کاربر را بفرست.",
        "مثال: @username",
        "",
        "بن به مدت ۲ روز فعال می‌شود.",
        "لغو: /cancel"
      ].join("\n"),
      keyboard(BACK_TO_MENU)
    );
    return;
  }

  if (data === "admin:add_preverified_cuckolds") {
    await setState(env, String(query.from.id), { mode: "admin_preverified_cuckolds" });
    await sendMessage(
      env,
      chatId,
      [
        "🟢 افزودن لیست کاکولدهای تایید شده",
        "",
        "یوزرنیم تلگرام کاربران را با @ بفرست؛ هر خط یک آیدی یا همه را پشت سر هم با فاصله/کاما.",
        "",
        "مثال:",
        "@username1",
        "@username2, @username3",
        "",
        "بعد از ثبت، اگر این افراد با همان یوزرنیم ثبت‌نام کنند و نوعشان کاکولد باشد، دیگر اثبات از آن‌ها خواسته نمی‌شود.",
        "",
        "لغو: /cancel"
      ].join("\n"),
      keyboard(BACK_TO_MENU)
    );
    return;
  }

  if (data === "admin:set_bot_profile") {
    await setBotProfile(env, chatId);
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
    const scheduledPosts = posts.filter((post) => post.status === "scheduled");
    const publishedPosts = posts.filter((post) => post.status === "published");
    const rejectedPosts = posts.filter((post) => post.status === "rejected");
    const canceledPosts = posts.filter((post) => post.status === "canceled");
    const tests = await getList(env, "test_results");
    const profiles = await getProfiles(env);
    const optimizedTestCount = profiles.reduce((sum, profile) => sum + Number(profile.testCount || 0), 0);
    const proofs = await getProofs(env);
    const supportTickets = await getSupportTickets(env);
    const openSupportTickets = supportTickets.filter((ticket) => ticket.status !== "answered");
    const pendingProofs = proofs.filter((proof) => proof.status === "pending");
    const releases = await getList(env, "release_requests");
    const verified = profiles.filter((profile) => profile.cuckoldVerified);
    const verifiedHotwives = profiles.filter((profile) => profile.hotwifeVerified);
    const preverifiedHandles = await getPreverifiedCuckoldHandles(env);
    const specialPosts = await getSpecialPosts(env);
    const activeSpecialPosts = specialPosts.filter((post) => post.status === "scheduled");
    await sendMessage(
      env,
      chatId,
      [
        `📦 آمار سریع`,
        "",
        `ثبت‌نامی‌ها: ${profiles.length}`,
        `کاکولدهای تایید شده: ${verified.length}`,
        `یوزرنیم‌های تایید دستی: ${preverifiedHandles.length}`,
        `هاتوایف‌های تایید شده: ${verifiedHotwives.length}`,
        `درخواست‌های اثبات: ${proofs.length}`,
        `اثبات‌های در انتظار: ${pendingProofs.length}`,
        `نوبت‌های مشاوره: ${bookings.length}`,
        `درخواست‌های تخلیه: ${releases.length}`,
        `پست‌ها: ${posts.length}`,
        `پست‌های زمان‌بندی‌شده: ${scheduledPosts.length}`,
        `پست‌های منتشر شده: ${publishedPosts.length}`,
        `پست‌های رد شده: ${rejectedPosts.length}`,
        `پست‌های لغو شده: ${canceledPosts.length}`,
        `پست‌های ویژه فعال: ${activeSpecialPosts.length}`,
        `درخواست‌های پشتیبانی: ${supportTickets.length}`,
        `پشتیبانی پاسخ نداده: ${openSupportTickets.length}`,
        `نتایج تست غیرت: ${tests.length + optimizedTestCount}`
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
    await sendMessage(env, chatId, "❌ زمان را اینطوری بفرست:\n\nامروز ۲۰:۰۰\nفردا ۰۴:۰۰\nیکشنبه ۰۳:۰۰\n2026-07-22 20:30");
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
  const notification = await notifyVerifiedCuckoldsAboutSlot(env, slot);
  await sendMessage(
    env,
    chatId,
    `✅ زمان اضافه شد:\n${slot.label}\n\n📣 اعلان برای ${notification.total} کاکولد تاییدشده ثبت شد.`,
    keyboard(ADMIN_MENU)
  );
}

async function finishAddReleaseSlot(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const slotLabel = cleanText(text);
  const startsAt = parseTehranDateTime(slotLabel);
  if (!startsAt) {
    await sendMessage(env, chatId, "❌ زمان را اینطوری بفرست:\n\nامروز ۲۰:۰۰\nفردا ۰۴:۰۰\nیکشنبه ۰۳:۰۰\n2026-07-22 20:30");
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
  const notification = await notifyVerifiedCuckoldsAboutSlot(env, slot);
  await sendMessage(
    env,
    chatId,
    `✅ زمان تخلیه اضافه شد:\n${slot.label}\n\n📣 اعلان برای ${notification.total} کاکولد تاییدشده ثبت شد.`,
    keyboard(ADMIN_MENU)
  );
}

async function finishPreverifiedCuckoldIds(env, message, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const handles = parseTelegramHandles(text);
  if (!handles.length) {
    await sendMessage(env, chatId, "❌ هیچ یوزرنیم @دار معتبری پیدا نکردم. دوباره مثل @username بفرست:", keyboard(BACK_TO_MENU));
    return;
  }

  const result = await addPreverifiedCuckoldHandles(env, handles);
  const appliedCount = await applyPreverifiedCuckoldHandlesToExistingProfiles(env, handles);
  await clearState(env, userId);
  await sendMessage(
    env,
    chatId,
    [
      "🟢 لیست تایید دستی ثبت شد.",
      "",
      `یوزرنیم‌های جدید: ${result.added}`,
      `کل یوزرنیم‌های ذخیره‌شده: ${result.total}`,
      `کاربران ثبت‌نام‌کرده‌ای که همین الان تایید شدند: ${appliedCount}`,
      "",
      "از این به بعد اگر این یوزرنیم‌ها با نوع کاکولد ثبت‌نام کنند، پیام «شما کاکولد اثبات شده هستید» می‌گیرند و اثبات لازم ندارند."
    ].join("\n"),
    keyboard(ADMIN_MENU)
  );
}

async function finishManualUserBan(env, message, text) {
  const chatId = String(message.chat.id);
  const adminId = String(message.from.id);
  if (!isAdmin(env, adminId)) return;

  const profile = await findProfileForAdmin(env, text);
  if (!profile) {
    await sendMessage(env, chatId, "❌ کاربر پیدا نشد. یوزرنیم، آیدی عددی یا نام ثبت‌نامی را دقیق‌تر بفرست:", keyboard(BACK_TO_MENU));
    return;
  }

  const ban = await banUser(env, profile.userId, {
    username: profile.username || "",
    name: profile.name || "",
    reason: "بن دستی توسط ادمین",
    source: "admin",
    bannedBy: adminId
  });
  await clearState(env, adminId);
  await sendMessage(env, chatId, `⛔️ کاربر تا ${formatDateTime(ban.expiresAt)} بن شد.\n\n${profile.name || "-"} | ${profile.username || profile.userId}`, keyboard(ADMIN_MENU));
  await sendMessage(env, profile.userId, "⛔️ شما تا دو روز بن شدید و در این مدت نمی‌توانید چیزی به ربات بفرستید.").catch(() => {});
}

async function setBotProfile(env, chatId) {
  await telegram(env, "setMyShortDescription", { short_description: BOT_SHORT_DESCRIPTION });
  await telegram(env, "setMyDescription", { description: BOT_DESCRIPTION });
  await telegram(env, "setMyCommands", {
    commands: [
      { command: "start", description: "شروع و منوی اصلی" },
      { command: "admin", description: "پنل مدیریت" },
      { command: "cancel", description: "لغو عملیات فعلی" }
    ]
  });
  await sendMessage(env, chatId, "🟢 توضیحات اولیه، معرفی کوتاه و دستورهای ربات تنظیم شد.", keyboard(ADMIN_MENU));
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

async function startSpecialPost(env, query) {
  await sendMessage(
    env,
    String(query.message.chat.id),
    [
      "⭐ ساخت پست ویژه",
      "",
      "نوع پست را انتخاب کن. بعد از دریافت عکس و متن، می‌توانی دکمه لینک‌دار، زمان انتشار و تکرار را تنظیم کنی."
    ].join("\n"),
    keyboard([
      [{ text: "🖼 عکس + متن", callback_data: "special:type:photo" }],
      [{ text: "📝 فقط متن", callback_data: "special:type:text" }],
      [{ text: "❌ لغو و برگشت", callback_data: "special:abort" }]
    ])
  );
}

async function startSpecialPostType(env, query, kind) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  if (!["photo", "text"].includes(kind)) return;

  if (kind === "photo") {
    await setState(env, userId, { mode: "special_wait_photo", draft: { kind: "photo" } });
    await sendMessage(env, chatId, "🖼 عکس پست ویژه را بفرست.", specialPostCancelKeyboard());
    return;
  }

  await setState(env, userId, { mode: "special_wait_text", draft: { kind: "text", fileId: "" } });
  await sendMessage(env, chatId, "📝 متن کامل پست ویژه را بفرست.", specialPostCancelKeyboard());
}

async function handleSpecialPostPhoto(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  if (!message.photo?.length) {
    await sendMessage(env, chatId, "❌ در این مرحله فقط عکس بفرست.", specialPostCancelKeyboard());
    return;
  }

  const photo = message.photo[message.photo.length - 1];
  await setState(env, userId, {
    mode: "special_wait_text",
    draft: { ...state.draft, kind: "photo", fileId: photo.file_id }
  });
  await sendMessage(env, chatId, "✅ عکس دریافت شد.\n\nحالا متن یا کپشن کامل پست را بفرست.", specialPostCancelKeyboard());
}

async function handleSpecialPostText(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const body = String(text || "").trim();
  const maxLength = state.draft?.kind === "photo" ? 1000 : 4000;
  if (!message.text || body.length < 1 || body.length > maxLength) {
    await sendMessage(env, chatId, `❌ متن باید بین ۱ تا ${maxLength} کاراکتر باشد. دوباره بفرست.`, specialPostCancelKeyboard());
    return;
  }

  await setState(env, userId, {
    mode: "special_wait_button_choice",
    draft: { ...state.draft, text: body }
  });
  await sendMessage(env, chatId, "🔗 برای این پست دکمه لینک‌دار می‌خواهی؟", keyboard([
    [{ text: "➕ افزودن دکمه", callback_data: "special:button:add" }],
    [{ text: "بدون دکمه", callback_data: "special:button:none" }],
    [{ text: "❌ لغو و برگشت", callback_data: "special:abort" }]
  ]));
}

async function askSpecialPostButtonText(env, query) {
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.draft?.text) {
    await sendMessage(env, String(query.message.chat.id), "❌ اطلاعات پست پیدا نشد. دوباره از ساخت پست ویژه شروع کن.", keyboard(ADMIN_MENU));
    return;
  }

  await setState(env, userId, { ...state, mode: "special_wait_button_text" });
  await sendMessage(env, String(query.message.chat.id), "✏️ متن روی دکمه را بفرست.\n\nمثال: مشاهده و عضویت", specialPostCancelKeyboard());
}

async function handleSpecialPostButtonText(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const buttonText = cleanText(text);
  if (!message.text || buttonText.length < 1 || buttonText.length > 64) {
    await sendMessage(env, chatId, "❌ متن دکمه باید بین ۱ تا ۶۴ کاراکتر باشد.", specialPostCancelKeyboard());
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "special_wait_button_url",
    draft: { ...state.draft, buttonText }
  });
  await sendMessage(env, chatId, "🔗 لینک کامل دکمه را بفرست.\n\nمثال: https://t.me/cuckzclub", specialPostCancelKeyboard());
}

async function handleSpecialPostButtonUrl(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const buttonUrl = cleanText(text);
  if (!isValidButtonUrl(buttonUrl)) {
    await sendMessage(env, chatId, "❌ لینک معتبر نیست. لینک باید با https://، http:// یا tg:// شروع شود.", specialPostCancelKeyboard());
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "special_wait_schedule",
    draft: { ...state.draft, buttonUrl }
  });
  await sendMessage(env, chatId, specialPostSchedulePrompt(), specialPostCancelKeyboard());
}

async function askSpecialPostSchedule(env, query, withButton) {
  const userId = String(query.from.id);
  const state = await getState(env, userId);
  if (!state?.draft?.text) {
    await sendMessage(env, String(query.message.chat.id), "❌ اطلاعات پست پیدا نشد. دوباره از ساخت پست ویژه شروع کن.", keyboard(ADMIN_MENU));
    return;
  }

  const draft = withButton ? state.draft : { ...state.draft, buttonText: "", buttonUrl: "" };
  await setState(env, userId, { ...state, mode: "special_wait_schedule", draft });
  await sendMessage(env, String(query.message.chat.id), specialPostSchedulePrompt(), specialPostCancelKeyboard());
}

async function handleSpecialPostSchedule(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  const scheduleText = normalizeDigits(cleanText(text));
  const scheduledAt = scheduleText === "الان"
    ? new Date(Date.now() + 5000).toISOString()
    : parseTehranDateTime(scheduleText);
  if (!scheduledAt) {
    await sendMessage(env, chatId, `❌ زمان معتبر نیست.\n\n${specialPostSchedulePrompt()}`, specialPostCancelKeyboard());
    return;
  }

  await setState(env, userId, {
    ...state,
    mode: "special_wait_repeat",
    draft: { ...state.draft, scheduledAt }
  });
  await sendMessage(env, chatId, "🔁 تکرار پست را انتخاب کن:", keyboard([
    [{ text: "فقط یک‌بار", callback_data: "special:repeat:none" }],
    [{ text: "هر ساعت", callback_data: "special:repeat:hourly" }],
    [{ text: "هر روز", callback_data: "special:repeat:daily" }],
    [{ text: "هر هفته", callback_data: "special:repeat:weekly" }],
    [{ text: "❌ لغو و برگشت", callback_data: "special:abort" }]
  ]));
}

async function finishSpecialPost(env, query, recurrence) {
  const chatId = String(query.message.chat.id);
  const userId = String(query.from.id);
  if (!["none", "hourly", "daily", "weekly"].includes(recurrence)) return;

  const state = await getState(env, userId);
  const draft = state?.draft;
  if (state?.mode !== "special_wait_repeat" || !draft?.text || !draft?.scheduledAt) {
    await sendMessage(env, chatId, "❌ اطلاعات پست کامل نیست. دوباره از ساخت پست ویژه شروع کن.", keyboard(ADMIN_MENU));
    return;
  }

  const post = {
    id: shortId(),
    kind: draft.kind,
    fileId: draft.fileId || "",
    text: draft.text,
    buttonText: draft.buttonText || "",
    buttonUrl: draft.buttonUrl || "",
    scheduledAt: draft.scheduledAt,
    recurrence,
    status: "scheduled",
    publishCount: 0,
    createdAt: new Date().toISOString(),
    createdBy: userId
  };
  const posts = await getSpecialPosts(env);
  posts.push(post);
  await saveSpecialPosts(env, posts);
  await clearState(env, userId);

  await sendMessage(
    env,
    chatId,
    [
      "✅ پست ویژه ساخته و زمان‌بندی شد.",
      "",
      `کد: ${post.id}`,
      `زمان اولین انتشار: ${formatDateTime(post.scheduledAt)}`,
      `تکرار: ${specialRecurrenceLabel(post.recurrence)}`
    ].join("\n")
  );
  await sendSpecialPostMessage(env, chatId, post, true);
}

async function listSpecialPosts(env, chatId) {
  const posts = (await getSpecialPosts(env))
    .filter((post) => post.status === "scheduled")
    .sort((a, b) => Date.parse(a.scheduledAt) - Date.parse(b.scheduledAt));
  if (!posts.length) {
    await sendMessage(env, chatId, "⭐ پست ویژه زمان‌بندی‌شده‌ای وجود ندارد.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = ["⭐ پست‌های ویژه زمان‌بندی‌شده", ""];
  const rows = [];
  for (const post of posts.slice(0, 25)) {
    const preview = cleanText(post.text).slice(0, 45);
    lines.push(`${formatDateTime(post.scheduledAt)} | ${specialRecurrenceLabel(post.recurrence)} | ${preview}${post.text.length > 45 ? "..." : ""} | کد ${post.id}`);
    rows.push([{ text: `❌ لغو ${post.id}`, callback_data: `special:cancel:${post.id}` }]);
  }
  rows.push([{ text: "↩️ پنل ادمین", callback_data: "admin:panel" }]);
  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function cancelSpecialPost(env, query, postId) {
  const posts = await getSpecialPosts(env);
  const post = posts.find((item) => item.id === postId && item.status === "scheduled");
  if (!post) {
    await sendMessage(env, String(query.message.chat.id), "این پست ویژه پیدا نشد یا قبلاً متوقف شده است.", keyboard(ADMIN_MENU));
    return;
  }
  post.status = "canceled";
  post.canceledAt = new Date().toISOString();
  post.canceledBy = String(query.from.id);
  await saveSpecialPosts(env, posts);
  await sendMessage(env, String(query.message.chat.id), `✅ انتشار پست ویژه متوقف شد.\nکد: ${post.id}`, keyboard(ADMIN_MENU));
}

function specialPostSchedulePrompt() {
  return [
    "🗓 زمان اولین انتشار را به وقت تهران بفرست.",
    "",
    "نمونه‌ها:",
    "الان",
    "امروز ۲۰:۳۰",
    "فردا ۰۹:۰۰",
    "یکشنبه ۱۸:۱۵",
    "2026-09-25 14:00"
  ].join("\n");
}

function specialPostCancelKeyboard() {
  return keyboard([[{ text: "❌ لغو و برگشت پنل", callback_data: "special:abort" }]]);
}

function isValidButtonUrl(value) {
  try {
    const url = new URL(String(value || ""));
    return ["http:", "https:", "tg:"].includes(url.protocol);
  } catch {
    return false;
  }
}

function specialRecurrenceLabel(value) {
  return ({ none: "فقط یک‌بار", hourly: "هر ساعت", daily: "هر روز", weekly: "هر هفته" })[value] || "-";
}

async function listBannedUsers(env, chatId) {
  const bans = await getActiveBans(env);
  if (!bans.length) {
    await sendMessage(env, chatId, "🟢 هیچ کاربر بن‌شده فعالی نداریم.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = ["🚫 لیست بن‌شده‌های فعال", ""];
  const rows = [];
  for (const ban of bans.slice(0, 25)) {
    const profile = await getProfile(env, ban.userId);
    const name = profile?.name || ban.name || ban.firstName || "-";
    const username = profile?.username || ban.username || "";
    lines.push(`${name} | ${username || ban.userId} | تا ${formatDateTime(ban.expiresAt)} | ${ban.reason || "-"}`);
    rows.push([{ text: `🟢 رفع بن ${name}`, callback_data: `ban:unban:${ban.userId}` }]);
  }
  if (bans.length > 25) lines.push(`... و ${bans.length - 25} مورد دیگر`);
  rows.push([{ text: "↩️ پنل ادمین", callback_data: "admin:stats" }]);
  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function unbanUser(env, query, targetUserId) {
  const chatId = String(query.message.chat.id);
  await env.BOT_KV.delete(`ban:${targetUserId}`);
  await env.BOT_KV.delete(`invalid:${targetUserId}`);
  await sendMessage(env, chatId, `🟢 بن کاربر برداشته شد.\n\nUser ID: ${targetUserId}`, keyboard(ADMIN_MENU));
  await sendMessage(env, targetUserId, "🟢 بن شما برداشته شد. می‌توانید دوباره از ربات استفاده کنید.").catch(() => {});
}

async function listScheduledPosts(env, chatId) {
  const posts = (await getPosts(env))
    .filter((post) => post.status === "scheduled")
    .sort((a, b) => Date.parse(a.scheduledAt || "9999-12-31") - Date.parse(b.scheduledAt || "9999-12-31"));

  if (!posts.length) {
    await sendMessage(env, chatId, "هیچ پستی در دست انتشار نیست.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = ["📌 پست‌های در دست انتشار", ""];
  const rows = [];
  for (const post of posts.slice(0, 20)) {
    const profile = await getProfile(env, post.userId);
    lines.push(`${formatDateTime(post.scheduledAt)} | ${postTypeLabel(post.kind)} | ${profile?.name || post.firstName || "-"} | کد ${post.id}`);
    rows.push([{ text: `❌ لغو انتشار ${postTypeLabel(post.kind)} | ${formatDateTime(post.scheduledAt)}`, callback_data: `post:cancel:${post.id}` }]);
  }

  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function listPendingPosts(env, chatId) {
  const refs = await getList(env, "posts");
  const pendingRefs = refs
    .filter((post) => post.status === "pending")
    .reverse()
    .slice(0, 25);
  const pendingPosts = [];

  for (const ref of pendingRefs) {
    const latest = await getJson(env, `post:${ref.id}`);
    if (latest?.status === "pending") {
      pendingPosts.push(latest);
    } else if (latest?.status && latest.status !== ref.status) {
      await updateListItem(env, "posts", ref.id, (item) => ({ ...item, status: latest.status }));
    }
  }

  if (!pendingPosts.length) {
    await sendMessage(env, chatId, "🟢 پست در انتظار بررسی نداریم.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = ["🟡 پست‌های در انتظار بررسی", ""];
  const rows = [];
  for (const post of pendingPosts) {
    lines.push(`${formatDateTime(post.createdAt)} | ${postTypeLabel(post.kind)} | ${post.firstName || post.username || post.userId || "-"} | کد ${post.id}`);
    rows.push([{ text: `👁 مشاهده ${postTypeLabel(post.kind)} | ${post.id}`, callback_data: `post:view:${post.id}` }]);
  }
  rows.push([{ text: "↩️ پنل ادمین", callback_data: "admin:stats" }]);
  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function viewPendingPost(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    if (post?.status) {
      await updateListItem(env, "posts", postId, (item) => ({ ...item, status: post.status }));
    }
    await sendMessage(env, chatId, "این پست پیدا نشد یا دیگر در انتظار بررسی نیست.", keyboard(ADMIN_MENU));
    return;
  }

  const profile = await getProfile(env, post.userId);
  await sendAdminPostPreview(env, post, {
    id: post.userId,
    username: String(profile?.username || post.username || "").replace(/^@/, ""),
    first_name: profile?.name || post.firstName || ""
  });
}

async function showPostEditMenu(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست دیگر قابل ویرایش نیست.", keyboard(ADMIN_MENU));
    return;
  }

  const rows = [[{ text: "📝 ویرایش متن", callback_data: `post:edit_text:${postId}` }]];
  if (["photo", "video"].includes(post.kind)) {
    rows.push([{ text: "🖼 جایگزینی عکس یا فیلم", callback_data: `post:edit_media:${postId}` }]);
  }
  rows.push([{ text: "↩️ برگشت به پیش‌نمایش", callback_data: `post:edit_back:${postId}` }]);
  await sendMessage(env, chatId, `✏️ چه بخشی از پست را ویرایش می‌کنی؟\n\nکد: ${postId}`, keyboard(rows));
}

async function startEditPostText(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending") {
    await sendMessage(env, chatId, "این پست دیگر قابل ویرایش نیست.", keyboard(ADMIN_MENU));
    return;
  }
  await setState(env, String(query.from.id), { mode: "admin_edit_post_text", postId });
  await sendMessage(env, chatId, "📝 متن جدید پست را کامل بفرست.", keyboard([
    [{ text: "↩️ لغو و برگشت", callback_data: `post:edit_back:${postId}` }]
  ]));
}

async function finishEditPostText(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;
  const post = await getJson(env, `post:${state.postId}`);
  if (!post || post.status !== "pending") {
    await clearState(env, userId);
    await sendMessage(env, chatId, "این پست دیگر قابل ویرایش نیست.", keyboard(ADMIN_MENU));
    return;
  }

  const body = String(text || "").trim();
  const maxLength = post.kind === "confession" ? MAX_TEXT_LENGTH : MAX_PHOTO_CAPTION_LENGTH;
  if (!message.text || body.length < 1 || body.length > maxLength) {
    await sendMessage(env, chatId, `❌ متن باید بین ۱ تا ${maxLength} کاراکتر باشد. دوباره بفرست.`);
    return;
  }

  post.text = body;
  post.finalText = post.kind === "confession" ? buildConfessionText(body) : buildMediaCaption(body, post.kind);
  post.editedAt = new Date().toISOString();
  post.editedBy = userId;
  await saveEditedPendingPost(env, post);
  await clearState(env, userId);
  await sendMessage(env, chatId, "✅ متن پست ویرایش شد.");
  await sendStoredPostPreview(env, post);
}

async function startEditPostMedia(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "pending" || !["photo", "video"].includes(post.kind)) {
    await sendMessage(env, chatId, "عکس یا فیلم این پست قابل ویرایش نیست.", keyboard(ADMIN_MENU));
    return;
  }
  await setState(env, String(query.from.id), { mode: "admin_edit_post_media", postId });
  await sendMessage(env, chatId, "🖼 عکس یا فیلم جدید را بفرست.", keyboard([
    [{ text: "↩️ لغو و برگشت", callback_data: `post:edit_back:${postId}` }]
  ]));
}

async function finishEditPostMedia(env, message, state) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;
  const post = await getJson(env, `post:${state.postId}`);
  if (!post || post.status !== "pending") {
    await clearState(env, userId);
    await sendMessage(env, chatId, "این پست دیگر قابل ویرایش نیست.", keyboard(ADMIN_MENU));
    return;
  }

  const media = normalizeMediaFile(message);
  if (!media.ok) {
    await sendMessage(env, chatId, `❌ ${media.error}\n\nعکس یا فیلم جدید را بفرست.`);
    return;
  }

  post.kind = media.kind;
  post.fileId = media.fileId;
  post.scheduleKind = getPostScheduleKind(media.kind);
  post.finalText = buildMediaCaption(post.text, media.kind);
  post.editedAt = new Date().toISOString();
  post.editedBy = userId;
  await saveEditedPendingPost(env, post);
  await clearState(env, userId);
  await sendMessage(env, chatId, "✅ عکس یا فیلم پست جایگزین شد.");
  await sendStoredPostPreview(env, post);
}

async function saveEditedPendingPost(env, post) {
  await env.BOT_KV.put(`post:${post.id}`, JSON.stringify(post));
  await updateListItem(env, "posts", post.id, (item) => ({
    ...item,
    kind: post.kind,
    text: post.text,
    finalText: post.finalText,
    fileId: post.fileId,
    scheduleKind: post.scheduleKind,
    editedAt: post.editedAt,
    editedBy: post.editedBy
  }));
}

async function sendStoredPostPreview(env, post) {
  const profile = await getProfile(env, post.userId);
  await sendAdminPostPreview(env, post, {
    id: post.userId,
    username: String(profile?.username || post.username || "").replace(/^@/, ""),
    first_name: profile?.name || post.firstName || ""
  });
}

async function cancelScheduledPost(env, query, postId) {
  const chatId = String(query.message.chat.id);
  const post = await getJson(env, `post:${postId}`);
  if (!post || post.status !== "scheduled") {
    await sendMessage(env, chatId, "این پست پیدا نشد یا دیگر در دست انتشار نیست.", keyboard(ADMIN_MENU));
    return;
  }

  post.status = "canceled";
  post.canceledAt = new Date().toISOString();
  post.canceledBy = String(query.from.id);
  await env.BOT_KV.put(`post:${postId}`, JSON.stringify(post));
  await updateListItem(env, "posts", postId, (item) => ({ ...item, status: "canceled", canceledAt: post.canceledAt, canceledBy: post.canceledBy }));

  await sendMessage(env, post.userId, `❌ انتشار پستت لغو شد.\n\nکد: ${postId}`);
  await sendMessage(env, chatId, `✅ انتشار لغو شد.\nکد: ${postId}`, keyboard(ADMIN_MENU));
}

async function cancelPointServiceRequest(env, query, kind, requestId) {
  const chatId = String(query.message.chat.id);
  const isBooking = kind === "booking";
  const key = isBooking ? `booking:${requestId}` : `release:${requestId}`;
  const listName = isBooking ? "bookings" : "release_requests";
  const request = await getJson(env, key);
  if (!request || request.status !== "scheduled") {
    await sendMessage(env, chatId, "این درخواست پیدا نشد یا قبلاً لغو شده است.", keyboard(ADMIN_MENU));
    return;
  }

  request.status = "canceled";
  request.canceledAt = new Date().toISOString();
  request.canceledBy = String(query.from.id);
  let refund = null;
  if (request.pointsCost) {
    refund = await refundPoints(
      env,
      request.userId,
      request.pointsCost,
      `refund:${kind}:${requestId}`,
      `بازگشت امتیاز لغو ${isBooking ? "مشاوره" : "تخلیه"}`
    );
    request.pointsRefundedAt = new Date().toISOString();
  }
  await env.BOT_KV.put(key, JSON.stringify(request));
  await updateListItem(env, listName, requestId, (item) => ({ ...item, ...request }));

  const slot = await getJson(env, `slot:${request.slotId}`);
  if (slot?.status === "booked") {
    slot.status = "open";
    slot.bookedBy = "";
    slot.bookingId = "";
    slot.releaseRequestId = "";
    await env.BOT_KV.put(`slot:${slot.id}`, JSON.stringify(slot));
    await updateListItem(env, "slots", slot.id, (item) => ({ ...item, ...slot }));
  }

  await sendMessage(
    env,
    request.userId,
    `❌ درخواست شما توسط ادمین لغو شد.${refund ? `\n\n⭐ ${request.pointsCost} امتیاز برگشت داده شد.\nموجودی: ${refund.balance} ⭐` : ""}`
  );
  await sendMessage(env, chatId, `✅ درخواست لغو شد${refund ? " و امتیاز برگشت داده شد" : ""}.`, keyboard(ADMIN_MENU));
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

async function listSupportTickets(env, chatId) {
  const tickets = (await getSupportTickets(env)).sort((a, b) => Date.parse(b.createdAt || 0) - Date.parse(a.createdAt || 0));
  if (!tickets.length) {
    await sendMessage(env, chatId, "درخواست پشتیبانی ثبت نشده.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = ["🆘 درخواست‌های پشتیبانی", ""];
  const rows = [];
  for (const ticket of tickets.slice(0, 20)) {
    const statusLabel = ticket.status === "answered" ? "پاسخ داده" : "پاسخ نداده";
    lines.push(`${statusLabel} | ${formatDateTime(ticket.createdAt)} | ${ticket.profileName || ticket.firstName || "-"} | کد ${ticket.id}`);
    rows.push([{ text: `👁 ${statusLabel} | ${ticket.profileName || ticket.firstName || ticket.id}`, callback_data: `support:view:${ticket.id}` }]);
  }

  await sendMessage(env, chatId, lines.join("\n"), keyboard(rows));
}

async function viewSupportTicket(env, query, ticketId) {
  const chatId = String(query.message.chat.id);
  const ticket = await getJson(env, `support:${ticketId}`);
  if (!ticket) {
    await sendMessage(env, chatId, "درخواست پشتیبانی پیدا نشد.", keyboard(ADMIN_MENU));
    return;
  }

  const lines = [
    "🆘 درخواست پشتیبانی",
    "",
    `کد: ${ticket.id}`,
    `وضعیت: ${ticket.status === "answered" ? "پاسخ داده" : "پاسخ نداده"}`,
    `کاربر: ${ticket.profileName || ticket.firstName || "-"} | ${ticket.username ? `@${ticket.username}` : ticket.userId}`,
    `زمان: ${formatDateTime(ticket.createdAt)}`,
    "",
    "متن کاربر:",
    ticket.body
  ];
  if (ticket.answer) {
    lines.push("", "پاسخ ادمین:", ticket.answer);
  }

  await sendMessage(env, chatId, lines.join("\n"), keyboard([
    [{ text: "✉️ پاسخ", callback_data: `support:reply:${ticket.id}` }],
    [{ text: "↩️ لیست پشتیبانی", callback_data: "admin:list_support" }]
  ]));
}

async function startSupportReply(env, query, ticketId) {
  const chatId = String(query.message.chat.id);
  const ticket = await getJson(env, `support:${ticketId}`);
  if (!ticket) {
    await sendMessage(env, chatId, "درخواست پشتیبانی پیدا نشد.", keyboard(ADMIN_MENU));
    return;
  }

  await setState(env, String(query.from.id), { mode: "admin_support_reply", ticketId });
  await sendMessage(env, chatId, `✉️ پاسخ پشتیبانی را بنویس:\n\nکد: ${ticketId}\nلغو: /cancel`);
}

async function finishSupportReply(env, message, state, text) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (!isAdmin(env, userId)) return;

  const answer = cleanText(text);
  if (answer.length < 2 || answer.length > 3000) {
    await sendMessage(env, chatId, "❌ پاسخ باید بین ۲ تا ۳۰۰۰ کاراکتر باشد. دوباره بنویس:");
    return;
  }

  const ticket = await getJson(env, `support:${state.ticketId}`);
  if (!ticket) {
    await clearState(env, userId);
    await sendMessage(env, chatId, "درخواست پشتیبانی پیدا نشد.", keyboard(ADMIN_MENU));
    return;
  }

  ticket.status = "answered";
  ticket.answer = answer;
  ticket.answeredAt = new Date().toISOString();
  ticket.answeredBy = userId;
  await env.BOT_KV.put(`support:${ticket.id}`, JSON.stringify(ticket));
  await updateListItem(env, "support_tickets", ticket.id, (item) => ({ ...item, status: "answered", answer, answeredAt: ticket.answeredAt, answeredBy: userId }));
  await clearState(env, userId);

  await sendMessage(env, ticket.userId, ["🆘 پاسخ پشتیبانی", "", `کد: ${ticket.id}`, "", answer].join("\n"), keyboard(await getMainMenuForUser(env, ticket.userId)));
  await sendMessage(env, chatId, `✅ پاسخ ارسال شد.\nکد: ${ticket.id}`, keyboard(ADMIN_MENU));
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
    ["کد نوبت", "وضعیت", "زمان نوبت", "نام", "راه تماس", "موضوع", "شناسه تلگرام", "یوزرنیم", "تاریخ ثبت"],
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
  await sendExcel(env, chatId, `bookings-${today()}.xlsx`, "نوبت‌ها", rows, "📊 فایل مرتب نوبت‌های مشاوره");
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

async function showBroadcastRecipientMenu(env, query) {
  await sendMessage(env, String(query.message.chat.id), "📣 ابتدا گیرنده پیام را انتخاب کن:", keyboard([
    [{ text: "همه کاربران", callback_data: "broadcast:compose:all" }],
    [{ text: "همه کاکولدها", callback_data: "broadcast:compose:cuckolds" }],
    [{ text: "کاکولدهای تایید شده", callback_data: "broadcast:compose:verified_cuckolds" }],
    [{ text: "ارسال به فرد خاص", callback_data: "broadcast:pick_individual" }],
    [{ text: "لغو", callback_data: "admin:panel" }]
  ]));
}

async function startBroadcastCompose(env, query, target) {
  const chatId = String(query.message.chat.id);
  const labels = {
    all: "همه کاربران",
    cuckolds: "همه کاکولدها",
    verified_cuckolds: "کاکولدهای تایید شده"
  };
  if (!labels[target]) return;

  await setState(env, String(query.from.id), { mode: "admin_broadcast_compose", target });

  await sendMessage(
    env,
    chatId,
    `📣 متن پیام را در پاسخ به همین پیام بفرست.\n\nگیرنده: ${labels[target]}`,
    { reply_markup: { force_reply: true, input_field_placeholder: "متن پیام را بنویس..." } }
  );
}

async function askBroadcastIndividualTarget(env, query) {
  await setState(env, String(query.from.id), { mode: "admin_broadcast_individual_target" });
  await sendMessage(
    env,
    String(query.message.chat.id),
    "👤 آیدی عددی، @username یا نام ثبت‌نامی گیرنده را در پاسخ به همین پیام بفرست.\n\nمرحله: انتخاب گیرنده خصوصی",
    { reply_markup: { force_reply: true, input_field_placeholder: "آیدی یا نام گیرنده" } }
  );
}

function parseBroadcastReply(replyText) {
  const prompt = String(replyText || "");
  if (prompt.includes("مرحله: انتخاب گیرنده خصوصی")) return { kind: "individual_target" };

  const individual = prompt.match(/گیرنده خصوصی:\s*(\d+)/);
  if (individual) return { kind: "individual_body", userId: individual[1] };

  if (prompt.includes("گیرنده: همه کاربران")) return { kind: "group", target: "all" };
  if (prompt.includes("گیرنده: همه کاکولدها")) return { kind: "group", target: "cuckolds" };
  if (prompt.includes("گیرنده: کاکولدهای تایید شده")) return { kind: "group", target: "verified_cuckolds" };
  return null;
}

async function handleBroadcastReply(env, message, action, text) {
  const chatId = String(message.chat.id);
  const body = String(text || "").trim();

  if (action.kind === "individual_target") {
    const profile = await findProfileForAdmin(env, body);
    if (!profile) {
      await sendMessage(
        env,
        chatId,
        "❌ کاربر پیدا نشد. آیدی عددی، @username یا نام ثبت‌نامی را دوباره Reply کن.\n\nمرحله: انتخاب گیرنده خصوصی",
        { reply_markup: { force_reply: true, input_field_placeholder: "آیدی یا نام گیرنده" } }
      );
      return;
    }

    await setState(env, String(message.from.id), {
      mode: "admin_broadcast_individual_body",
      targetUserId: String(profile.userId)
    });

    await sendMessage(
      env,
      chatId,
      `📣 متن پیام برای ${profile.name || profile.username || profile.userId} را در پاسخ به همین پیام بفرست.\n\nگیرنده خصوصی: ${profile.userId}`,
      { reply_markup: { force_reply: true, input_field_placeholder: "متن پیام را بنویس..." } }
    );
    return;
  }

  if (body.length < 2 || body.length > 3500) {
    await sendMessage(env, chatId, "❌ متن پیام باید بین ۲ تا ۳۵۰۰ کاراکتر باشد. دوباره از پنل ادمین شروع کن.", keyboard(ADMIN_MENU));
    return;
  }

  if (action.kind === "individual_body") {
    await clearState(env, String(message.from.id));
    try {
      await sendMessage(env, action.userId, body);
      await sendMessage(env, chatId, "✅ پیام برای کاربر ارسال شد.", keyboard(ADMIN_MENU));
    } catch (error) {
      await sendMessage(env, chatId, `❌ ارسال پیام انجام نشد.\n\n${String(error?.message || error)}`, keyboard(ADMIN_MENU));
    }
    return;
  }

  await clearState(env, String(message.from.id));
  await deliverBroadcast(env, chatId, action.target, body);
}

async function deliverBroadcast(env, chatId, target, body) {
  const recipients = await getBroadcastAudience(env, target);
  if (!recipients.length) {
    await sendMessage(env, chatId, "هیچ کاربری در این گروه پیدا نشد.", keyboard(ADMIN_MENU));
    return;
  }

  const firstBatch = recipients.slice(0, BROADCAST_BATCH_SIZE);
  const result = await sendBroadcastBatch(env, firstBatch, body);
  const remaining = recipients.slice(BROADCAST_BATCH_SIZE);

  if (!remaining.length) {
    await sendMessage(env, chatId, `📣 ارسال پیام تمام شد.\n\n✅ موفق: ${result.sent}\n❌ ناموفق: ${result.failed}`, keyboard(ADMIN_MENU));
    return;
  }

  const job = {
    id: shortId(),
    adminChatId: String(chatId),
    body,
    recipients: remaining,
    sent: result.sent,
    failed: result.failed,
    total: recipients.length,
    createdAt: new Date().toISOString()
  };
  const queue = (await getJson(env, "broadcast_queue")) || [];
  queue.push(job);
  await env.BOT_KV.put("broadcast_queue", JSON.stringify(queue.slice(-10)));

  await sendMessage(
    env,
    chatId,
    `📣 ارسال شروع شد.\n\n✅ ارسال‌شده: ${result.sent}\n⏳ باقی‌مانده: ${remaining.length}\n\nبقیه پیام‌ها خودکار و مرحله‌ای ارسال می‌شوند.`,
    keyboard(ADMIN_MENU)
  );
}

async function getBroadcastAudience(env, target) {
  const snapshots = await getProfileSnapshots(env);
  if (target === "all") return snapshots.map((profile) => String(profile.userId));
  if (target === "cuckolds") {
    return snapshots.filter((profile) => profile.type === "cuckold").map((profile) => String(profile.userId));
  }

  const proofRefs = await getList(env, "proofs");
  const approvedIds = new Set(
    proofRefs
      .filter((proof) => proof.status === "approved" && proof.proofType !== "hotwife")
      .map((proof) => String(proof.userId))
  );
  const preverified = new Set((await getPreverifiedCuckoldHandles(env)).map(normalizeTelegramHandle));
  return snapshots
    .filter((profile) => profile.type === "cuckold")
    .filter((profile) => profile.cuckoldVerified || approvedIds.has(String(profile.userId)) || preverified.has(normalizeTelegramHandle(profile.username)))
    .map((profile) => String(profile.userId));
}

async function notifyVerifiedCuckoldsAboutSlot(env, slot) {
  const recipients = await getBroadcastAudience(env, "verified_cuckolds");
  if (!recipients.length) return { total: 0, sent: 0, queued: 0 };

  const isRelease = slot.purpose === "release";
  const body = [
    isRelease ? "💧 زمان جدید تخلیه آب بیغیرتی آزاد شد" : "📅 زمان جدید مشاوره آزاد شد",
    "",
    `🕐 زمان: ${slot.label}`,
    "",
    "این زمان هنوز خالی است. قبل از اینکه توسط فرد دیگری رزرو شود، سریع از منوی ربات رزرو کن.",
    "",
    isRelease ? "مسیر رزرو: تخلیه آب بیغیرتی" : "مسیر رزرو: نوبت مشاوره"
  ].join("\n");

  const firstBatch = recipients.slice(0, BROADCAST_BATCH_SIZE);
  const result = await sendBroadcastBatch(env, firstBatch, body);
  const remaining = recipients.slice(BROADCAST_BATCH_SIZE);
  if (remaining.length) {
    const queue = (await getJson(env, "broadcast_queue")) || [];
    queue.push({
      id: shortId(),
      adminChatId: String(env.ADMIN_CHAT_ID),
      body,
      recipients: remaining,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
      notifyAdminOnComplete: false,
      createdAt: new Date().toISOString()
    });
    await env.BOT_KV.put("broadcast_queue", JSON.stringify(queue.slice(-10)));
  }

  return { total: recipients.length, sent: result.sent, queued: remaining.length };
}

async function getProfileSnapshots(env) {
  const refs = await getList(env, "profiles");
  const byUser = new Map();
  for (const profile of refs) {
    if (profile?.registered && profile.userId) byUser.set(String(profile.userId), profile);
  }
  return [...byUser.values()];
}

async function sendBroadcastBatch(env, recipients, body) {
  let sent = 0;
  let failed = 0;
  for (const userId of recipients) {
    try {
      await sendMessage(env, userId, body);
      sent += 1;
    } catch {
      failed += 1;
    }
  }
  return { sent, failed };
}

async function processBroadcastQueue(env) {
  const queue = (await getJson(env, "broadcast_queue")) || [];
  if (!queue.length) return;

  const job = queue[0];
  const batch = job.recipients.slice(0, BROADCAST_BATCH_SIZE);
  const result = await sendBroadcastBatch(env, batch, job.body);
  job.sent += result.sent;
  job.failed += result.failed;
  job.recipients = job.recipients.slice(BROADCAST_BATCH_SIZE);

  if (job.recipients.length) {
    queue[0] = job;
  } else {
    queue.shift();
    if (job.notifyAdminOnComplete !== false) {
      await sendMessage(
        env,
        job.adminChatId,
        `✅ ارسال گروهی کامل شد.\n\nکل گیرنده‌ها: ${job.total}\n✅ موفق: ${job.sent}\n❌ ناموفق: ${job.failed}`,
        keyboard(ADMIN_MENU)
      );
    }
  }
  await env.BOT_KV.put("broadcast_queue", JSON.stringify(queue));
}

async function exportProfiles(env, chatId) {
  const profiles = await getProfiles(env);
  await sendExcel(env, chatId, `profiles-${today()}.xlsx`, "ثبت‌نامی‌ها", profileRows(profiles), "📥 فایل مرتب ثبت‌نامی‌ها");
}

async function exportVerifiedCuckolds(env, chatId) {
  const profiles = (await getProfiles(env)).filter((profile) => profile.cuckoldVerified);
  await sendExcel(env, chatId, `verified-cuckolds-${today()}.xlsx`, "کاکولدهای تاییدشده", profileRows(profiles), "📥 فایل مرتب کاکولدهای تاییدشده");
}

async function exportComprehensive(env, chatId) {
  const profiles = await getProfiles(env);
  const bookings = await getList(env, "bookings");
  const releases = await getList(env, "release_requests");
  const customImages = await getList(env, "custom_image_requests");
  const posts = await getList(env, "posts");
  const tests = await getList(env, "test_results");
  const proofs = await getProofs(env);
  const supportTickets = await getSupportTickets(env);

  const rows = [
    ["شناسه کاربر", "نام", "یوزرنیم", "سن", "جنسیت", "وضعیت تأهل", "شهر", "نوع", "کاکولد تاییدشده", "کاکولد پیش‌تایید", "هاتوایف تاییدشده", "تاریخ ثبت‌نام", "موجودی امتیاز", "کل امتیاز دریافتی", "کل امتیاز مصرفی", "تعداد آزمون", "آخرین نمره خام", "حداقل نمره", "حداکثر نمره", "درصد آزمون", "تیپ آزمون", "تعداد سوال", "زمان آخرین آزمون", "تعداد نوبت", "تعداد درخواست تخلیه", "درخواست ساخت عکس", "ساخت عکس در انتظار", "ساخت عکس تکمیل‌شده", "ساخت عکس ردشده", "تعداد کل پست", "تعداد عکس و فیلم", "تعداد اعتراف", "پست زمان‌بندی‌شده", "پست منتشرشده", "پست ردشده", "وضعیت آخرین پست", "نوع آخرین پست", "زمان‌بندی آخرین پست", "انتشار آخرین پست", "دلیل رد آخرین پست", "تعداد تیکت پشتیبانی", "تیکت باز", "وضعیت آخرین تیکت", "زمان آخرین تیکت", "وضعیت اثبات‌ها", "اینستاگرام اثبات", "اطلاع پارتنر", "دلیل رد اثبات"],
    ...profiles.map((profile) => {
      const legacyUserTests = tests.filter((item) => item.userId === profile.userId);
      const optimizedUserTests = Array.isArray(profile.testHistory) ? profile.testHistory : [];
      const userTests = [...legacyUserTests, ...optimizedUserTests]
        .filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
        .sort((a, b) => Date.parse(a.createdAt || 0) - Date.parse(b.createdAt || 0));
      const lastTest = userTests[userTests.length - 1];
      const userPosts = posts.filter((item) => item.userId === profile.userId);
      const userCustomImages = customImages.filter((item) => item.userId === profile.userId);
      const lastPost = userPosts[userPosts.length - 1];
      const userSupportTickets = supportTickets.filter((item) => item.userId === profile.userId);
      const lastSupportTicket = userSupportTickets[userSupportTickets.length - 1];
      const userProofs = proofs.filter((item) => item.userId === profile.userId);
      const lastProof = userProofs[userProofs.length - 1];
      const lastRejectedProof = [...userProofs].reverse().find((item) => item.rejectReason);
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
        profile.cuckoldPreverified ? "yes" : "no",
        profile.hotwifeVerified ? "yes" : "no",
        profile.createdAt,
        Number(profile.pointsBalance || 0),
        Number(profile.pointsLifetimeEarned || 0),
        Number(profile.pointsLifetimeSpent || 0),
        userTests.length,
        lastTest?.total ?? "",
        lastTest?.min ?? "",
        lastTest?.max ?? "",
        lastTest?.percent ?? "",
        lastTest?.type ?? "",
        lastTest?.questionCount ?? "",
        lastTest?.createdAt ?? "",
        bookings.filter((item) => item.userId === profile.userId).length,
        releases.filter((item) => item.userId === profile.userId).length,
        userCustomImages.length,
        userCustomImages.filter((item) => item.status === "pending").length,
        userCustomImages.filter((item) => item.status === "completed").length,
        userCustomImages.filter((item) => item.status === "rejected").length,
        userPosts.length,
        userPosts.filter((item) => getPostScheduleKind(item.kind) === "media").length,
        userPosts.filter((item) => item.kind === "confession").length,
        userPosts.filter((item) => item.status === "scheduled").length,
        userPosts.filter((item) => item.status === "published").length,
        userPosts.filter((item) => item.status === "rejected").length,
        lastPost?.status ?? "",
        lastPost?.kind ?? "",
        lastPost?.scheduledAt ?? "",
        lastPost?.publishedAt ?? "",
        lastPost?.rejectReason ?? "",
        userSupportTickets.length,
        userSupportTickets.filter((item) => item.status !== "answered").length,
        lastSupportTicket?.status ?? "",
        lastSupportTicket?.createdAt ?? "",
        userProofs.map((item) => item.status).join("|"),
        lastProof?.instagram ?? "",
        partnerAwarenessLabel(lastProof?.partnerAwareness),
        lastRejectedProof?.rejectReason ?? ""
      ];
    })
  ];

  await sendExcel(env, chatId, `comprehensive-users-${today()}.xlsx`, "گزارش جامع", rows, "📈 فایل جامع و مرتب کاربران");
}

function normalizeMediaFile(message) {
  if (message.photo?.length) {
    const largestPhoto = message.photo[message.photo.length - 1];
    return { ok: true, kind: "photo", fileId: largestPhoto.file_id };
  }

  if (message.video?.file_id) {
    if (message.video.duration > 300) return { ok: false, error: "ویدئو باید حداکثر ۵ دقیقه باشد." };
    return { ok: true, kind: "video", fileId: message.video.file_id };
  }

  return { ok: false, error: "نوع فایل درست نیست." };
}

function normalizeProofMedia(message) {
  if (message.photo?.length) {
    const largestPhoto = message.photo[message.photo.length - 1];
    return { ok: true, kind: "photo", fileId: largestPhoto.file_id };
  }

  if (message.video?.file_id) {
    if (message.video.duration > 300) return { ok: false, error: "ویدئو باید حداکثر ۵ دقیقه باشد." };
    return { ok: true, kind: "video", fileId: message.video.file_id };
  }

  const document = message.document;
  if (document?.file_id) {
    const mime = document.mime_type || "";
    if (mime.startsWith("image/")) return { ok: true, kind: "document", fileId: document.file_id };
    if (mime.startsWith("video/")) return { ok: true, kind: "document", fileId: document.file_id };
    return { ok: false, error: "فایل باید عکس یا ویدئو باشد." };
  }

  return { ok: false, error: "نوع فایل درست نیست." };
}

async function sendProofMedia(env, chatId, kind, fileId, caption, extra = {}) {
  if (!fileId) return;
  if (kind === "video") {
    await sendVideo(env, chatId, fileId, caption, extra);
    return;
  }
  if (kind === "document") {
    await sendDocumentFile(env, chatId, fileId, caption, extra);
    return;
  }
  await sendPhoto(env, chatId, fileId, caption, extra);
}

function buildMediaCaption(caption, kind = "photo") {
  const tag = kind === "video" ? "#فیلم_ارسالی" : "#عکس_ارسالی";
  return ["C CLUB", "", tag, cleanText(caption), MEDIA_CHANNEL_USERNAME, `instagram: ${INSTAGRAM_URL}`, "", "📩 ارسال محتوا در کانال:", "@cucksclubbot"].join("\n");
}

function buildConfessionText(text) {
  return ["#اعترافات_شما", cleanText(text), CHANNEL_USERNAME, `instagram: ${INSTAGRAM_URL}`, "", "📩 ارسال محتوا در کانال:", "@cucksclubbot"].join("\n");
}

function postTypeLabel(kind) {
  if (kind === "photo") return "عکس";
  if (kind === "video") return "فیلم";
  if (kind === "confession") return "اعترافات";
  return kind;
}

function getPostScheduleKind(kind) {
  return kind === "confession" ? "confession" : "media";
}

function getTestQuestions(profile) {
  const includeRelationship = ["married", "relationship"].includes(profile?.marital);
  return QUESTIONS.filter((question) => question.section === "general" || (includeRelationship && question.section === "relationship"));
}

function getQuestionById(questionId) {
  return QUESTIONS.find((question) => question.id === questionId);
}

function getTestType(percent) {
  return TEST_TYPES.find((type) => percent >= type.min && percent < type.max) || TEST_TYPES[TEST_TYPES.length - 1];
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

async function getPosts(env) {
  const refs = await getList(env, "posts");
  const byId = new Map();
  for (const ref of refs) {
    if (ref?.id) byId.set(ref.id, ref);
  }
  return [...byId.values()];
}

async function getSupportTickets(env) {
  const refs = await getList(env, "support_tickets");
  const byId = new Map();
  for (const ref of refs) {
    const latest = await getJson(env, `support:${ref.id}`);
    if (latest) byId.set(latest.id, latest);
  }
  return [...byId.values()];
}

async function findProfileForAdmin(env, value) {
  const text = cleanText(value).replace(/^@/, "").toLowerCase();
  if (!text) return null;

  const profiles = await getProfiles(env);
  return profiles.find((profile) => {
    const username = String(profile.username || "").replace(/^@/, "").toLowerCase();
    const name = String(profile.name || "").toLowerCase();
    return String(profile.userId) === text || username === text || name === text;
  }) || null;
}

async function getAvailablePublishDates(env, scheduleKind, limit = 8) {
  const options = [];
  const now = Date.now();
  const todayParts = getTehranParts(new Date());
  const posts = await getPosts(env);
  const takenDates = new Set(
    posts
      .filter((post) => (post.scheduleKind || getPostScheduleKind(post.kind)) === scheduleKind)
      .filter((post) => ["scheduled", "publishing", "published", "publish_failed"].includes(post.status))
      .map((post) => post.scheduledDate)
      .filter(Boolean)
  );

  for (let offset = 0; options.length < limit && offset < 60; offset += 1) {
    const utcMs = Date.UTC(
      todayParts.year,
      todayParts.month - 1,
      todayParts.day + offset,
      DEFAULT_POST_HOUR - 3,
      DEFAULT_POST_MINUTE - 30,
      0
    );
    const scheduledAt = new Date(utcMs).toISOString();
    if (Date.parse(scheduledAt) <= now) continue;

    const dateKey = tehranDateKey(scheduledAt);
    if (takenDates.has(dateKey)) continue;
    options.push({ dateKey, label: formatPublishDateLabel(scheduledAt) });
  }

  return options;
}

function isPublishDateTaken(posts, scheduleKind, dateKey, exceptPostId = "") {
  return posts.some((post) => {
    if (post.id === exceptPostId) return false;
    if ((post.scheduleKind || getPostScheduleKind(post.kind)) !== scheduleKind) return false;
    if (post.scheduledDate !== dateKey) return false;
    return ["scheduled", "publishing", "published", "publish_failed"].includes(post.status);
  });
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

async function ensurePointAccount(env, userId) {
  const profile = await getProfile(env, userId);
  if (!profile?.registered) return null;
  if (profile.pointsVersion === POINTS_VERSION) return profile;

  const verifiedCuckold = profile.gender === "male" && profile.type === "cuckold" && profile.cuckoldVerified;
  let earned = 0;
  const legacyPostIds = [];
  const legacyProofIds = [];
  if (verifiedCuckold) {
    const postRefs = await getList(env, "posts");
    const byPost = new Map();
    for (const post of postRefs) if (post?.id) byPost.set(post.id, post);
    const qualifyingStatuses = new Set(["approved_waiting_schedule", "scheduled", "published"]);
    for (const post of byPost.values()) {
      if (String(post.userId) !== String(userId) || !qualifyingStatuses.has(post.status)) continue;
      earned += POINT_REWARDS[post.kind] || 0;
      legacyPostIds.push(post.id);
    }

    const proofRefs = await getList(env, "proofs");
    const approvedProof = proofRefs.find((proof) =>
      String(proof.userId) === String(userId) && proof.status === "approved" && proof.proofType !== "hotwife"
    );
    if (approvedProof) {
      earned += POINT_REWARDS.proof;
      legacyProofIds.push(approvedProof.id);
    }
  }

  const updated = {
    ...profile,
    pointsVersion: POINTS_VERSION,
    pointsBalance: earned,
    pointsLifetimeEarned: earned,
    pointsLifetimeSpent: 0,
    pointsLegacyPostIds: legacyPostIds,
    pointsLegacyProofIds: legacyProofIds,
    pointsInitializedAt: new Date().toISOString()
  };
  await env.BOT_KV.put(`profile:${userId}`, JSON.stringify(updated));
  return updated;
}

async function migrateLegacyPointsBatch(env) {
  const snapshots = await getProfileSnapshots(env);
  if (!snapshots.length) return;
  const cursor = Number(await env.BOT_KV.get("points_migration_cursor") || 0);
  if (cursor >= snapshots.length) return;
  const batch = snapshots.slice(cursor, cursor + 1);
  for (const profile of batch) await ensurePointAccount(env, profile.userId);
  await env.BOT_KV.put("points_migration_cursor", String(Math.min(cursor + batch.length, snapshots.length)));
}

async function changePoints(env, userId, amount, transactionId, reason) {
  const existing = await getJson(env, `points_tx:${transactionId}`);
  if (existing) {
    const profile = await ensurePointAccount(env, userId);
    return { ok: true, duplicate: true, balance: Number(profile?.pointsBalance || 0) };
  }

  const profile = await ensurePointAccount(env, userId);
  if (!profile) return { ok: false, balance: 0 };
  const balance = Number(profile.pointsBalance || 0);
  if (amount < 0 && balance < Math.abs(amount)) return { ok: false, balance, needed: Math.abs(amount) };
  const isRefund = String(transactionId).startsWith("refund:");

  const updated = {
    ...profile,
    pointsBalance: balance + amount,
    pointsLifetimeEarned: Number(profile.pointsLifetimeEarned || 0) + (isRefund ? 0 : Math.max(amount, 0)),
    pointsLifetimeSpent: isRefund
      ? Math.max(0, Number(profile.pointsLifetimeSpent || 0) - Math.max(amount, 0))
      : Number(profile.pointsLifetimeSpent || 0) + Math.max(-amount, 0),
    pointsUpdatedAt: new Date().toISOString()
  };
  const transaction = {
    id: transactionId,
    userId: String(userId),
    amount,
    reason,
    balanceAfter: updated.pointsBalance,
    createdAt: updated.pointsUpdatedAt
  };
  await env.BOT_KV.put(`profile:${userId}`, JSON.stringify(updated));
  await env.BOT_KV.put(`points_tx:${transactionId}`, JSON.stringify(transaction));
  return { ok: true, balance: updated.pointsBalance, transaction };
}

async function spendPoints(env, userId, cost, transactionId, reason) {
  return changePoints(env, userId, -Math.abs(cost), transactionId, reason);
}

async function refundPoints(env, userId, cost, transactionId, reason) {
  return changePoints(env, userId, Math.abs(cost), transactionId, reason);
}

async function awardPostPoints(env, post, currentProfile = null) {
  const profile = currentProfile || await getProfile(env, post.userId);
  const verified = profile?.gender === "male" && profile.type === "cuckold" && profile.cuckoldVerified;
  const amount = POINT_REWARDS[post.kind] || 0;
  if (!verified || !amount) return null;
  if ((profile.pointsLegacyPostIds || []).includes(post.id)) {
    return { ok: true, duplicate: true, balance: Number(profile.pointsBalance || 0) };
  }
  return changePoints(env, post.userId, amount, `earn:post:${post.id}`, `انتشار پست ${post.kind}`);
}

async function showPoints(env, chatId, userId) {
  const profile = await ensurePointAccount(env, userId);
  await sendMessage(
    env,
    chatId,
    [
      `⭐ امتیاز فعلی شما: ${Number(profile?.pointsBalance || 0)} ⭐`,
      "",
      "کسب امتیاز:",
      "🖼 عکس تاییدشده: ۳ ⭐",
      "🎬 فیلم تاییدشده: ۵ ⭐",
      "✍️ اعتراف تاییدشده: ۱ ⭐",
      "🧾 تکمیل اثبات کاکولدی: ۱ ⭐",
      "",
      "هزینه خدمات:",
      "💧 تخلیه آب بیغیرتی: ۵ ⭐",
      "🎭 فیلم با چهره دلخواه: ۱۵ ⭐",
      "🟢 گیف با کپشن: ۱۰ ⭐",
      "🖼 عکس با چهره دلخواه: ۵ ⭐",
      "📅 مشاوره: ۱ ⭐"
    ].join("\n"),
    keyboard(await getMainMenuForUser(env, userId))
  );
}

async function sendInsufficientPoints(env, chatId, userId, cost) {
  const profile = await ensurePointAccount(env, userId);
  await sendMessage(
    env,
    chatId,
    `❌ امتیاز کافی نداری.\n\nموجودی: ${Number(profile?.pointsBalance || 0)} ⭐\nامتیاز لازم: ${cost} ⭐`,
    keyboard([[{ text: "⭐ مشاهده امتیازها", callback_data: "points:show" }], ...BACK_TO_MENU])
  );
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

async function getActiveBan(env, userId) {
  const ban = await getJson(env, `ban:${userId}`);
  if (!ban) return null;
  if (Date.parse(ban.expiresAt || "") <= Date.now()) {
    await env.BOT_KV.delete(`ban:${userId}`);
    return null;
  }
  return ban;
}

async function notifyIfBanned(env, chatId, userId) {
  const ban = await getActiveBan(env, userId);
  if (!ban) return false;
  await sendMessage(
    env,
    chatId,
    [
      "⛔️ شما تا دو روز بن شدید.",
      "",
      `پایان بن: ${formatDateTime(ban.expiresAt)}`,
      "تا پایان این زمان نمی‌توانید چیزی به ربات بفرستید."
    ].join("\n")
  );
  return true;
}

async function recordInvalidSubmission(env, message, reason, expected) {
  const chatId = String(message.chat.id);
  const userId = String(message.from.id);
  if (isAdmin(env, userId)) return false;

  const current = (await getJson(env, `invalid:${userId}`)) || { count: 0, reasons: [] };
  const next = {
    count: Number(current.count || 0) + 1,
    reasons: [...(current.reasons || []), { reason, expected, at: new Date().toISOString() }].slice(-10),
    updatedAt: new Date().toISOString()
  };
  await env.BOT_KV.put(`invalid:${userId}`, JSON.stringify(next), { expirationTtl: USER_BAN_SECONDS });

  if (next.count >= INVALID_SUBMISSION_LIMIT) {
    const profile = await getProfile(env, userId);
    const ban = await banUser(env, userId, {
      username: profile?.username || (message.from.username ? `@${message.from.username}` : ""),
      name: profile?.name || message.from.first_name || "",
      reason: `ارسال اشتباه یا غیرمرتبط بیش از ${INVALID_SUBMISSION_LIMIT} بار`,
      source: "spam_guard",
      lastInvalidReason: reason
    });
    await clearState(env, userId);
    await env.BOT_KV.delete(`invalid:${userId}`);
    await sendMessage(
      env,
      chatId,
      [
        "⛔️ شما تا دو روز بن شدید.",
        "",
        "چند بار پشت سر هم چیزی غیر از مورد خواسته‌شده فرستادید.",
        `پایان بن: ${formatDateTime(ban.expiresAt)}`
      ].join("\n")
    );
    await safeNotifyAdmin(env, [
      "🚫 بن خودکار ضداسپم",
      "",
      `کاربر: ${profile?.name || message.from.first_name || "-"} | ${profile?.username || (message.from.username ? `@${message.from.username}` : userId)}`,
      `دلیل آخر: ${reason}`,
      `تا: ${formatDateTime(ban.expiresAt)}`
    ].join("\n"));
    return true;
  }

  await sendMessage(
    env,
    chatId,
    [
      `❌ مورد اشتباه دریافت شد. اخطار ${next.count}/${INVALID_SUBMISSION_LIMIT}`,
      "",
      `مورد خواسته‌شده: ${expected}`,
      "اگر چند بار پشت سر هم محتوای اشتباه بفرستی، ۲ روز بن می‌شوی."
    ].join("\n"),
    keyboard(BACK_TO_MENU)
  );
  return true;
}

async function banUser(env, userId, details = {}) {
  const now = new Date();
  const ban = {
    userId: String(userId),
    username: details.username || "",
    name: details.name || "",
    reason: details.reason || "بن کاربر",
    source: details.source || "admin",
    bannedBy: details.bannedBy || "",
    lastInvalidReason: details.lastInvalidReason || "",
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + USER_BAN_SECONDS * 1000).toISOString()
  };
  await env.BOT_KV.put(`ban:${userId}`, JSON.stringify(ban), { expirationTtl: USER_BAN_SECONDS });
  await putListItem(env, "user_bans", ban);
  return ban;
}

async function getActiveBans(env) {
  const refs = await getList(env, "user_bans");
  const byUser = new Map();
  for (const ref of refs) {
    const ban = await getActiveBan(env, ref.userId);
    if (ban) byUser.set(String(ban.userId), ban);
  }
  return [...byUser.values()].sort((a, b) => Date.parse(b.expiresAt || 0) - Date.parse(a.expiresAt || 0));
}

async function getPreverifiedCuckoldHandles(env) {
  return (await getJson(env, "preverified_cuckold_handles")) || [];
}

async function isPreverifiedCuckold(env, username) {
  const handles = await getPreverifiedCuckoldHandles(env);
  return handles.includes(normalizeTelegramHandle(username));
}

async function addPreverifiedCuckoldHandles(env, handles) {
  const existing = await getPreverifiedCuckoldHandles(env);
  const merged = [...new Set([...existing.map(normalizeTelegramHandle), ...handles.map(normalizeTelegramHandle)].filter(Boolean))];
  await env.BOT_KV.put("preverified_cuckold_handles", JSON.stringify(merged));
  return { added: merged.length - existing.length, total: merged.length };
}

async function applyPreverifiedCuckoldHandlesToExistingProfiles(env, handles) {
  const wanted = new Set(handles.map(normalizeTelegramHandle));
  const profiles = await getProfiles(env);
  let applied = 0;
  for (const profile of profiles) {
    if (
      wanted.has(normalizeTelegramHandle(profile.username)) &&
      profile.gender === "male" &&
      profile.type === "cuckold" &&
      !profile.cuckoldVerified
    ) {
      const updated = {
        ...profile,
        cuckoldVerified: true,
        cuckoldVerifiedAt: new Date().toISOString(),
        cuckoldPreverified: true
      };
      await env.BOT_KV.put(`profile:${profile.userId}`, JSON.stringify(updated));
      applied += 1;
    }
  }
  return applied;
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

async function ensureVerifiedContentSubmitter(env, chatId, userId) {
  const profile = await getProfile(env, userId);
  const verifiedCuckold = profile?.registered && profile.gender === "male" && profile.type === "cuckold" && profile.cuckoldVerified;
  const verifiedHotwife = profile?.registered && profile.gender === "female" && profile.type === "hotwife" && profile.hotwifeVerified;
  if (verifiedCuckold || verifiedHotwife) return true;

  await sendMessage(
    env,
    chatId,
    [
      "⛔️ ارسال عکس و فیلم برای شما هنوز فعال نیست.",
      "",
      "برای حفظ امنیت و کیفیت کانال، این بخش فقط برای کاکولدهای تایید شده و هاتوایف‌های تایید شده باز است.",
      "اگر کاکولد یا هاتوایف هستی، اول از دکمه اثبات اقدام کن."
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
  if (profile.gender === "female" && profile.type === "hotwife" && !profile.hotwifeVerified) {
    rows.splice(1, 0, [{ text: "🧾 اثبات هاتوایفی", callback_data: "proof:start" }]);
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
    lines.push(`${profile.name || "-"} | ${profile.username || "-"} | ${profile.age || "-"} | ${profile.city || "-"} | ${profile.typeLabel || profile.type || "-"} | ${profile.cuckoldVerified ? "تایید" : "بدون تایید"} | ${Number(profile.pointsBalance || 0)} ⭐`);
  }
  if (profiles.length > 30) lines.push(`... و ${profiles.length - 30} مورد دیگر`);
  return lines.join("\n");
}

function profileRows(profiles) {
  return [
    ["شناسه کاربر", "نام", "یوزرنیم", "سن", "جنسیت", "وضعیت تأهل", "شهر", "نوع", "کاکولد تاییدشده", "کاکولد پیش‌تایید", "هاتوایف تاییدشده", "موجودی امتیاز", "کل امتیاز دریافتی", "کل امتیاز مصرفی", "تاریخ ثبت‌نام"],
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
      profile.cuckoldPreverified ? "yes" : "no",
      profile.hotwifeVerified ? "yes" : "no",
      Number(profile.pointsBalance || 0),
      Number(profile.pointsLifetimeEarned || 0),
      Number(profile.pointsLifetimeSpent || 0),
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

function pad2(value) {
  return String(value).padStart(2, "0");
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

function cityKeyboard() {
  const buttons = CITY_OPTIONS.map((city) => ({ text: city, callback_data: `reg:city:${city}` }));
  return [...chunkButtons(buttons, 3), ...BACK_TO_MENU];
}

function chunkButtons(buttons, size) {
  const rows = [];
  for (let index = 0; index < buttons.length; index += size) {
    rows.push(buttons.slice(index, index + size));
  }
  return rows;
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
  rows.push(...BACK_TO_MENU);
  return rows;
}

function proofTargetLabel(relationships = []) {
  const priority = ["wife", "girlfriend", "fiancee"];
  const selected = priority.find((item) => relationships.includes(item)) || relationships[0];
  return proofRelationshipLabel(selected);
}

function partnerAwarenessLabel(value) {
  const labels = {
    knows_cooperates: "بله، می‌داند و همکاری می‌کند",
    knows_no_coop: "بله، می‌داند ولی همکاری نمی‌کند",
    does_not_know: "نمی‌داند"
  };
  return labels[value] || "-";
}

function normalizeInstagramUsername(value) {
  const text = cleanText(value).replace(/^https?:\/\/(www\.)?instagram\.com\//i, "").replace(/\/+$/g, "");
  const username = text.replace(/^@/, "");
  if (!/^[A-Za-z0-9._]{2,30}$/.test(username)) return "";
  return `@${username}`;
}

function normalizeTelegramHandle(value) {
  const username = cleanText(value).replace(/^@/, "").toLowerCase();
  if (!/^[a-z0-9_]{5,32}$/.test(username)) return "";
  return `@${username}`;
}

function parseTelegramHandles(value) {
  return [...new Set((String(value).match(/@[A-Za-z0-9_]{5,32}/g) || []).map(normalizeTelegramHandle).filter(Boolean))];
}

function decorateTestText(value) {
  return String(value || "").split("\n").map((line) => {
    if (line.startsWith("### ")) {
      return `🟢 <b><u>${escapeHtml(line.replace(/^###\s+/, ""))}</u></b>`;
    }
    return formatInlineBold(line);
  }).join("\n");
}

function formatInlineBold(value) {
  const parts = String(value || "").split("**");
  return parts.map((part, index) => {
    const escaped = escapeHtml(part);
    return index % 2 === 1 ? `<b>${escaped}</b>` : escaped;
  }).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function countUrls(value) {
  return (String(value).match(/https?:\/\/|t\.me\/|telegram\.me\//gi) || []).length;
}

function parseTehranDateTime(value) {
  const text = normalizeDigits(cleanText(value).replace(/،/g, " "));
  const absolute = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})$/);
  if (absolute) {
    return makeTehranIso(Number(absolute[1]), Number(absolute[2]), Number(absolute[3]), Number(absolute[4]), Number(absolute[5]));
  }

  const relative = text.match(/^(امروز|فردا|شنبه|یکشنبه|يكشنبه|دوشنبه|سه شنبه|سه‌شنبه|چهارشنبه|پنجشنبه|جمعه)\s+(\d{1,2}):(\d{2})$/);
  if (!relative) return "";

  const dayWord = relative[1].replace("يك", "یک");
  const hour = Number(relative[2]);
  const minute = Number(relative[3]);
  if (hour > 23 || minute > 59) return "";

  const nowTehran = getTehranParts(new Date());
  let offsetDays = 0;
  if (dayWord === "فردا") {
    offsetDays = 1;
  } else if (dayWord !== "امروز") {
    const targetDay = PERSIAN_WEEKDAYS[dayWord];
    if (targetDay === undefined) return "";
    offsetDays = (targetDay - nowTehran.weekday + 7) % 7;
    if (offsetDays === 0) offsetDays = 7;
  }

  const baseUtc = Date.UTC(nowTehran.year, nowTehran.month - 1, nowTehran.day + offsetDays, hour - 3, minute - 30, 0);
  const startsAt = new Date(baseUtc).toISOString();
  if (Date.parse(startsAt) <= Date.now()) return "";
  return startsAt;
}

const PERSIAN_WEEKDAYS = {
  "شنبه": 6,
  "یکشنبه": 0,
  "دوشنبه": 1,
  "سه شنبه": 2,
  "سه‌شنبه": 2,
  "چهارشنبه": 3,
  "پنجشنبه": 4,
  "جمعه": 5
};

function normalizeDigits(value) {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return String(value).replace(/[۰-۹٠-٩]/g, (digit) => {
    const persianIndex = persian.indexOf(digit);
    if (persianIndex >= 0) return String(persianIndex);
    return String(arabic.indexOf(digit));
  });
}

function makeTehranIso(year, month, day, hour, minute) {
  if (month < 1 || month > 12 || day < 1 || day > 31 || hour > 23 || minute > 59) return "";
  const utcMs = Date.UTC(year, month - 1, day, hour - 3, minute - 30, 0);
  const startsAt = new Date(utcMs).toISOString();
  if (Date.parse(startsAt) <= Date.now()) return "";
  return startsAt;
}

function getTehranParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tehran",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short"
  }).formatToParts(date);
  const map = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    weekday: weekdayMap[map.weekday]
  };
}

function formatTehranSlot(startsAt) {
  const date = new Date(startsAt);
  return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    timeZone: "Asia/Tehran",
    dateStyle: "full",
    timeStyle: "short"
  }).format(date);
}

function tehranDateKey(startsAt) {
  const parts = getTehranParts(new Date(startsAt));
  return `${parts.year}-${pad2(parts.month)}-${pad2(parts.day)}`;
}

function tehranDateKeyToIso(dateKey, hour, minute) {
  const match = String(dateKey).match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  return makeTehranIso(Number(match[1]), Number(match[2]), Number(match[3]), hour, minute);
}

function formatPublishDateLabel(startsAt) {
  return formatTehranSlot(startsAt);
}

async function sendDueBookingReminders(env) {
  const bookings = await getList(env, "bookings");
  const now = Date.now();
  const reminderMs = REMINDER_WINDOW_MINUTES * 60 * 1000;
  const due = bookings
    .filter((booking) => booking.status === "scheduled" && !booking.reminderSent && booking.startsAt)
    .filter((booking) => {
      const startsAtMs = Date.parse(booking.startsAt);
      return startsAtMs > now && startsAtMs - now <= reminderMs;
    })
    .slice(0, 3);
  if (!due.length) return;

  for (const booking of due) {
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
  const due = requests
    .filter((request) => request.status === "scheduled" && !request.reminderSent && request.startsAt)
    .filter((request) => {
      const startsAtMs = Date.parse(request.startsAt);
      return startsAtMs > now && startsAtMs - now <= reminderMs;
    })
    .slice(0, 3);
  if (!due.length) return;

  for (const request of due) {
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

async function getSpecialPosts(env) {
  return (await getJson(env, "list:special_posts")) || [];
}

async function saveSpecialPosts(env, posts) {
  await env.BOT_KV.put("list:special_posts", JSON.stringify(posts));
}

async function sendSpecialPostMessage(env, chatId, post, includeCancel = false) {
  const rows = [];
  if (post.buttonText && post.buttonUrl) rows.push([{ text: post.buttonText, url: post.buttonUrl }]);
  if (includeCancel) rows.push([{ text: "❌ لغو انتشار", callback_data: `special:cancel:${post.id}` }]);
  const extra = rows.length ? keyboard(rows) : {};

  if (post.kind === "photo") {
    return sendPhoto(env, chatId, post.fileId, post.text, extra);
  }
  return sendMessage(env, chatId, post.text, extra);
}

async function publishDueSpecialPosts(env) {
  const posts = await getSpecialPosts(env);
  const now = Date.now();
  const targetChannel = env.CHANNEL_ID || CHANNEL_USERNAME;
  const due = posts
    .filter((post) => post.status === "scheduled" && Date.parse(post.scheduledAt) <= now)
    .filter((post) => !post.nextRetryAt || Date.parse(post.nextRetryAt) <= now)
    .slice(0, 3);
  if (!due.length) return;

  for (const post of due) {
    try {
      await sendSpecialPostMessage(env, targetChannel, post);
      post.publishCount = Number(post.publishCount || 0) + 1;
      post.lastPublishedAt = new Date().toISOString();
      post.lastError = "";
      post.nextRetryAt = "";

      if (post.recurrence === "none") {
        post.status = "published";
        post.publishedAt = post.lastPublishedAt;
      } else {
        post.scheduledAt = nextSpecialPostDate(post.scheduledAt, post.recurrence, now);
      }
    } catch (error) {
      post.failureCount = Number(post.failureCount || 0) + 1;
      post.lastError = String(error?.message || error);
      post.lastErrorAt = new Date().toISOString();
      post.nextRetryAt = new Date(now + 15 * 60 * 1000).toISOString();
      await safeNotifyAdmin(env, `⚠️ انتشار پست ویژه ناموفق بود.\n\nکد: ${post.id}\n${post.lastError}`);
    }
  }

  await saveSpecialPosts(env, posts);
}

function nextSpecialPostDate(previousDate, recurrence, now) {
  const intervals = {
    hourly: 60 * 60 * 1000,
    daily: 24 * 60 * 60 * 1000,
    weekly: 7 * 24 * 60 * 60 * 1000
  };
  const interval = intervals[recurrence];
  if (!interval) return previousDate;
  let next = Date.parse(previousDate) + interval;
  while (next <= now) next += interval;
  return new Date(next).toISOString();
}

async function publishDuePosts(env) {
  const postRefs = await getPosts(env);
  const now = Date.now();
  await retryPendingMediaForwards(env, postRefs, now);
  const due = postRefs
    .filter((post) => post.status === "scheduled" && post.scheduledAt && Date.parse(post.scheduledAt) <= now)
    .slice(0, 3);

  for (const postRef of due) {
    const post = (await getJson(env, `post:${postRef.id}`)) || postRef;
    if (post.status !== "scheduled" || !post.scheduledAt || Date.parse(post.scheduledAt) > now) continue;

    const pointProfile = await getProfile(env, post.userId);
    const eligibleForPoints = pointProfile?.gender === "male"
      && pointProfile.type === "cuckold"
      && pointProfile.cuckoldVerified;
    const hadPointAccount = pointProfile?.pointsVersion === POINTS_VERSION;

    post.status = "publishing";
    post.publishingStartedAt = new Date().toISOString();
    await env.BOT_KV.put(`post:${post.id}`, JSON.stringify(post));

    const targetChannel = post.kind === "confession"
      ? (env.CHANNEL_ID || CHANNEL_USERNAME)
      : (env.MEDIA_CHANNEL_ID || MEDIA_CHANNEL_USERNAME);
    try {
      const publishText = post.kind === "confession"
        ? post.finalText
        : String(post.finalText || "").replaceAll(CHANNEL_USERNAME, MEDIA_CHANNEL_USERNAME);
      let publishedMessage;
      if (post.kind === "photo") {
        publishedMessage = await sendPhoto(env, targetChannel, post.fileId, publishText);
      } else if (post.kind === "video") {
        publishedMessage = await sendVideo(env, targetChannel, post.fileId, publishText);
      } else {
        publishedMessage = await sendMessage(env, targetChannel, publishText);
      }

      if (getPostScheduleKind(post.kind) === "media") {
        post.mediaMessageId = publishedMessage?.result?.message_id || null;
        post.forwardStatus = "pending";
        try {
          await forwardMediaPost(env, post);
          post.forwardStatus = "forwarded";
          post.forwardedAt = new Date().toISOString();
          post.forwardError = "";
          post.nextForwardRetryAt = "";
        } catch (forwardError) {
          post.forwardStatus = "failed";
          post.forwardError = String(forwardError?.message || forwardError);
          post.nextForwardRetryAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
          await safeNotifyAdmin(env, `⚠️ پست ${post.id} در @cclubmedia منتشر شد، اما فوروارد به @cuckzclub ناموفق بود و دوباره تلاش می‌شود.\n${post.forwardError}`);
        }
      }

      post.status = "published";
      post.publishedAt = new Date().toISOString();
      await env.BOT_KV.put(`post:${post.id}`, JSON.stringify(post));
      await updateListItem(env, "posts", post.id, (item) => ({
        ...item,
        status: "published",
        publishedAt: post.publishedAt,
        mediaMessageId: post.mediaMessageId || null,
        forwardStatus: post.forwardStatus || "",
        forwardedAt: post.forwardedAt || "",
        forwardError: post.forwardError || "",
        nextForwardRetryAt: post.nextForwardRetryAt || ""
      }));

      let pointResult = null;
      if (eligibleForPoints) {
        try {
          if (hadPointAccount) {
            pointResult = await awardPostPoints(env, post, pointProfile);
          } else {
            const migratedProfile = await ensurePointAccount(env, post.userId);
            pointResult = { ok: true, migrated: true, balance: Number(migratedProfile?.pointsBalance || 0) };
          }
        } catch (pointError) {
          await safeNotifyAdmin(env, `⚠️ پست ${post.id} منتشر شد، اما ثبت امتیاز خطا داشت: ${String(pointError?.message || pointError)}`);
        }
      }

      const reward = POINT_REWARDS[post.kind] || 0;
      const pointLines = pointResult?.duplicate
        ? ["⭐ امتیاز این محتوا قبلاً ثبت شده بود.", `⭐ موجودی فعلی: ${pointResult.balance}`]
        : pointResult
          ? [`🎁 امتیاز دریافتی از این محتوا: +${reward} ⭐`, `⭐ موجودی جدید: ${pointResult.balance}`]
          : eligibleForPoints
            ? ["⚠️ پست منتشر شد، اما ثبت امتیاز با خطا روبه‌رو شد؛ ادمین مطلع شد."]
            : ["ℹ️ برای این محتوا امتیازی ثبت نشد؛ امتیاز محتوا مخصوص کاکولدهای تأییدشده است."];
      try {
        await sendMessage(
          env,
          post.userId,
          [
            "✅ پستت در کانال منتشر شد.",
            "",
            `کد: ${post.id}`,
            "",
            ...pointLines
          ].filter(Boolean).join("\n")
        );
      } catch (notifyError) {
        await safeNotifyAdmin(env, `⚠️ پست ${post.id} منتشر شد، اما اطلاع‌رسانی به کاربر ناموفق بود.`);
      }
      await safeNotifyAdmin(env, `✅ پست زمان‌بندی‌شده منتشر شد.\n\nکد: ${post.id}\nنوع: ${postTypeLabel(post.kind)}`);
    } catch (error) {
      post.status = "publish_failed";
      post.publishError = String(error?.message || error);
      post.publishErrorAt = new Date().toISOString();
      await env.BOT_KV.put(`post:${post.id}`, JSON.stringify(post));
      await updateListItem(env, "posts", post.id, (item) => ({ ...item, status: "publish_failed", publishError: post.publishError, publishErrorAt: post.publishErrorAt }));
      await safeNotifyAdmin(
        env,
        [
          "⚠️ ارسال پست زمان‌بندی‌شده به کانال ناموفق بود.",
          "",
          `کد: ${post.id}`,
          `کانال هدف: ${targetChannel}`,
          "ربات باید داخل کانال ادمین باشد و اجازه Post Messages داشته باشد.",
          "",
          post.publishError
        ].join("\n")
      );
    }
  }
}

async function forwardMediaPost(env, post) {
  if (!post.mediaMessageId) throw new Error("شناسه پیام منتشرشده پیدا نشد.");
  return forwardMessage(
    env,
    env.CHANNEL_ID || CHANNEL_USERNAME,
    env.MEDIA_CHANNEL_ID || MEDIA_CHANNEL_USERNAME,
    post.mediaMessageId
  );
}

async function retryPendingMediaForwards(env, postRefs, now = Date.now()) {
  const pending = postRefs
    .filter((post) => post.status === "published"
      && getPostScheduleKind(post.kind) === "media"
      && post.mediaMessageId
      && post.forwardStatus !== "forwarded"
      && (!post.nextForwardRetryAt || Date.parse(post.nextForwardRetryAt) <= now))
    .slice(0, 2);

  for (const postRef of pending) {
    const post = (await getJson(env, `post:${postRef.id}`)) || postRef;
    try {
      await forwardMediaPost(env, post);
      post.forwardStatus = "forwarded";
      post.forwardedAt = new Date().toISOString();
      post.forwardError = "";
      post.nextForwardRetryAt = "";
    } catch (error) {
      post.forwardStatus = "failed";
      post.forwardError = String(error?.message || error);
      post.nextForwardRetryAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    }
    await env.BOT_KV.put(`post:${post.id}`, JSON.stringify(post));
    await updateListItem(env, "posts", post.id, (item) => ({
      ...item,
      forwardStatus: post.forwardStatus,
      forwardedAt: post.forwardedAt || "",
      forwardError: post.forwardError || "",
      nextForwardRetryAt: post.nextForwardRetryAt || ""
    }));
  }
}

function shortId() {
  return crypto.randomUUID().split("-")[0];
}

async function sendExcel(env, chatId, filename, sheetName, rows, caption) {
  const workbook = createExcelWorkbook(sheetName, rows);
  await sendDocument(
    env,
    chatId,
    workbook,
    filename,
    caption,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
}

export function createExcelWorkbook(sheetName, rows) {
  const safeSheetName = String(sheetName || "گزارش").replace(/[\\/*?:[\]]/g, " ").slice(0, 31) || "گزارش";
  const columnCount = Math.max(1, ...rows.map((row) => row.length));
  const rowCount = Math.max(1, rows.length);
  const widths = Array.from({ length: columnCount }, (_, columnIndex) => {
    const longest = rows.reduce((max, row) => Math.max(max, String(row[columnIndex] ?? "").length), 0);
    return Math.min(42, Math.max(12, longest + 3));
  });
  const columnsXml = widths.map((width, index) => `<col min="${index + 1}" max="${index + 1}" width="${width}" customWidth="1"/>`).join("");
  const rowsXml = rows.map((row, rowIndex) => {
    const cells = Array.from({ length: columnCount }, (_, columnIndex) => excelCell(row[columnIndex], rowIndex, columnIndex));
    return `<row r="${rowIndex + 1}" ht="${rowIndex === 0 ? 28 : 22}" customHeight="1">${cells.join("")}</row>`;
  }).join("");
  const lastCell = `${excelColumnName(columnCount)}${rowCount}`;
  const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetViews><sheetView workbookViewId="0" rightToLeft="1" showGridLines="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
  <sheetFormatPr defaultRowHeight="22"/>
  <cols>${columnsXml}</cols>
  <sheetData>${rowsXml}</sheetData>
  <autoFilter ref="A1:${lastCell}"/>
</worksheet>`;
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <bookViews><workbookView/></bookViews>
  <sheets><sheet name="${escapeXml(safeSheetName)}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="2"><font><sz val="11"/><name val="Arial"/></font><font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Arial"/></font></fonts>
  <fills count="4"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF167A45"/><bgColor indexed="64"/></patternFill></fill><fill><patternFill patternType="solid"><fgColor rgb="FFEAF7EF"/><bgColor indexed="64"/></patternFill></fill></fills>
  <borders count="2"><border/><border><left style="thin"><color rgb="FFD9E2DD"/></left><right style="thin"><color rgb="FFD9E2DD"/></right><top style="thin"><color rgb="FFD9E2DD"/></top><bottom style="thin"><color rgb="FFD9E2DD"/></bottom></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs count="4"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="right" vertical="center" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="3" borderId="1" xfId="0" applyAlignment="1"><alignment horizontal="right" vertical="center" wrapText="1"/></xf></cellXfs>
  <cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;
  const files = {
    "[Content_Types].xml": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`),
    "_rels/.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`),
    "xl/workbook.xml": strToU8(workbook),
    "xl/_rels/workbook.xml.rels": strToU8(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`),
    "xl/styles.xml": strToU8(styles),
    "xl/worksheets/sheet1.xml": strToU8(worksheet)
  };
  return zipSync(files, { level: 0 });
}

function excelCell(value, rowIndex, columnIndex) {
  const reference = `${excelColumnName(columnIndex + 1)}${rowIndex + 1}`;
  const style = rowIndex === 0 ? 1 : rowIndex % 2 === 0 ? 3 : 2;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${reference}" s="${style}"><v>${value}</v></c>`;
  }
  const text = String(value ?? "");
  return `<c r="${reference}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
}

function excelColumnName(index) {
  let name = "";
  for (let value = index; value > 0; value = Math.floor((value - 1) / 26)) {
    name = String.fromCharCode(65 + ((value - 1) % 26)) + name;
  }
  return name;
}

function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[char]);
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

async function forwardMessage(env, chatId, fromChatId, messageId) {
  return telegram(env, "forwardMessage", {
    chat_id: chatId,
    from_chat_id: fromChatId,
    message_id: messageId
  });
}

async function editMessageText(env, chatId, messageId, text, extra = {}) {
  return telegram(env, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
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

async function sendDocumentFile(env, chatId, document, caption, extra = {}) {
  return telegram(env, "sendDocument", {
    chat_id: chatId,
    document,
    caption,
    ...extra
  });
}

async function answerCallback(env, callbackQueryId) {
  return telegram(env, "answerCallbackQuery", { callback_query_id: callbackQueryId });
}

async function sendDocument(env, chatId, content, filename, caption, mimeType = "application/octet-stream") {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", caption);
  form.append("document", new Blob([content], { type: mimeType }), filename);

  const response = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendDocument`, {
    method: "POST",
    body: form
  });
  const result = await response.json().catch(() => ({}));
  if (!result.ok) throw new Error(`sendDocument failed: ${JSON.stringify(result)}`);
  return result;
}
