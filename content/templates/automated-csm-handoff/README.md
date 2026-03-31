# Automated CSM Handoff Agent

## Overview

This n8n workflow automates the AE-to-CSM handoff process when a deal closes. It pulls all deal context from your CRM, maps stakeholders, creates a structured handoff briefing, schedules a kickoff meeting via Google Calendar, and notifies the assigned CSM via Slack and email — ensuring zero context is lost in the transition.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce** — OAuth2 API credentials with access to opportunities, accounts, and contacts
- **Google Calendar** — OAuth2 credentials for scheduling meetings
- **Slack workspace** — Bot token with permission to post to channels
- **SMTP credentials** — For sending handoff email briefings
- **CRM webhook** — Ability to fire a webhook when a deal moves to "Closed Won"

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **Salesforce:** Add Salesforce OAuth2 credentials
2. **Google Calendar:** Add Google Calendar OAuth2 credentials
3. **Slack:** Configure Slack bot credentials
4. **SMTP:** Add your email server credentials

### Step 3: Set Up the CRM Webhook

1. Activate the workflow to get the webhook URL from the **Deal Closed Webhook** node
2. In Salesforce, create a workflow rule or Process Builder flow that fires when an Opportunity moves to "Closed Won"
3. Configure it to POST to the n8n webhook URL with `{ "opportunity_id": "{!Opportunity.Id}" }`

### Step 4: Update API Endpoints

- `Fetch Deal Context` — Your CRM opportunity endpoint (with contacts, notes, requirements)
- `Fetch Stakeholders` — Your CRM contacts endpoint for the account
- `Update Account Status` — Your CRM account update endpoint

### Step 5: Customize the Handoff Document

Edit the **Build Handoff Document** code node to match your CRM field names and add any additional context your CSMs need.

### Step 6: Configure Calendar Settings

Update the **Schedule Kickoff Meeting** node:
- Default scheduling: 5 business days after close
- Meeting duration: 1 hour
- Calendar: primary (change to a team calendar if preferred)

### Step 7: Set Notification Channels

- Update Slack channel (default: `#cs-handoffs`)
- Update from email address in the Email node

### Step 8: Activate

Toggle the workflow to **Active**.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Trigger | Webhook (deal close) | How the workflow is triggered |
| Kickoff timing | 5 days after close | When to schedule the kickoff |
| Meeting duration | 1 hour | Length of kickoff meeting |
| Slack channel | #cs-handoffs | Where handoff notifications go |
| Auto-update CRM | Yes | Updates account status to "onboarding" |

## How to Customize

### Add a handoff checklist

Add a node to create a checklist/task list in your project management tool (Asana, Monday, Notion) with standard onboarding steps.

### Include call recordings

If you use Gong or Chorus, add an HTTP Request node to pull key call recordings and include links in the handoff document.

### Multi-CSM routing

Add logic in the Build Handoff Document node to automatically assign CSMs based on account size, region, or industry.

### Add a handoff meeting

Schedule an internal AE↔CSM handoff meeting in addition to the customer kickoff, so the AE can brief the CSM directly.

## Troubleshooting

- **Webhook not firing** — Verify the CRM workflow rule is active and the webhook URL is correct
- **Missing deal data** — Check that your CRM opportunity has fields for `pain_points`, `requirements`, `success_criteria`
- **Calendar errors** — Ensure Google Calendar OAuth2 has write permissions and the calendar is accessible
- **No CSM assigned** — The workflow requires `assigned_csm_email` on the opportunity; add a default if empty
- **Email not sending** — Verify SMTP credentials and that the CSM email field is populated
