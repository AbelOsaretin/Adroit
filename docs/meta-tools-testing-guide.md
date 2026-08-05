# Meta Ads Tools - Manual Testing Guide

## Overview

This guide explains how to manually test all Meta Ads tools through the Adroit chat interface.

## Prerequisites

1. Mastra server running: `npm run dev:mastra`
2. Frontend running: `npm run dev`
3. Meta API credentials configured in `.env`:
   ```
   META_ACCESS_TOKEN=your-token
   META_AD_ACCOUNT_ID=your-account-id
   ```

## Access the Chat

Open `http://localhost:3000/dashboard/chat`

---

## Test Cases

### 1. Campaign Types

#### Create Video Campaign
```
Create a video campaign called "Summer Sale Video" on Meta with a $25 daily budget
```
**Expected:** Campaign created with ID, status PAUSED

#### Create App Install Campaign
```
Create an app install campaign for my mobile app on Meta with $20 daily budget
```
**Expected:** Campaign created with ID

#### Create Lead Gen Campaign
```
Create a lead generation campaign on Meta with email and name form fields, $30 budget
```
**Expected:** Campaign created with ID

---

### 2. Campaign Management

#### Get Campaigns
```
Show me all my Meta campaigns
```
**Expected:** List of campaigns with IDs, names, status

#### Pause Campaign
```
Pause campaign [CAMPAIGN_ID]
```
**Expected:** Campaign status changes to PAUSED

#### Activate Campaign
```
Activate campaign [CAMPAIGN_ID]
```
**Expected:** Campaign status changes to ACTIVE

#### Update Budget
```
Update campaign [CAMPAIGN_ID] budget to $50
```
**Expected:** Budget updated

---

### 3. Retargeting

#### Create Retargeting Audience
```
Create a retargeting audience for website visitors from the last 30 days
```
**Expected:** Audience created (may need permissions)

#### Get Custom Audiences
```
Show me my custom audiences
```
**Expected:** List of audiences

---

### 4. Performance Marketing

#### Multi-Touch Attribution
```
Analyze multi-touch attribution for my account using linear model
```
**Expected:** Attribution data with channel breakdown

#### Calculate Customer LTV
```
Calculate customer lifetime value for the last 90 days
```
**Expected:** LTV calculation

#### Blended CPA
```
What's my blended cost per acquisition?
```
**Expected:** CPA calculation

#### Forecast Performance
```
Forecast performance for campaign [CAMPAIGN_ID] for the next 30 days
```
**Expected:** Performance projection

#### Optimize Bidding
```
Optimize bidding for campaign [CAMPAIGN_ID] to maximize conversions
```
**Expected:** Bid recommendations

---

### 5. Insights

#### Account Insights
```
Get my Meta account insights for the last 30 days
```
**Expected:** Impressions, clicks, spend, CTR

#### Campaign Insights
```
Get insights for campaign [CAMPAIGN_ID]
```
**Expected:** Campaign-specific metrics

#### Detect Anomalies
```
Detect any anomalies in my Meta campaigns
```
**Expected:** List of anomalies (low CTR, high CPC)

---

### 6. Ad Sets

#### Get Ad Sets
```
Show me all ad sets for campaign [CAMPAIGN_ID]
```
**Expected:** List of ad sets

#### Create Ad Set
```
Create an ad set for campaign [CAMPAIGN_ID] targeting ages 25-45 with $15 daily budget
```
**Expected:** Ad set created

---

### 7. Creatives

#### Get Ad Creatives
```
Show me my ad creatives
```
**Expected:** List of creatives

---

## Example Test Session

```
User: Show me all my Meta campaigns
Agent: [Calls meta-get-campaigns tool]
Agent: You have 6 campaigns...

User: Create a video campaign for Black Friday on Meta with $50 budget
Agent: [Calls createVideoCampaign tool]
Agent: Created campaign "Black Friday Video" with ID 120249905617830361

User: Get insights for that campaign
Agent: [Calls meta-get-campaign-metrics tool]
Agent: Campaign has 1,250 impressions, 45 clicks...

User: Pause the Black Friday campaign
Agent: [Calls meta-pause-campaign tool]
Agent: Campaign paused successfully

User: What's my ROAS across all campaigns?
Agent: [Calls meta-calculate-roas tool]
Agent: Your overall ROAS is 3.2x...
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Permissions error" | Check Meta API permissions for custom audiences |
| "Invalid access token" | Verify META_ACCESS_TOKEN in .env |
| "Account not found" | Verify META_AD_ACCOUNT_ID format (act_XXXXXXXXX) |
| Tool not responding | Check Mastra server logs |

---

## Available Tools Reference

| Category | Tool | Description |
|----------|------|-------------|
| Campaigns | `meta-get-campaigns` | List all campaigns |
| Campaigns | `meta-create-campaign` | Create new campaign |
| Campaigns | `meta-pause-campaign` | Pause campaign |
| Campaigns | `meta-activate-campaign` | Activate campaign |
| Campaigns | `meta-update-campaign-budget` | Update budget |
| Campaigns | `meta-delete-campaign` | Delete campaign |
| Ad Sets | `meta-get-adsets` | List ad sets |
| Ad Sets | `meta-create-adset` | Create ad set |
| Audiences | `meta-get-custom-audiences` | List audiences |
| Audiences | `meta-create-custom-audience` | Create audience |
| Insights | `meta-get-account-insights` | Account metrics |
| Insights | `meta-get-campaign-insights` | Campaign metrics |
| Insights | `meta-detect-anomalies` | Find anomalies |
| Insights | `meta-calculate-roas` | Calculate ROAS |
| Creatives | `meta-get-ad-creatives` | List creatives |
| Creatives | `meta-create-ad-creative` | Create creative |
| Wallet | `arc-wallet` | USDC wallet operations |
| Gateway | `gateway` | Crosschain transfers |
| Services | `agent-services` | Agent-to-agent payments |
