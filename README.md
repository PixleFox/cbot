# Telegram Multipurpose Bot

Cloudflare Worker bot for Telegram with:

- Research-style multiple-choice self-assessment
- Consultation booking requests
- Admin-defined consultation time slots
- 30-minute consultation reminders for admin and user
- User post submission with admin approval
- Text/photo post preview for admin
- Approved posts sent to `@cucksclub`
- Admin panel with Excel-compatible CSV export

## Cloudflare settings

Set these Worker variables/secrets in Cloudflare:

- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `CHANNEL_ID` is set in `wrangler.toml` as `@cucksclub`.

Create and bind a KV namespace with this exact binding name:

- `BOT_KV`

The bot must be admin in the destination channel if it should publish approved posts.

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
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://telegrambot.alirezaeslamibidgoli.workers.dev
```

Then open the bot and send:

```text
/start
```

Admin panel:

```text
/admin
```
