# Telegram Multipurpose Bot

Cloudflare Worker bot for Telegram with:

- Research-style multiple-choice self-assessment
- Consultation booking requests
- Admin-defined consultation time slots
- 30-minute consultation reminders for admin and user
- User post submission with admin approval
- Text/photo post preview for admin
- Approved posts sent to `@cclubmain`
- Admin panel with Excel-compatible CSV export

## Cloudflare settings

Set these Worker variables/secrets in Cloudflare:

- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `CHANNEL_ID` is set as `@cclubmain` for confessions and special posts.
- `MEDIA_CHANNEL_ID` is set as `@cclubmedia1` for approved user photo/video posts.
- Every new post published in `@cclubmedia1`, including manual channel posts, is automatically forwarded to `@cclubmain` through Telegram `channel_post` updates.
- Failed photo posts originally scheduled from November 19, 2026 onward are automatically recovered and rescheduled at one media post per free day.
- The previous bull-registration special post is reused once every Friday at its original Tehran time; a default registration post is used if the archived post is unavailable.

Create and bind a KV namespace with this exact binding name:

- `BOT_KV`

The bot must be admin in both destination channels to publish posts. It must also be admin in `@cclubmain` and `@cuckoldgaps` so it can verify channel membership and delete messages from non-members.

Consultation slots should be added by the admin with:

```text
YYYY-MM-DD HH:mm
```

Example:

```text
2026-07-22 20:30
```

Cloudflare scheduled triggers run every 5 minutes and send reminders when a booking is within 30 minutes.

## Telegram webhook

After deployment, set the Telegram webhook:

```text
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://telegrambot.alirezaeslamibidgoli.workers.dev&allowed_updates=%5B%22message%22%2C%22callback_query%22%2C%22channel_post%22%5D
```

Then open the bot and send:

```text
/start
```

Admin panel:

```text
/admin
```
