# Stakeholder Change Detector

## Overview

This n8n workflow monitors your key customer accounts for changes in stakeholder roles and departures. It checks LinkedIn profiles of champions, decision-makers, and executive sponsors daily, while also scanning your CRM for new executive contacts. When changes are detected, it alerts the CSM via Slack with recommended actions and logs the change in your CRM.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Salesforce** — OAuth2 API credentials with read/write access to contacts and accounts
- **LinkedIn API access** — API key for profile data (or third-party enrichment service like Clearbit, Apollo)
- **Slack workspace** — Bot token with permission to post to channels

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file
4. The workflow will appear in your workflow list

### Step 2: Configure Credentials

1. **Salesforce:** Add your Salesforce OAuth2 credentials in n8n Settings → Credentials
2. **LinkedIn/Enrichment:** Add HTTP Header Auth with your LinkedIn API key or enrichment service token
3. **Slack:** Create a Slack app with bot token and configure the credential

### Step 3: Update API Endpoints

Open the HTTP Request nodes and replace placeholder URLs:

- `Fetch Key Contacts` — Your CRM endpoint for champion/decision-maker contacts
- `Check LinkedIn Profile` — LinkedIn API or enrichment service endpoint
- `Check New Executives` — Your CRM endpoint for recently added contacts
- `Log Change in CRM` — Your CRM activity/task creation endpoint

### Step 4: Configure Contact Roles

Update the `Fetch Key Contacts` node URL to match your CRM's role field values for champions, decision-makers, and executive sponsors.

### Step 5: Set Slack Channel

Update the **Send Change Alert** node with your preferred channel (default: `#cs-stakeholder-alerts`).

### Step 6: Activate

Toggle the workflow to **Active** and monitor the first run.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Daily | How often to check for changes |
| Contact roles | Champion, Decision Maker, Executive Sponsor | Which CRM roles to monitor |
| New exec window | 7 days | How far back to check for new executives |
| Executive titles | VP, Director, C-Suite, Head of | Titles that qualify as "new executive" |

## How to Customize

### Use an enrichment service instead of LinkedIn

Replace the LinkedIn API node with a call to Clearbit, Apollo, or ZoomInfo for more reliable company/title data.

### Add email notifications for critical changes

Add an email node after the merge for critical-severity changes (champion departures) to ensure the CSM sees it immediately.

### Track historical changes

Add a node to write all detected changes to a Google Sheet or database for trend analysis (e.g., accounts with high stakeholder turnover).

### Customize severity levels

Edit the Detect Changes code node to adjust what counts as critical vs. high vs. medium severity based on your organization's priorities.

## Troubleshooting

- **No changes detected** — Verify LinkedIn IDs are populated in your CRM contact records
- **LinkedIn API rate limits** — Add a wait/batch node to throttle requests; consider running less frequently
- **False positives** — Some LinkedIn profile changes may not reflect actual departures; tune the company name matching logic
- **Missing new executives** — Verify your CRM has a `created_date` field on contacts and the endpoint filters correctly
