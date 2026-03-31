# Onboarding Milestone Tracker

## Overview

This n8n workflow tracks customer onboarding progress against your defined timeline. When customers fall behind on key milestones, it automatically sends personalized nudge emails via Intercom and alerts the assigned CSM on Slack. Includes a weekly Monday digest of all onboarding accounts.

## Prerequisites

- **n8n instance** (self-hosted or n8n Cloud)
- **HubSpot** — CRM with onboarding accounts tracked
- **Intercom** — For automated customer-facing nudge emails
- **Product/app API** — Endpoint that returns onboarding milestone completion status
- **Slack workspace** — Bot token for CSM notifications

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **HubSpot:** Add your HubSpot API key or OAuth2 credentials
2. **Intercom:** Add your Intercom API access token
3. **Slack:** Configure your Slack bot token credential

### Step 3: Define Your Milestones

Open the **Evaluate Milestones** code node and customize the milestone definitions:

```javascript
const milestones = [
  { name: 'Account Setup', key: 'account_setup', target_day: 1 },
  { name: 'First Login', key: 'first_login', target_day: 2 },
  { name: 'Integration Connected', key: 'integration_setup', target_day: 7 },
  { name: 'Training Completed', key: 'training_complete', target_day: 14 },
  { name: 'First Value Moment', key: 'first_value', target_day: 21 },
  { name: 'Go-Live', key: 'go_live', target_day: 30 }
];
```

Update milestone names, keys, and target days to match your onboarding process.

### Step 4: Update API Endpoints

- `Fetch Onboarding Accounts` — Your CRM endpoint filtered for accounts in onboarding status
- `Fetch Milestone Progress` — Your app's onboarding progress API

### Step 5: Customize Nudge Emails

Edit the **Send Nudge Email** node to customize:

- Email subject line and body
- Intercom admin ID (sender)
- Links to help docs or setup guides

### Step 6: Configure Slack Channel

Update the **Alert CSM on Slack** node channel (default: `#cs-onboarding`).

### Step 7: Activate

Toggle the workflow to **Active**. It runs daily at 8 AM.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Daily at 8 AM | When the check runs |
| Onboarding window | 30 days | Total expected onboarding duration |
| Nudge channel | Intercom email | How customers are nudged |
| CSM alert channel | Slack #cs-onboarding | Where CSMs get notified |
| Weekly digest | Mondays | When the weekly summary goes out |

## How to Customize

### Add in-app messages

Replace or supplement the Intercom email with in-app messages using Intercom's messenger or your own in-app notification system.

### Escalation rules

Add logic to escalate to a manager if a milestone is more than 7 days overdue, or if multiple milestones are at risk simultaneously.

### Customer-facing dashboard

Create a webhook endpoint that your customer portal calls to display real-time onboarding progress — powered by the same milestone data.

### Segment-specific timelines

Use different milestone timelines based on customer tier (Enterprise = 45 days, SMB = 14 days). Add a conditional branch after fetching account data.

### Completion celebration

Add a node that sends a congratulatory message when all milestones are completed — a nice touch that improves the customer experience.
