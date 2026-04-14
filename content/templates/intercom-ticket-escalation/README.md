# Intercom Ticket Escalation to Slack

Listens for new Intercom conversations and tag events via webhook. Automatically evaluates each conversation for escalation signals (VIP tags, priority tags, SLA breach), then posts a formatted alert to #cs-escalations. Optionally uses OpenAI GPT-4o-mini to generate a 2–3 sentence AI summary so CSMs can act without reading the full thread.

---

## Prerequisites

- n8n instance with a public URL (required for webhooks — use ngrok for local testing)
- Intercom workspace with webhook permissions
- Slack workspace with bot token
- OpenAI API key (optional — workflow includes a fallback without AI)
- n8n Intercom credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/intercom/)
- n8n Slack credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/slack/)
- n8n OpenAI credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/openai/) (optional)

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`. **Do not activate yet.**

### 2. Get your webhook URL
- Open the **"Intercom Webhook"** trigger node
- Copy the webhook URL (format: `https://your-n8n.com/webhook/...`)

### 3. Configure Intercom webhook
1. Go to Intercom → **Settings** → **Integrations** → **Webhooks**
2. Click **Add webhook URL** and paste the n8n URL
3. Subscribe to these topics:
   - `conversation.created`
   - `conversation.tag.created`
4. Save — Intercom will send a test verification automatically

### 4. Configure Intercom credentials
- In the **"Intercom Webhook"** node, create a new Intercom credential
- Use an Intercom Access Token (Settings → Developers → Your App → Authentication)

### 5. Customize escalation tags
Open the **"Extract and Evaluate"** Code node and update `ESCALATION_TAGS` and `VIP_TAGS`:
```javascript
const ESCALATION_TAGS = ['urgent', 'vip', 'escalation', 'p1', 'critical', 'at-risk', 'churn-risk'];
const VIP_TAGS = ['vip', 'enterprise', 'key-account'];
```
Change these to match the tag names you actually use in Intercom. Tag names are case-insensitive in this workflow.

### 6. Update the Intercom app URL
In the Code node, find this line:
```javascript
const conversationLink = `https://app.intercom.com/a/apps/YOUR_APP_ID/conversations/${conversationId}`;
```
Replace `YOUR_APP_ID` with your Intercom app ID (visible in your Intercom URL, e.g., `app.intercom.com/a/apps/abc12345/`).

### 7. Configure Slack
- In both Slack nodes (**"Post to Slack (with AI)"** and **"Post to Slack (no AI)"**), change `#cs-escalations` to your channel
- Create or select a Slack credential (bot token `xoxb-...`)
- Invite the bot to the channel: `/invite @your-bot-name`

### 8. Configure OpenAI (optional)
- In the **"Summarize with OpenAI"** node, create or select your OpenAI credential
- Default model: `gpt-4o-mini` (cheap and fast, ~$0.0001 per escalation)
- To use GPT-4o instead, change the `model` field to `gpt-4o`

### 9. Skip OpenAI (optional)
If you don't want AI summaries:
1. Delete the **"Summarize with OpenAI"** and **"Add Summary to Data"** nodes
2. Connect the **"Is Escalation?"** IF node's true output directly to **"Post to Slack (no AI)"**

### 10. Activate the workflow
Toggle to **Active**. All new Intercom conversations will now be evaluated in real-time.

---

## Escalation Logic

| Condition | Result |
|---|---|
| Conversation tagged with a priority tag | Escalate |
| Conversation tagged with a VIP tag | Escalate |
| Conversation > 2 hours old with no assignee | Escalate (SLA breach) |
| VIP + priority tag | Priority = P1 (highest) |

---

## Slack Message Format (with AI)

```
🚨 *Escalation Alert*

*Customer:* Jane Smith (Acme Corp)
*Priority:* 🔴 P1 — VIP + Priority Tag
*SLA:* ⚠️ 145 min (breaching)

*AI Summary:*
The customer is reporting that their API integration stopped working after a recent update. They're unable to process transactions and estimate $50k/hour in lost revenue. They've already tried re-authenticating with no success.

*Tags:* vip, urgent, enterprise
*Conversation:* https://app.intercom.com/...
```

---

## Troubleshooting

**Webhook not receiving events**
- Ensure your n8n instance is accessible from the internet (Intercom cannot reach localhost)
- For local testing, use ngrok: `ngrok http 5678` and use the ngrok URL as your webhook

**`$('Is Escalation?').first()` returns error in the merge node**
- This is the `Add Summary to Data` node referencing a previous node by name
- If you renamed the IF node, update the reference in the Code node accordingly

**Intercom credentials failing**
- Intercom API tokens are workspace-specific. Make sure you're using a token from the correct workspace
- Required scope: `Read conversations`

**OpenAI returning empty summary**
- Check that your API key has credits remaining at platform.openai.com/usage
- The `gpt-4o-mini` model sometimes returns empty for very short conversations — add a fallback: `summary || lastMessageExcerpt`
