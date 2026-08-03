import { Mastra } from "@mastra/core";
import { LibSQLStore } from "@mastra/libsql";
import { campaignOptimizerAgent } from "./agents/campaign-optimizer";
import { approvalQueueWorkflow } from "./workflows/approval-queue";
import { campaignExecutorWorkflow } from "./workflows/campaign-executor";

export const mastra = new Mastra({
  agents: { campaignOptimizerAgent },
  workflows: { approvalQueueWorkflow, campaignExecutorWorkflow },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: "file:./mastra.db",
  }),
});
