import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  mockCampaigns,
  get_campaigns,
  get_campaign_metrics,
  pause_campaign,
  activate_campaign,
  create_campaign,
} from "./tools/campaigns.js";

const server = new Server(
  { name: "linkedin-ads-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  get_campaigns,
  get_campaign_metrics,
  pause_campaign,
  activate_campaign,
  create_campaign,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "linkedin-ads-get-campaigns":
      return { content: [{ type: "text", text: JSON.stringify({ data: mockCampaigns }) }] };
    case "linkedin-ads-get-campaign-metrics":
      const campaign = mockCampaigns.find(c => c.id === (args as any).campaignId) || mockCampaigns[0];
      return { content: [{ type: "text", text: JSON.stringify({ data: [campaign] }) }] };
    case "linkedin-ads-pause-campaign":
      return { content: [{ type: "text", text: JSON.stringify({ success: true, paused: (args as any).campaignId }) }] };
    case "linkedin-ads-activate-campaign":
      return { content: [{ type: "text", text: JSON.stringify({ success: true, activated: (args as any).campaignId }) }] };
    case "linkedin-ads-create-campaign":
      return { content: [{ type: "text", text: JSON.stringify({ success: true, campaignId: `li_${Date.now()}`, name: (args as any).name }) }] };
    default:
      return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("LinkedIn Ads MCP server running on stdio (MOCK)");
}

main().catch(console.error);
