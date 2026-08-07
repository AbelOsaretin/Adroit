import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { campaignOptimizerAgent } from "./agents/campaign-optimizer";
import { approvalQueueWorkflow } from "./workflows/approval-queue";
import { campaignExecutorWorkflow } from "./workflows/campaign-executor";

// Import tools for registration
import { arcWalletTool } from "./tools/arc-wallet";
import { gatewayTool } from "./tools/gateway";
import { agentServicesTool } from "./tools/agent-services";
import { userWalletTool } from "./tools/user-wallet";
import { cardTool } from "./tools/virtual-card";

export const mastra = new Mastra({
  agents: { campaignOptimizerAgent },
  workflows: { approvalQueueWorkflow, campaignExecutorWorkflow },
  tools: { arcWalletTool, gatewayTool, agentServicesTool, userWalletTool, cardTool },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: "file:./mastra.db",
  }),
});
