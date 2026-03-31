# Churn Risk Alert Agent

## Overview

This n8n workflow monitors your customer accounts for churn risk signals and automatically alerts your Customer Success team when accounts need attention. It runs on a schedule, pulls data from your CRM and support platform, calculates a risk score, and sends alerts via Slack.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **CRM access** — Salesforce or HubSpot API credentials
- **Support platform** — Zendesk API key (or equivalent)
- **Product analytics** — API access to your usage/analytics platform
- **Slack workspace** — Bot token with permission to post to channels

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file
4. The workflow will appear in your workflow list

### Step 2: Configure Credentials

1. **CRM (Salesforce/HubSpot):** Go to n8n Settings → Credentials → Add Salesforce OAuth2 or HubSpot API credentials
2. **Zendesk:** Add your Zendesk API credentials (subdomain + API token)
3. **Slack:** Create a Slack app, add bot token, and configure the Slack credential in n8n

### Step 3: Update API Endpoints

Open each HTTP Request node and replace the placeholder URLs with your actual API endpoints:

- `Fetch Accounts from CRM` — Your CRM's account list endpoint
- `Fetch Support Tickets` — Your support platform's ticket search endpoint
- `Fetch Usage Metrics` — Your product analytics API

### Step 4: Customize Risk Scoring

Open the **Calculate Risk Score** code node and adjust:

- **Usage decline threshold** (default: -20%)
- **Support ticket threshold** (default: 5 tickets/30 days)
- **NPS threshold** (default: below 6)
- **Renewal window** (default: 90 days)
- **Weight of each factor** (default: 10-30 points each)

### Step 5: Configure Slack Channel

Update the **Send Slack Alert** node with your preferred channel (default: `#cs-alerts`).

### Step 6: Set the Schedule

The default schedule runs every 6 hours. Adjust the **Schedule Trigger** node to your preference (e.g., daily at 9 AM).

### Step 7: Activate

Toggle the workflow to **Active** and monitor the first few runs.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Every 6 hours | How often the risk scan runs |
| Risk threshold | 30 | Minimum score to trigger an alert |
| Usage decline % | -20% | Usage drop that adds risk points |
| Ticket threshold | 5 | Support tickets in 30 days |
| NPS threshold | 6 | NPS score below this adds risk |
| Renewal window | 90 days | Days before renewal to flag |

## How to Customize

### Add new risk signals

Edit the **Calculate Risk Score** node to add new factors. For example:

- **Login frequency drop** — Check if key users haven't logged in recently
- **Feature adoption** — Flag accounts not using key features
- **Executive sponsor change** — Detect changes in decision-makers

### Customize alert format

Edit the **Send Slack Alert** node message template to match your team's preferences. You can add action buttons, thread replies, or route to different channels based on risk level.

### Add email notifications

Duplicate the Slack node and add an email node for CSMs who prefer email alerts. Use the `csm_email` field to route to the right person.

### Integrate with your CS platform

Add an HTTP Request node to push risk scores back to Gainsight, Totango, ChurnZero, or your CS platform of choice.
