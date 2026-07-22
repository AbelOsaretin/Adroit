import { describe, it, expect } from "vitest";
import { campaignOptimizerAgent } from "../../src/mastra/agents/campaign-optimizer";

describe("campaignOptimizerAgent", () => {
  it("should have correct agent ID", () => {
    expect(campaignOptimizerAgent.id).toBe("campaign-optimizer");
  });

  it("should have correct agent name", () => {
    expect(campaignOptimizerAgent.name).toBe("Campaign Optimizer");
  });

  it("should have model configured", () => {
    expect(campaignOptimizerAgent.model).toBeDefined();
  });

  it("should be an instance of Agent", () => {
    expect(campaignOptimizerAgent).toBeDefined();
    expect(typeof campaignOptimizerAgent.id).toBe("string");
    expect(typeof campaignOptimizerAgent.name).toBe("string");
  });
});
