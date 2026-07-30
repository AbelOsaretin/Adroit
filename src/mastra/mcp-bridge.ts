import { MCPClient } from "@mastra/mcp";

const projectRoot = "/home/dev-abel/CodeBase/Playground/Adroit";

// Google Ads MCP Server - using stdio transport
export const googleAdsMcp = new MCPClient({
  id: "google-ads",
  servers: {
    googleAds: {
      command: "npx",
      args: ["tsx", `${projectRoot}/src/mcp/google-ads/src/index.ts`],
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
      args: ["tsx", `${projectRoot}/src/mcp/meta-ads/src/index.ts`],
      env: {
        META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN!,
      },
    },
  },
});

// Combined MCP client for all ad platforms
export const allAdsMcp = new MCPClient({
  id: "all-ads",
  servers: {
    googleAds: {
      command: "npx",
      args: ["tsx", `${projectRoot}/src/mcp/google-ads/src/index.ts`],
      env: {
        GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
        GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
        GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
        GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
      },
    },
    metaAds: {
      command: "npx",
      args: ["tsx", `${projectRoot}/src/mcp/meta-ads/src/index.ts`],
      env: {
        META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN!,
      },
    },
  },
});
