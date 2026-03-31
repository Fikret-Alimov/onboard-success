# Expansion Signal Detector

## Overview

This n8n workflow identifies accounts showing signs of expansion readiness. It monitors usage patterns, feature adoption, department growth, and sentiment data weekly. When an account crosses the expansion potential threshold, it alerts both the CSM and AE via Slack and optionally creates an expansion opportunity in your CRM.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce** — OAuth2 API credentials with read/write access to accounts and opportunities
- **Mixpanel** — API credentials for usage and adoption data
- **Slack workspace** — Bot token with permission to post to channels

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **Salesforce:** Add Salesforce OAuth2 credentials in n8n Settings → Credentials
2. **Mixpanel:** Add HTTP Header Auth with your Mixpanel service account credentials
3. **Slack:** Configure Slack bot credentials

### Step 3: Update API Endpoints

- `Fetch Active Accounts` — Your CRM account list endpoint (include plan details)
- `Fetch Usage Data` — Your Mixpanel or analytics endpoint
- `Fetch Feature Requests` — Your CRM or product board endpoint for feature requests
- `Create CRM Opportunity` — Your Salesforce opportunity creation endpoint

### Step 4: Customize Expansion Scoring

Open the **Score Expansion Potential** code node to adjust:

- Usage threshold (default: 90% of plan limit)
- Department adoption weighting
- Feature request premium tier matching
- Usage growth threshold (default: 20% MoM)
- NPS promoter threshold (default: 9+)

### Step 5: Configure Notifications

- Update Slack channel (default: `#cs-expansion`)
- Adjust estimated expansion value calculation (default: 30% of current ARR)

### Step 6: Activate

Toggle the workflow to **Active**.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Weekly | How often to scan for expansion signals |
| Usage threshold | 90% | Plan usage % that triggers a signal |
| Growth threshold | 20% | MoM usage growth to flag |
| Expansion threshold | 40 | Minimum score to alert |
| Estimated value | 30% of ARR | Default expansion value estimate |

## How to Customize

### Add more signal sources

Add HTTP Request nodes for:
- **Pendo/Amplitude** — Feature adoption depth
- **Gong/Chorus** — Positive sentiment in call transcripts
- **Support tickets** — Requests for enterprise features

### Customize expansion plays

Edit the suggested plays logic in the code node to match your product's upgrade paths and pricing tiers.

### Create tasks instead of opportunities

Replace the Create CRM Opportunity node with a task creation node if your team prefers CSM tasks over sales opportunities.

### Add email notification

Add an email node to send a formatted expansion briefing directly to the AE with account context and suggested approach.

## Troubleshooting

- **No expansion signals detected** — Lower the expansion threshold or verify usage data includes `plan_limit` and `current_usage` fields
- **Duplicate opportunities** — Add a check before creating to see if an expansion opportunity already exists for the account
- **Missing AE email** — Ensure your CRM account records include an `ae_email` field
- **Mixpanel data empty** — Verify account IDs match between your CRM and Mixpanel
