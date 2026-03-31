# Customer Feedback Aggregator

## Overview

This n8n workflow collects customer feedback from multiple sources — NPS surveys (Typeform), support tickets (Zendesk), and product reviews (G2) — runs sentiment analysis, categorizes by theme, and delivers a weekly summary to your CS team via Slack. It highlights accounts with negative feedback that need immediate attention.

## Prerequisites

Before setting up this template, you'll need:

- **n8n instance** (self-hosted or n8n Cloud)
- **Typeform** — API token for accessing NPS survey responses
- **Zendesk** — API credentials for pulling resolved ticket data
- **G2** — API access for product reviews (optional — can be removed)
- **Slack workspace** — Bot token with permission to post to channels

## Setup Guide

### Step 1: Import the Workflow

1. Open your n8n instance
2. Go to **Workflows → Import from File**
3. Upload the `workflow.json` file

### Step 2: Configure Credentials

1. **Typeform:** Add HTTP Header Auth with your Typeform personal access token
2. **Zendesk:** Add Zendesk API credentials (subdomain + API token)
3. **G2:** Add HTTP Header Auth with your G2 API token
4. **Slack:** Configure Slack bot credentials

### Step 3: Update API Endpoints

- `Fetch NPS Responses` — Replace `YOUR_FORM_ID` with your Typeform form ID
- `Fetch Resolved Tickets` — Update Zendesk subdomain
- `Fetch G2 Reviews` — Replace `YOUR_PRODUCT_ID` with your G2 product ID

### Step 4: Customize Sentiment Analysis

Open the **Analyze Sentiment** code node to adjust:

- Score thresholds for positive/negative classification
- Theme keywords for your product's common feedback topics
- Number of flagged accounts to include in the summary

### Step 5: Configure Slack Channel

Update the **Post Weekly Summary** node with your channel (default: `#cs-feedback`).

### Step 6: Activate

Toggle the workflow to **Active**.

## Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| Schedule | Weekly | How often the digest is generated |
| NPS positive threshold | ≥ 8 | Score considered positive |
| NPS negative threshold | ≤ 5 | Score considered negative |
| Theme keywords | 5 categories | Keyword lists for theme extraction |
| Flagged accounts limit | 10 | Max negative accounts shown |

## How to Customize

### Add more feedback sources

Add HTTP Request nodes for additional sources like Intercom conversations, Delighted surveys, or Trustpilot reviews. Connect them to the Merge node.

### Use AI for sentiment analysis

Replace the keyword-based sentiment analysis with an OpenAI or Claude API call for more nuanced classification and theme extraction.

### Add a Google Sheets dashboard

Add a Google Sheets node to write weekly summaries for historical trend tracking.

### Route critical feedback immediately

Add an IF node before the weekly summary to detect highly negative feedback (NPS ≤ 3) and send an immediate Slack DM to the assigned CSM.

## Troubleshooting

- **No Typeform data** — Verify your form ID and that the API token has read access
- **G2 API errors** — G2 API access may require an enterprise plan; remove this node if unavailable
- **Empty sentiment results** — Check that feedback text is in the expected field names (`feedback_text`, `comment`, or `description`)
- **Slack formatting issues** — Long feedback snippets may break formatting; adjust the substring length in the code node
