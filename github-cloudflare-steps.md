# راه ساده با GitHub و Cloudflare

## کدام گزینه را بزنم؟

در همان صفحه‌ای که عکس فرستادی، بزن:

`Connect GitHub`

این برای کار تو بهتر از `Start with Hello World` است، چون بعداً هر وقت کد را در GitHub تغییر بدهی، Cloudflare خودش نسخه جدید را منتشر می‌کند.

## فایل‌هایی که باید داخل GitHub باشند

این فایل‌ها را داخل یک ریپازیتوری GitHub بگذار:

- `telegram-multipurpose-worker.js`
- `package.json`
- `wrangler.toml`
- `.gitignore`

## تنظیمات Cloudflare هنگام اتصال GitHub

وقتی ریپازیتوری را انتخاب کردی:

`Framework preset`

روی `None` یا `No framework` باشد.

`Build command`

اگر ازت خواست:

`npm install && npm run deploy`

اگر فیلد `Deploy command` جدا داشت:

`npm run deploy`

`Root directory`

خالی بگذار، مگر اینکه فایل‌ها را داخل پوشه جدا گذاشته باشی.

## بعد از Deploy

داخل Worker برو به:

`Settings -> Variables and Secrets`

این‌ها را اضافه کن:

`BOT_TOKEN`

توکن ربات

`ADMIN_CHAT_ID`

آیدی عددی ادمین

`CHANNEL_ID`

اختیاری، برای ارسال پست تایید شده به کانال

بعد برو به:

`Settings -> Bindings`

یک KV Namespace بساز یا انتخاب کن و با نام دقیق زیر bind کن:

`BOT_KV`

## وصل کردن تلگرام

بعد از Deploy، این لینک را با توکن واقعی باز کن:

`https://api.telegram.org/botTOKEN/setWebhook?url=https://telegrambot.alirezaeslamibidgoli.workers.dev`

بعد در تلگرام:

`/start`
