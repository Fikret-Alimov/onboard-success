# Renewal Risk Scanner

## Overview

This n8n workflow scans all customer accounts approaching renewal within the next 90 days and flags those showing risk signals. It cross-references renewal dates with health data — usage trends, support tickets, NPS scores, and stakeholder engagement — then sends a prioritized risk report to CSMs via Slack and email with recommended actions.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **CRM access** — Salesforce or HubSpot API credentials with account/renewal data
- **Slack workspace** — Bot token with permission to post to channels
- **SMTP credentials** — For sending email briefings to CSMs

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file
4. The workflow will appear in your workflow list

### Step 2: Configure Credentials

1. **Salesforce/HubSpot:** Add your CRM OAuth2 or API credentials in n8n Settings → Credentials
2. **Slack:** Create a Slack app with bot token and configure the credential
3. **SMTP:** Add your email server credentials for CSM briefing emails

### Step 3: Update API Endpoints

Open the HTTP Request nodes and replace placeholder URLs:

- `Fetch Upcoming Renewals` — Your CRM endpoint that returns accounts with renewal dates
- `Fetch Health Signals` — Your CRM or CS platform endpoint for health/engagement data

### Step 4: Customize Risk Assessment

Open the **Assess Renewal Risk** code node to adjust:

- **Usage decline threshold** (default: -15%)
- **Open ticket threshold** (default: 3 tickets)
- **NPS threshold** (default: below 7)
- **Meeting gap threshold** (default: 30 days)
- **Risk level calculation** (default: 3+ signals = High, 1+ = Medium)

### Step 5: Configure Notifications

- Update the **Send Slack Report** node with your channel (default: `#cs-renewals`)
- Update the **Email CSM Briefing** node with your from address

### Step 6: Set the Schedule

The default schedule runs weekly. Adjust the **Weekly Schedule** node if needed.

### Step 7: Activate

Toggle the workflow to **Active** and monitor the first run.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Weekly | How often the renewal scan runs |
| Renewal window | 90 days | How far ahead to look for renewals |
| Usage decline % | -15% | Threshold for flagging usage decline |
| Ticket threshold | 3 | Open tickets that trigger a risk signal |
| NPS threshold | 7 | NPS below this is a risk signal |
| Meeting gap | 30 days | Days without meeting to flag |

## How to Customize

### Adjust renewal window

Change the `90` in the Fetch Upcoming Renewals URL to scan further out (e.g., 120 or 180 days).

### Add more risk signals

Edit the Assess Renewal Risk code node to include:
- **Contract downgrades** — Check for mid-term seat reductions
- **Payment delays** — Flag accounts with overdue invoices
- **Feature adoption** — Low adoption of key features

### Route by risk level

Add an additional IF node to route High-risk accounts to a VP/director channel while Medium-risk goes to the standard channel.

### Create CRM tasks

Add an HTTP Request node to automatically create follow-up tasks in your CRM for each flagged account.

## Troubleshooting

- **No accounts returned** — Verify your CRM API returns a `renewal_date` field and the date filter is correct
- **All accounts showing Low risk** — Check that health signal fields match expected field names in the code node
- **Email not sending** — Verify SMTP credentials and that the `csm_email` field is populated
- **Slack errors** — Ensure the bot is invited to the target channel
