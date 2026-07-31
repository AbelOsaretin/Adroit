import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { mockCampaigns, get_campaigns, get_campaign_metrics, pause_campaign, activate_campaign, create_campaign } from "./tools/campaigns.js";

const server = new Server({ name: "amazon-ads-mcp", version: "0.1.0" }, { capabilities: { tools: {} } });
const tools = [get_campaigns, get_campaign_metrics, pause_campaign, activate_campaign, create_campaign];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  switch (name) {
    case "amazon-ads-get-campaigns": return { content: [{ type: "text", text: JSON.stringify({ data: mockCampaigns }) }] };
    case "amazon-ads-get-campaign-metrics": return { content: [{ type: "text", text: JSON.stringify({ data: [mockCampaigns[0]] }) }] };
    case "amazon-ads-pause-campaign": return { content: [{ type: "text", text: JSON.stringify({ success: true, paused: (args as any).campaignId }) }] };
    case "amazon-ads-activate-campaign": return { content: [{ type: "text", text: JSON.stringify({ success: true, activated: (args as any).campaignId }) }] };
    case "amazon-ads-create-campaign": return { content: [{ type: "text", text: JSON.stringify({ success: true, campaignId: `amz_${Date.now()}` }) }] };
    default: return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
});

async function main() { const transport = new StdioServerTransport(); await server.connect(transport); console.error("Amazon Ads MCP server running (MOCK)"); }
main().catch(console.error);
