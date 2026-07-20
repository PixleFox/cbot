# راه اندازی ربات چندمنظوره روی Cloudflare Worker

این فایل برای همان دامنه Worker شماست:

`https://telegrambot.alirezaeslamibidgoli.workers.dev`

## 1. ساخت KV

در Cloudflare:

1. برو به `Workers & Pages`
2. از منو برو به `KV`
3. بزن `Create namespace`
4. اسم بده:
   `BOT_KV`

## 2. وصل کردن KV به Worker

1. برو داخل Worker به نام `telegrambot`
2. برو به `Settings`
3. برو به `Bindings`
4. در بخش `KV Namespace Bindings` بزن `Add binding`
5. در `Variable name` بنویس:
   `BOT_KV`
6. در namespace همان `BOT_KV` را انتخاب کن
7. ذخیره کن

## 3. تنظیم متغیرها

در همان Worker:

1. برو به `Settings`
2. برو به `Variables and Secrets`
3. این‌ها را اضافه کن:

`BOT_TOKEN`

توکن ربات BotFather

`ADMIN_CHAT_ID`

آیدی عددی تلگرام ادمین

`CHANNEL_ID`

اختیاری است. اگر می‌خواهی پست تایید شده داخل کانال ارسال شود، آیدی کانال را بگذار. اگر نمی‌خواهی، خالی بگذار.

## 4. گرفتن ADMIN_CHAT_ID

ساده‌ترین راه:

1. به ربات خودت یک پیام بده
2. این لینک را باز کن، با توکن خودت:

`https://api.telegram.org/botTOKEN/getUpdates`

3. داخل خروجی دنبال این بخش بگرد:

`"chat":{"id":123456789,...}`

عدد `id` همان `ADMIN_CHAT_ID` توست.

اگر webhook قبلاً فعال باشد و getUpdates خروجی ندهد، موقتاً این را باز کن:

`https://api.telegram.org/botTOKEN/deleteWebhook`

بعد دوباره به ربات پیام بده و `getUpdates` را باز کن.

بعد از گرفتن آیدی، دوباره webhook را ست کن:

`https://api.telegram.org/botTOKEN/setWebhook?url=https://telegrambot.alirezaeslamibidgoli.workers.dev`

## 5. گذاشتن کد

1. برو داخل Worker
2. بزن `Edit Code`
3. کل کد قبلی را پاک کن
4. محتوای فایل `telegram-multipurpose-worker.js` را بگذار
5. بزن `Deploy`

## 6. تست

در تلگرام به ربات پیام بده:

`/start`

باید چهار دکمه ببینی:

- آزمون پژوهشی
- نوبت مشاوره
- چت ناشناس
- ارسال پست برای تایید

برای خروج از هر مسیر:

`/cancel`

برای خروج از چت ناشناس:

`/stop`
