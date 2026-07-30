# MCP Setup Guide

## Overview

Adroit uses Model Context Protocol (MCP) servers for Google Ads and Meta Ads integration. This guide explains how to set up and test the MCP servers.

## Google Ads MCP

### Prerequisites
1. Google Developer Account
2. Google Ads API access
3. OAuth2 credentials

### Setup Steps

1. **Get Developer Token**
   - Go to Google Ads API Center
   - Apply for API access
   - Copy your developer token

2. **Create OAuth2 Credentials**
   - Go to Google Cloud Console
   - Create a new project or select existing
   - Enable Google Ads API
   - Create OAuth2 credentials
   - Copy Client ID and Client Secret

3. **Get Refresh Token**
   - Use OAuth2 flow to get authorization code
   - Exchange code for refresh token
   - Save refresh token securely

4. **Add to .env**
   ```
   GOOGLE_ADS_CLIENT_ID=your-client-id
   GOOGLE_ADS_CLIENT_SECRET=your-client-secret
   GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
   GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
   ```

### Testing with Sandbox

Google Ads provides a sandbox environment for testing:
- Use test customer ID: `123-456-7890`
- No real money at risk
- Limited API calls allowed

## Meta Ads MCP

### Prerequisites
1. Facebook Developer Account
2. Facebook App with Marketing API
3. Ad Account ID (act_XXXXXXXXX)

### Setup Steps

1. **Create Facebook App**
   - Go to developers.facebook.com
   - Click "Create App"
   - Select "Business" type
   - Add Marketing API permission

2. **Get Ad Account ID**
   - Go to Business Settings > Ad Accounts
   - Find your ad account ID (format: act_XXXXXXXXX)
   - Or create a test ad account (no billing required)

3. **Generate Access Token**
   - Go to Graph API Explorer
   - Select your app
   - Generate access token with `ads_management` permission
   - Convert to long-lived token for production

4. **Add to .env**
   ```
   META_ACCESS_TOKEN=your-access-token
   ```

### Testing with Test Account

Meta provides test ad accounts for development:
- Create a test ad account in Business Settings
- No billing required for test accounts
- Use test ad account ID for development

## Running MCP Servers

### Google Ads MCP
```bash
npx tsx src/mcp/google-ads/src/index.ts
```

### Meta Ads MCP
```bash
npx tsx src/mcp/meta-ads/src/index.ts
```

## Integration with Mastra

The MCP servers are automatically connected via `src/mastra/mcp-bridge.ts`. When you run `npm run dev`, the Mastra agent will have access to all MCP tools.

## Troubleshooting

### Common Issues

1. **Authentication Error**
   - Verify credentials in .env
   - Check token expiration
   - Regenerate tokens if needed

2. **API Rate Limits**
   - Google Ads: 15,000 operations/day
   - Meta Ads: 200 calls/hour per user
   - Implement caching for repeated requests

3. **MCP Server Won't Start**
   - Check Node.js version (20+)
   - Verify dependencies installed: `npm install`
   - Check for TypeScript errors: `npx tsc --noEmit`

## Next Steps

1. Test with sandbox/test accounts
2. Verify all tools work correctly
3. Test with real ad accounts (small budget)
4. Monitor API usage and costs
