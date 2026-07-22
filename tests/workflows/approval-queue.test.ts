import { describe, it, expect } from "vitest";
import { approvalQueueWorkflow } from "../../src/mastra/workflows/approval-queue";

describe("approvalQueueWorkflow", () => {
  it("should have correct workflow configuration", () => {
    expect(approvalQueueWorkflow.id).toBe("approval-queue");
  });
});
