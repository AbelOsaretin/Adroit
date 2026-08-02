import { MCPClient } from "@mastra/mcp";

const backendRoot = "/mcp";

// Google Ads MCP Server - using stdio transport
export const googleAdsMcp = new MCPClient({
  id: "google-ads",
  servers: {
    googleAds: {
      command: "npx",
      args: ["tsx", `${backendRoot}/src/mcp/google-ads/src/index.ts`],
      env: {
        GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
        GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      },
    },
  },
});

// Meta Ads MCP Server - using stdio transport
export const metaAdsMcp = new MCPClient({
  id: "meta-ads",
  servers: {
    metaAds: {
      command: "npx",
      args: ["tsx", `${backendRoot}/src/mcp/meta-ads/src/index.ts`],
      env: {
        META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN!,
      },
    },
  },
});

// Mock MCP servers for additional platforms
export const linkedinAdsMcp = new MCPClient({
  id: "linkedin-ads",
  servers: { linkedinAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/linkedin-ads/src/index.ts`] } },
});

export const tiktokAdsMcp = new MCPClient({
  id: "tiktok-ads",
  servers: { tiktokAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/tiktok-ads/src/index.ts`] } },
});

export const microsoftAdsMcp = new MCPClient({
  id: "microsoft-ads",
  servers: { microsoftAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/microsoft-ads/src/index.ts`] } },
});

export const amazonAdsMcp = new MCPClient({
  id: "amazon-ads",
  servers: { amazonAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/amazon-ads/src/index.ts`] } },
});

export const pinterestAdsMcp = new MCPClient({
  id: "pinterest-ads",
  servers: { pinterestAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/pinterest-ads/src/index.ts`] } },
});

export const snapAdsMcp = new MCPClient({
  id: "snap-ads",
  servers: { snapAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/snap-ads/src/index.ts`] } },
});

// Combined MCP client for ALL ad platforms
export const allAdsMcp = new MCPClient({
  id: "all-ads",
  servers: {
    googleAds: {
      command: "npx",
      args: ["tsx", `${backendRoot}/src/mcp/google-ads/src/index.ts`],
      env: {
        GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
        GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      },
    },
    metaAds: {
      command: "npx",
      args: ["tsx", `${backendRoot}/src/mcp/meta-ads/src/index.ts`],
      env: { META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN! },
    },
    linkedinAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/linkedin-ads/src/index.ts`] },
    tiktokAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/tiktok-ads/src/index.ts`] },
    microsoftAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/microsoft-ads/src/index.ts`] },
    amazonAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/amazon-ads/src/index.ts`] },
    pinterestAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/pinterest-ads/src/index.ts`] },
    snapAds: { command: "npx", args: ["tsx", `${backendRoot}/src/mcp/snap-ads/src/index.ts`] },
  },
});
