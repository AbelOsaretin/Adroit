import { MCPClient } from "@mastra/mcp";

export async function createGoogleAdsMcpClient() {
  const client = new MCPClient({
    id: "google-ads",
    servers: {
      googleAds: {
        command: "npx",
        args: ["tsx", "src/mcp/google-ads/src/index.ts"],
        env: {
          GOOGLE_ADS_CLIENT_ID: process.env.GOOGLE_ADS_CLIENT_ID!,
          GOOGLE_ADS_CLIENT_SECRET: process.env.GOOGLE_ADS_CLIENT_SECRET!,
          GOOGLE_ADS_REFRESH_TOKEN: process.env.GOOGLE_ADS_REFRESH_TOKEN!,
          GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN!,
        },
      },
    },
  });

  return client;
}

export async function createMetaAdsMcpClient() {
  const client = new MCPClient({
    id: "meta-ads",
    servers: {
      metaAds: {
        command: "npx",
        args: ["tsx", "src/mcp/meta-ads/src/index.ts"],
        env: {
          META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN!,
        },
      },
    },
  });

  return client;
}

export async function getAllMcpTools() {
  const googleClient = await createGoogleAdsMcpClient();
  const metaClient = await createMetaAdsMcpClient();

  const googleTools = await googleClient.listTools();
  const metaTools = await metaClient.listTools();

  return {
    google: googleTools,
    meta: metaTools,
    all: { ...googleTools, ...metaTools },
  };
}
