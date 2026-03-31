# QBR Prep Agent

## Overview

This n8n workflow automatically generates QBR (Quarterly Business Review) briefing documents by pulling account data from your CRM, usage metrics from your analytics platform, and conversation summaries from Gong. It runs daily, checks for upcoming QBRs, and prepares a comprehensive briefing 7–14 days in advance.

## Prerequisites

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce or HubSpot** — CRM with QBR meetings tracked
- **Product analytics API** — Usage data endpoint
- **Gong account** — API access for call recordings and summaries
- **Google Workspace** — For generating Google Docs briefings
- **Slack workspace** — Bot token for notifications

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **Salesforce/HubSpot:** Add your CRM OAuth2 credentials in n8n
2. **Gong:** Create a Gong API key and add as HTTP Header Auth credential
3. **Google Docs:** Set up Google OAuth2 credentials with Docs API scope
4. **Slack:** Add your Slack bot token credential

### Step 3: Update API Endpoints

Replace placeholder URLs in each HTTP Request node:

- `Fetch Upcoming QBRs` — Your CRM's meeting/event search API
- `Fetch Account Data` — Account detail endpoint
- `Fetch Usage Metrics` — Your product analytics endpoint
- `Fetch Gong Calls` — Gong API calls endpoint (or replace with your call recording platform)

### Step 4: Customize the Briefing Template

Open the **Generate QBR Briefing** code node to customize:

- Which metrics to include
- How talking points are generated
- Risk flag thresholds
- Expansion opportunity detection logic

### Step 5: Configure Output

The default output creates a Google Doc and sends a Slack notification. You can:

- Replace Google Docs with **Notion** (use Notion API node)
- Add **email delivery** with an email node
- Push to **Confluence** or other documentation platforms

### Step 6: Set the Schedule

Default: runs daily at 9 AM and checks for QBRs in the next 14 days. Adjust the trigger and date range as needed.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Daily at 9 AM | When the workflow runs |
| Lookahead window | 14 days | How far ahead to check for QBRs |
| Usage period | 90 days | Metrics lookback period |
| Call history | 90 days | Gong call lookback period |
| Output format | Google Docs | Where briefings are created |
| Notification | Slack #cs-qbr-prep | Where CSMs are notified |

## How to Customize

### Add AI-generated summaries

Insert an OpenAI or Claude node after the data collection step to generate natural language summaries of the account health, usage trends, and recommended talking points.

### Multi-stakeholder briefs

Fork the output to generate different briefing versions — a detailed one for the CSM and a concise executive summary for leadership.

### Automated slide deck

Replace the Google Docs output with a Google Slides API call to auto-generate a presentation-ready QBR deck from a template.

### CRM task creation

Add a node to automatically create a "Review QBR briefing" task for the CSM in your CRM, due 3 days before the meeting.
