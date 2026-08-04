import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  getCampaignsTool,
  getCampaignMetricsTool,
  createCampaignTool,
  pauseCampaignTool,
  activateCampaignTool,
  updateCampaignBudgetTool,
  deleteCampaignTool,
  getCampaignAdSetsTool,
  getCampaignAdsTool,
  executeGetCampaigns,
  executeGetCampaignMetrics,
  executeCreateCampaign,
  executePauseCampaign,
  executeActivateCampaign,
  executeUpdateCampaignBudget,
  executeDeleteCampaign,
  executeGetCampaignAdSets,
  executeGetCampaignAds,
} from "./tools/campaigns.js";
import {
  getAdSetsTool,
  createAdSetTool,
  pauseAdSetTool,
  activateAdSetTool,
  updateAdSetBudgetTool,
  getAdSetInsightsTool,
  getAdSetAdsTool,
  executeGetAdSets,
  executeCreateAdSet,
  executePauseAdSet,
  executeActivateAdSet,
  executeUpdateAdSetBudget,
  executeGetAdSetInsights,
  executeGetAdSetAds,
} from "./tools/adsets.js";
import {
  getCustomAudiencesTool,
  createCustomAudienceTool,
  createWebsiteCustomAudienceTool,
  createLookalikeAudienceTool,
  deleteCustomAudienceTool,
  getAudienceSizeTool,
  executeGetCustomAudiences,
  executeCreateCustomAudience,
  executeCreateWebsiteCustomAudience,
  executeCreateLookalikeAudience,
  executeDeleteCustomAudience,
  executeGetAudienceSize,
} from "./tools/audiences.js";
import {
  getAccountInsightsTool,
  getCampaignInsightsTool,
  detectAnomaliesTool,
  calculateROASTool,
  comparePeriodsTool,
  getReachEstimateTool,
  executeGetAccountInsights,
  executeGetCampaignInsights,
  executeDetectAnomalies,
  executeCalculateROAS,
  executeComparePeriods,
  executeGetReachEstimate,
} from "./tools/insights.js";
import {
  getAdCreativesTool,
  createAdCreativeTool,
  createAdCreativeFromPostTool,
  deleteAdCreativeTool,
  uploadAdImageTool,
  uploadAdVideoTool,
  executeGetAdCreatives,
  executeCreateAdCreative,
  executeCreateAdCreativeFromPost,
  executeDeleteAdCreative,
  executeUploadAdImage,
  executeUploadAdVideo,
} from "./tools/creatives.js";

const server = new Server(
  { name: "meta-mcp", version: "0.2.0" },
  { capabilities: { tools: {} } }
);

const tools = [
  // Campaigns
  getCampaignsTool,
  getCampaignMetricsTool,
  createCampaignTool,
  pauseCampaignTool,
  activateCampaignTool,
  updateCampaignBudgetTool,
  deleteCampaignTool,
  getCampaignAdSetsTool,
  getCampaignAdsTool,
  // Ad Sets
  getAdSetsTool,
  createAdSetTool,
  pauseAdSetTool,
  activateAdSetTool,
  updateAdSetBudgetTool,
  getAdSetInsightsTool,
  getAdSetAdsTool,
  // Custom Audiences
  getCustomAudiencesTool,
  createCustomAudienceTool,
  createWebsiteCustomAudienceTool,
  createLookalikeAudienceTool,
  deleteCustomAudienceTool,
  getAudienceSizeTool,
  // Insights & Analytics
  getAccountInsightsTool,
  getCampaignInsightsTool,
  detectAnomaliesTool,
  calculateROASTool,
  comparePeriodsTool,
  getReachEstimateTool,
  // Ad Creatives
  getAdCreativesTool,
  createAdCreativeTool,
  createAdCreativeFromPostTool,
  deleteAdCreativeTool,
  uploadAdImageTool,
  uploadAdVideoTool,
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const accessToken = process.env.META_ACCESS_TOKEN!;

  try {
    let result: any;

    switch (name) {
      // Campaigns
      case "meta-get-campaigns":
        result = await executeGetCampaigns(args, accessToken);
        break;
      case "meta-get-campaign-metrics":
        result = await executeGetCampaignMetrics(args, accessToken);
        break;
      case "meta-create-campaign":
        result = await executeCreateCampaign(args, accessToken);
        break;
      case "meta-pause-campaign":
        result = await executePauseCampaign(args, accessToken);
        break;
      case "meta-activate-campaign":
        result = await executeActivateCampaign(args, accessToken);
        break;
      case "meta-update-campaign-budget":
        result = await executeUpdateCampaignBudget(args, accessToken);
        break;
      case "meta-delete-campaign":
        result = await executeDeleteCampaign(args, accessToken);
        break;
      case "meta-get-campaign-adsets":
        result = await executeGetCampaignAdSets(args, accessToken);
        break;
      case "meta-get-campaign-ads":
        result = await executeGetCampaignAds(args, accessToken);
        break;
      // Ad Sets
      case "meta-get-adsets":
        result = await executeGetAdSets(args, accessToken);
        break;
      case "meta-create-adset":
        result = await executeCreateAdSet(args, accessToken);
        break;
      case "meta-pause-adset":
        result = await executePauseAdSet(args, accessToken);
        break;
      case "meta-activate-adset":
        result = await executeActivateAdSet(args, accessToken);
        break;
      case "meta-update-adset-budget":
        result = await executeUpdateAdSetBudget(args, accessToken);
        break;
      case "meta-get-adset-insights":
        result = await executeGetAdSetInsights(args, accessToken);
        break;
      case "meta-get-adset-ads":
        result = await executeGetAdSetAds(args, accessToken);
        break;
      // Custom Audiences
      case "meta-get-custom-audiences":
        result = await executeGetCustomAudiences(args, accessToken);
        break;
      case "meta-create-custom-audience":
        result = await executeCreateCustomAudience(args, accessToken);
        break;
      case "meta-create-website-audience":
        result = await executeCreateWebsiteCustomAudience(args, accessToken);
        break;
      case "meta-create-lookalike-audience":
        result = await executeCreateLookalikeAudience(args, accessToken);
        break;
      case "meta-delete-custom-audience":
        result = await executeDeleteCustomAudience(args, accessToken);
        break;
      case "meta-get-audience-size":
        result = await executeGetAudienceSize(args, accessToken);
        break;
      // Insights & Analytics
      case "meta-get-account-insights":
        result = await executeGetAccountInsights(args, accessToken);
        break;
      case "meta-get-campaign-insights":
        result = await executeGetCampaignInsights(args, accessToken);
        break;
      case "meta-detect-anomalies":
        result = await executeDetectAnomalies(args, accessToken);
        break;
      case "meta-calculate-roas":
        result = await executeCalculateROAS(args, accessToken);
        break;
      case "meta-compare-periods":
        result = await executeComparePeriods(args, accessToken);
        break;
      case "meta-get-reach-estimate":
        result = await executeGetReachEstimate(args, accessToken);
        break;
      // Ad Creatives
      case "meta-get-ad-creatives":
        result = await executeGetAdCreatives(args, accessToken);
        break;
      case "meta-create-ad-creative":
        result = await executeCreateAdCreative(args, accessToken);
        break;
      case "meta-create-creative-from-post":
        result = await executeCreateAdCreativeFromPost(args, accessToken);
        break;
      case "meta-delete-ad-creative":
        result = await executeDeleteAdCreative(args, accessToken);
        break;
      case "meta-upload-ad-image":
        result = await executeUploadAdImage(args, accessToken);
        break;
      case "meta-upload-ad-video":
        result = await executeUploadAdVideo(args, accessToken);
        break;
      default:
        return {
          content: [{ type: "text", text: `Unknown tool: ${name}` }],
          isError: true,
        };
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result) }],
    };
  } catch (error) {
    return {
      content: [{
        type: "text",
        text: JSON.stringify({
          error: error instanceof Error ? error.message : "Unknown error",
        }),
      }],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Meta Ads MCP server running on stdio");
}

main().catch(console.error);
