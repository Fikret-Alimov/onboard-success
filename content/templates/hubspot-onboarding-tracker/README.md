# HubSpot Onboarding Tracker

Monitors all active deals in your HubSpot onboarding pipeline and alerts you when customers fall behind their milestone targets. Runs daily at 9 AM and sends a Slack message to the CSM channel plus a nudge email directly to the customer.

---

## Prerequisites

- n8n instance (self-hosted or n8n Cloud)
- HubSpot account with a dedicated onboarding pipeline
- Slack workspace with bot token
- SMTP email account (Gmail, SendGrid, etc.)
- n8n HubSpot credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/hubspot/)
- n8n Slack credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/slack/)
- n8n SMTP credential — [setup guide](https://docs.n8n.io/integrations/builtin/credentials/smtp/)

---

## Setup Steps

### 1. Import the workflow
In n8n, go to **Workflows → Import from File** and select `workflow.json`.

### 2. Find your HubSpot pipeline ID
1. Go to HubSpot → **Settings** → **CRM** → **Deals** → **Pipelines**
2. Click your onboarding pipeline
3. The URL will contain `pipelineId=XXXXXXX` — copy that value
4. In the **"Search HubSpot Deals"** node, replace `YOUR_ONBOARDING_PIPELINE_ID` with this value

### 3. Configure HubSpot credentials
- Open the **"Search HubSpot Deals"** node
- Create a new HubSpot credential using a Private App token
- Required HubSpot scopes: `crm.objects.deals.read`

### 4. Map your deal stage names
Open the **"Check Milestone Progress"** Code node and update `STAGE_FIELD_MAP`:
- The keys must match your HubSpot stage **internal names** (not display labels)
- Find stage IDs in HubSpot → Settings → Deals → Pipelines → click a stage

Default mapping assumes these stage names:
- `Kickoff Scheduled` → target: 3 days
- `Technical Setup` → target: 7 days
- `Integration Complete` → target: 14 days
- `Training Done` → target: 21 days
- `Go-Live` → target: 30 days

### 5. Customize milestone day targets
In the **"Check Milestone Progress"** Code node, edit the `MILESTONE_TARGETS` object:
```javascript
const MILESTONE_TARGETS = {
  'Kickoff Scheduled':    3,   // change these numbers
  'Technical Setup':      7,
  'Integration Complete': 14,
  'Training Done':        21,
  'Go-Live':              30
};
```

### 6. Set your HubSpot portal ID
In the Code node, replace `YOUR_PORTAL_ID` in the `hsLink` line with your HubSpot account ID (visible in any HubSpot URL, e.g., `app.hubspot.com/contacts/12345678/`).

### 7. Configure Slack
- In the **"Alert CSM on Slack"** node, change `#cs-onboarding` to your channel
- Configure the Slack credential with your bot token

### 8. Configure SMTP email
- In the **"Send Nudge Email"** node:
  - Set `fromEmail` to your CS team email (e.g., `cs@yourcompany.com`)
  - Configure the SMTP credential
  - The `toEmail` is pulled automatically from the deal's `contact_email` property

### 9. Customize the nudge email text
In the Code node, edit the `nudgeMessages` object to match your onboarding steps and link to your actual calendar/training links.

### 10. Activate the workflow
Toggle the workflow to **Active**. It runs Monday–Friday at 9:00 AM.

---

## Troubleshooting

**HubSpot returning no deals**
- Verify your pipeline ID is correct (check the URL in HubSpot Settings)
- Make sure deals exist in non-closed stages — the filter excludes `closedwon` and `closedlost`

**`hs_date_entered_*` fields always null**
- These fields are only populated if you have **HubSpot Sales Hub** (Starter or above)
- If missing, the workflow falls back to `hs_lastmodifieddate`
- Alternatively, use a date custom property you set manually when a deal enters a stage

**Email not sending**
- Gmail users: enable 2FA and create an App Password at myaccount.google.com/apppasswords — use that as your SMTP password
- Port 587 with STARTTLS works for most providers
- Test your SMTP credential separately before activating

**`contact_email` is empty**
- HubSpot deal objects don't always carry contact email by default
- Add an HTTP Request node before the email node to call `/crm/v3/objects/deals/{id}/associations/contacts` and fetch the contact's email from the associated contact record
