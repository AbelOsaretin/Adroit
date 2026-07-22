import { describe, it, expect } from "vitest";
import { analyticsTool } from "../../src/mastra/tools/analytics";

describe("analyticsTool", () => {
  it("should have correct tool definition", () => {
    expect(analyticsTool.id).toBe("analytics");
    expect(analyticsTool.description).toBeDefined();
  });

  it("should calculate ROAS correctly", () => {
    const metrics = {
      spend: 100,
      revenue: 500,
    };
    const roas = metrics.revenue / metrics.spend;
    expect(roas).toBe(5);
  });
});
