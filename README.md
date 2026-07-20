# Telegram Multipurpose Bot

Cloudflare Worker bot for Telegram with:

- Research-style multiple-choice self-assessment
- Consultation booking requests
- Anonymous text chat matching
- User post submission with admin approval

## Cloudflare settings

Set these Worker variables/secrets in Cloudflare:

- `BOT_TOKEN`
- `ADMIN_CHAT_ID`
- `CHANNEL_ID` optional

Create and bind a KV namespace with this exact binding name:

- `BOT_KV`

## Telegram webhook

After deployment, set the Telegram webhook:

```text
https://api.telegram.org/botBOT_TOKEN/setWebhook?url=https://telegrambot.alirezaeslamibidgoli.workers.dev
```

Then open the bot and send:

```text
/start
```
