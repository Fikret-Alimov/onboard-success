# Sales-to-Implementation Handoff Analyzer

## What This Does

When a deal is about to close, this workflow builds a comprehensive implementation brief by pulling data from two sources — your CRM and your call recordings — then scoring how ready you actually are for kickoff.

**The flow:**

1. You fill out a simple form: Salesforce Opportunity ID + optional conversation history PDF
2. The workflow fetches the full opportunity from Salesforce
3. It paginates through all Gong calls, fuzzy-matches them to the account
4. It retrieves AI-generated summaries, key points, and action items from matched calls
5. It evaluates your customizable intake checklist against both SF data and call mentions
6. An LLM generates a structured pre-kickoff brief with readiness score, gaps, and recommended actions
7. The formatted brief is emailed to your implementation team

## Flow

```
Form (Opp ID + PDF) → Extract PDF → Salesforce: Get Opportunity
  → Gong: Paginate All Calls → Match Calls to Account
  → Gong: Get Call Summaries → Build LLM Context + Intake Checklist
  → OpenAI: Generate Brief → Format HTML Email → Send to Team
```

## Prerequisites

- **n8n** (self-hosted or Cloud) — needs `@n8n/n8n-nodes-langchain` community package for the OpenAI node
- **Salesforce** — Connected org with Opportunity + Account access
- **Gong** — API access (requires Gong Technical Admin role)
- **OpenAI** — API key for brief generation
- **Gmail** — OAuth2 for sending the brief (or swap for Slack/SMTP)

## Setup (45 minutes)

### Step 1: Import the Workflow

Open n8n → **Workflows** → **Import from File** → upload `workflow.json`.

### Step 2: Configure Salesforce

1. Go to n8n **Credentials** → **Add Credential** → **Salesforce OAuth2 API**
2. Follow the OAuth2 flow to connect your Salesforce org
3. Assign the credential to the **Salesforce - Get Opportunity** node

**Custom fields:** The `Prepare LLM Context` code node maps Salesforce fields to the intake checklist. Standard fields (`Name`, `StageName`, `CloseDate`, `Amount`, `Account.Name`) work immediately. Custom fields (lines marked with ✏️) need to match your org's API names. Open the code node and update the `sfData` object (~line 10).

### Step 3: Configure Gong

1. Go to n8n **Credentials** → **Add Credential** → **Gong API**
2. Enter your Gong API key and secret (generate in Gong → Company Settings → API)
3. In **all three Gong HTTP Request nodes**, replace:
   - `us-XXXXX` in the URL with your Gong API subdomain (shown in your Gong API settings)
   - `YOUR_WORKSPACE_ID` with your Gong workspace ID

**Gong nodes to update:**
- `Gong - First Page`
- `Gong - Next Page`
- `Gong - Get Call Summaries`

### Step 4: Configure OpenAI

1. Go to n8n **Credentials** → **Add Credential** → **OpenAI API**
2. Enter your API key
3. Assign the credential to the **Generate Brief** node
4. (Optional) Change the model — default is `gpt-4.1-nano` for speed/cost. Use `gpt-4o` for higher quality.

### Step 5: Configure Email

Open the **Send Brief** node:
- Replace `implementation-team@yourcompany.com` with your recipients (comma-separated)
- Connect your Gmail OAuth2 credential

### Step 6: Customize the Intake Checklist

This is the most important step. Open the **Prepare LLM Context** code node and find the `intakeChecklist` array (~line 70). This defines what your implementation team needs before kickoff.

Each item has:
```javascript
{
  label: 'Primary Use Case',        // What it's called in the report
  sfFields: ['primaryUseCase'],      // Which sfData key(s) to check
  gongKeywords: ['use case'],        // Keywords to scan for in call recordings
  required: true                     // Does it block kickoff?
}
```

**To customize:**
- Add/remove sections and items to match your intake process
- Update `sfFields` to reference your Salesforce field mappings
- Add `gongKeywords` that your team commonly uses in calls
- Set `required: true` for fields that must be filled before kickoff

### Step 7: Customize the LLM Prompt

Still in the **Prepare LLM Context** node, scroll to the bottom to find `systemPrompt` and `userPrompt`. Update:
- The role description to match your company
- The brief sections to match your kickoff process
- Any company-specific terminology

### Step 8: Test

1. Activate the workflow
2. Open the form URL (shown in the Form Trigger node)
3. Enter a real Salesforce Opportunity ID
4. Check your email for the generated brief

## How the Account Matching Works

The **Match Gong Calls to Account** node uses fuzzy matching to find relevant calls:

1. Takes the account name from Salesforce
2. Strips common suffixes (Inc, LLC, Corp, etc.) and your custom product/brand terms
3. Tokenizes the name and scores each Gong call title by token overlap
4. Returns the top 10 matches with ≥30% token overlap (or containing the longest token)

**To tune matching:**
- Open the code node and add your product/brand names to the `stripSuffixes` function
- Adjust `MATCH_THRESHOLD` (default `0.3`) — lower = more matches, higher = stricter
- The `.slice(0, 10)` limits to 10 calls — increase if your sales cycles involve more calls

## Customization Ideas

### Replace Gmail with Slack
Delete the **Send Brief** node and add a Slack node instead. Use `$json.html` for rich formatting or `$json.plainText` for plain text. Send to a dedicated `#implementation-handoffs` channel.

### Add a Notion/Confluence Page
After the **Format Email** node, add a Notion or Confluence node to create a persistent implementation brief page instead of (or in addition to) email.

### Auto-Create a Project
Add nodes after the brief to create a Jira epic, Asana project, or Monday.com board with tasks based on the identified gaps.

### Different Intake Checklists by Deal Type
Add a Switch node after Salesforce that routes to different `Prepare LLM Context` nodes based on `sf.Type` or `sf.RecordTypeId` — each with a different intake checklist for different product lines or deal sizes.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| "No matching calls found" | Check that the Gong workspace ID is correct. The matching may be too strict — lower `MATCH_THRESHOLD` or add more terms to strip from `stripSuffixes`. |
| Salesforce field is empty but data exists | The custom field API name in your SF org may differ. Check the actual API name in Salesforce → Setup → Object Manager → Opportunity → Fields. |
| Gong pagination never ends | Check the `If cursor exists` node — the cursor check must be `notEmpty`. If Gong returns empty cursor, the loop should exit to `Output All Calls`. |
| LLM response is cut off | Increase `maxTokens` in the **Generate Brief** node (default: 4000). GPT-4.1 supports up to 32K output tokens. |
| PDF text not included | Make sure the uploaded file is a text-based PDF (not a scanned image). The `extractFromFile` node only works with text PDFs. |
| Brief quality is poor | Switch from `gpt-4.1-nano` to `gpt-4o` or `gpt-4.1` in the **Generate Brief** node for better analysis. |
