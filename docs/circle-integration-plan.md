# Circle Integration Plan for Adroit

## Overview

Adroit is an AI marketing agency platform that needs to:
1. Manage USDC across multiple blockchains (Gateway)
2. Accept payments from other AI agents (x402/Agent Payments)

---

## Plan 1: Gateway Crosschain USDC Balance

### Goal
Enable Adroit to hold a unified USDC balance across multiple chains and transfer USDC instantly between chains.

### Implementation Steps

#### Phase 1: Gateway Tool (Mastra Tool)
1. Create `src/mastra/tools/gateway.ts` with actions:
   - `get-unified-balance` - Query unified balance across all chains
   - `deposit` - Deposit USDC to Gateway Wallet on any chain
   - `transfer-crosschain` - Burn on source chain, mint on destination
   - `get-transfer-status` - Check transaction status

2. Add Gateway contracts:
   - EVM Testnet Gateway Wallet: `0x0077777d7EBA4688BDeF3E311b846F25870A19B9`
   - EVM Testnet Gateway Minter: `0x0022222ABE238Cc2C7Bb1f21003F0a260052475B`

#### Phase 2: Integration with Agent
3. Register Gateway tool in `src/mastra/index.ts`
4. Update agent instructions to use Gateway for crosschain payments

#### Phase 3: UI Updates
5. Add Gateway balance display to dashboard
6. Add crosschain transfer UI

### Files to Create/Modify
- `src/mastra/tools/gateway.ts` (NEW)
- `src/mastra/index.ts` (MODIFY)
- `src/app/dashboard/page.tsx` (MODIFY)

---

## Plan 2: Accept Agent Payments (x402)

### Goal
Enable other AI agents to pay for Adroit's marketing services via USDC micropayments.

### Implementation Steps

#### Phase 1: Payment Middleware
1. Install packages: `@circle-fin/x402-batching`, `@x402/core`, `@x402/evm`
2. Create `src/app/api/payments/middleware.ts` with Gateway middleware
3. Create payment-protected API endpoints:
   - `POST /api/services/analyze-seo` - $0.01 per call
   - `POST /api/services/create-content` - $0.05 per call
   - `POST /api/services/manage-campaign` - $0.10 per call

#### Phase 2: Service Catalog
4. Create `src/mastra/services/catalog.ts` with service definitions
5. Add pricing tiers for different marketing services

#### Phase 3: Agent Marketplace
6. Create service listing metadata
7. Add discovery endpoint for other agents

### Files to Create/Modify
- `src/app/api/payments/middleware.ts` (NEW)
- `src/app/api/services/[...route]/route.ts` (NEW)
- `src/mastra/services/catalog.ts` (NEW)

---

## Current Status

- [x] Circle Skills installed (9 skills)
- [x] arc-wallet.ts already integrated
- [ ] Gateway integration (IN PROGRESS)
- [ ] Agent payments (PENDING)

---

## Environment Variables Needed

```bash
# Already configured
CIRCLE_API_KEY=
ENTITY_SECRET=

# For Gateway
SELLER_ADDRESS=0x... # EVM address for receiving payments
```
