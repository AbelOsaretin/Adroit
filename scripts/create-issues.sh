#!/bin/bash
# Script to create GitHub issues from the implementation plan
# Usage: ./scripts/create-issues.sh

set -e

echo "Creating GitHub issues for Agentic Marketing Agent tasks..."

# Task 3: Google Ads Tool
gh issue create \
  --title "[Task] Google Ads Tool Integration" \
  --label "task,good-first-issue,tools" \
  --body "## Task: Google Ads Tool

**Plan Reference:** Task 3 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Implement Google Ads API integration tool for campaign management.

### Files to Create
- src/mastra/tools/google-ads.ts
- tests/tools/google-ads.test.ts

### Acceptance Criteria
- [ ] Tool has correct definition (id: google-ads)
- [ ] Input schema validates correctly
- [ ] Tests pass: npm test -- tests/tools/google-ads.test.ts

### Dependencies
- Task 1 (Project Setup) ✓

### Notes
- Follow the implementation in the plan
- Use googleapis package for API calls
- Handle OAuth2 authentication"

echo "✓ Created Issue: Google Ads Tool"

# Task 4: Meta Ads Tool
gh issue create \
  --title "[Task] Meta Ads Tool Integration" \
  --label "task,good-first-issue,tools" \
  --body "## Task: Meta Ads Tool

**Plan Reference:** Task 4 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Implement Meta Marketing API integration for Facebook/Instagram ads.

### Files to Create
- src/mastra/tools/meta-ads.ts
- tests/tools/meta-ads.test.ts

### Acceptance Criteria
- [ ] Tool has correct definition (id: meta-ads)
- [ ] Input schema validates correctly
- [ ] Tests pass: npm test -- tests/tools/meta-ads.test.ts

### Dependencies
- Task 1 (Project Setup) ✓

### Notes
- Use fetch for Meta Graph API
- Handle access token authentication
- Support campaign CRUD operations"

echo "✓ Created Issue: Meta Ads Tool"

# Task 5: Arc Wallet Tool
gh issue create \
  --title "[Task] Arc Wallet Tool Integration" \
  --label "task,good-first-issue,tools" \
  --body "## Task: Arc Wallet Tool

**Plan Reference:** Task 5 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Implement Arc blockchain wallet tool for USDC payments.

### Files to Create
- src/mastra/tools/arc-wallet.ts
- tests/tools/arc-wallet.test.ts

### Acceptance Criteria
- [ ] Tool has correct definition (id: arc-wallet)
- [ ] Input schema validates correctly
- [ ] Tests pass: npm test -- tests/tools/arc-wallet.test.ts

### Dependencies
- Task 1 (Project Setup) ✓

### Notes
- Use viem for blockchain interactions
- Support get-balance, send-payment, get-transaction-history
- Configure Arc Testnet chain"

echo "✓ Created Issue: Arc Wallet Tool"

# Task 6: Analytics Tool
gh issue create \
  --title "[Task] Analytics Tool" \
  --label "task,good-first-issue,tools" \
  --body "## Task: Analytics Tool

**Plan Reference:** Task 6 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Implement analytics tool for campaign metrics aggregation and analysis.

### Files to Create
- src/mastra/tools/analytics.ts
- tests/tools/analytics.test.ts

### Acceptance Criteria
- [ ] Tool has correct definition (id: analytics)
- [ ] Supports aggregate-metrics, detect-anomalies, calculate-roas, compare-periods
- [ ] Tests pass: npm test -- tests/tools/analytics.test.ts

### Dependencies
- Task 1 (Project Setup) ✓

### Notes
- Implement metric aggregation logic
- Add anomaly detection (CTR < 1%, CPC > $5)
- Calculate ROAS with $50 assumed conversion value"

echo "✓ Created Issue: Analytics Tool"

# Task 7: Campaign Optimizer Agent
gh issue create \
  --title "[Task] Campaign Optimizer Agent" \
  --label "task,agent" \
  --body "## Task: Campaign Optimizer Agent

**Plan Reference:** Task 7 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Implement the core AI agent that orchestrates all tools and generates recommendations.

### Files to Create
- src/mastra/agents/campaign-optimizer.ts
- tests/agents/campaign-optimizer.test.ts

### Acceptance Criteria
- [ ] Agent has correct configuration (id: campaign-optimizer)
- [ ] All tools are registered (google-ads, meta-ads, arc-wallet, analytics)
- [ ] Tests pass: npm test -- tests/agents/campaign-optimizer.test.ts

### Dependencies
- Task 3 (Google Ads Tool)
- Task 4 (Meta Ads Tool)
- Task 5 (Arc Wallet Tool)
- Task 6 (Analytics Tool)

### Notes
- Configure agent instructions for marketing optimization
- Use openai/gpt-4o model
- Register all tools properly"

echo "✓ Created Issue: Campaign Optimizer Agent"

# Task 9: Dashboard Setup
gh issue create \
  --title "[Task] Next.js Dashboard Setup" \
  --label "task,good-first-issue,dashboard" \
  --body "## Task: Dashboard Setup

**Plan Reference:** Task 9 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Set up Next.js dashboard for monitoring campaigns and recommendations.

### Files to Create
- dashboard/package.json
- dashboard/app/layout.tsx
- dashboard/app/page.tsx
- dashboard/lib/mastra-client.ts

### Acceptance Criteria
- [ ] Dashboard initializes with Next.js
- [ ] Mastra client is configured
- [ ] Main page shows campaign overview
- [ ] React Query is set up

### Dependencies
- Task 1 (Project Setup) ✓

### Notes
- Use create-next-app with TypeScript and Tailwind
- Install @tanstack/react-query and axios
- Create reusable Mastra client"

echo "✓ Created Issue: Dashboard Setup"

# Task 10: Integration Testing
gh issue create \
  --title "[Task] Integration Testing" \
  --label "task,testing" \
  --body "## Task: Integration Testing

**Plan Reference:** Task 10 in docs/compose/plans/2026-07-22-agentic-marketing-agent.md

### Description
Write end-to-end integration tests for the Mastra setup.

### Files to Create
- tests/integration/e2e.test.ts

### Acceptance Criteria
- [ ] Tests verify Mastra instance initialization
- [ ] Tests verify agent registration
- [ ] Tests verify workflow registration
- [ ] Tests verify tool registration
- [ ] Tests pass: npm test -- tests/integration/e2e.test.ts

### Dependencies
- Task 7 (Campaign Optimizer Agent)
- Task 8 (Approval Queue Workflow)

### Notes
- Test Mastra.getAgent() works
- Test Mastra.getWorkflow() works
- Test Mastra.getTools() returns all tools"

echo "✓ Created Issue: Integration Testing"

echo ""
echo "✅ All issues created successfully!"
echo "Visit your GitHub repository to see them."
