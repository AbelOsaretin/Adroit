# Architecture

## Overview

The Agentic Marketing Agent is built on Mastra, an AI agent framework that provides tools, workflows, and memory capabilities. The system enables autonomous campaign management with human-in-the-loop approval for significant changes.

## System Components

### 1. Campaign Optimizer Agent

The core AI agent that analyzes campaign data and generates optimization recommendations.

**Responsibilities:**

- Analyze campaign performance across platforms
- Detect anomalies and optimization opportunities
- Generate actionable recommendations
- Manage USDC wallet for payments

### 2. Integration Tools

**Google Ads Tool (`google-ads`)**

- Fetch campaign data and metrics
- Pause/start campaigns
- Update budgets
- Create new campaigns

**Meta Ads Tool (`meta-ads`)**

- Facebook/Instagram campaign management
- Performance metrics retrieval
- Budget adjustments

**Arc Wallet Tool (`arc-wallet`)**

- USDC balance checking
- Payment execution
- Transaction history

**Analytics Tool (`analytics`)**

- Metric aggregation
- Anomaly detection
- ROAS calculation
- Period comparison

### 3. Workflows

**Approval Queue Workflow**

- Validates recommendations
- Routes to execution based on approval status
- Handles expiration

**Campaign Executor Workflow**

- Executes approved actions
- Platform-specific execution
- Result tracking

### 4. Storage Layer

PostgreSQL-based persistence for:

- Campaign data
- Recommendations
- Transaction history

## Data Flow

```
User Request → Agent → Tools → External APIs
                    ↓
              Analytics
                    ↓
            Recommendations
                    ↓
         Approval Workflow
                    ↓
          Campaign Execution
                    ↓
              Storage
```

## Security Considerations

- API keys stored in environment variables
- Database credentials isolated
- Wallet private keys managed securely
- Approval workflow for significant changes

## Scalability

- Stateless agent design
- Database connection pooling
- Tool-based architecture allows independent scaling
- Workflow steps can be distributed

## Future Enhancements

- Multi-user support
- Campaign templates
- A/B testing automation
- Cross-platform budget optimization
- Machine learning for prediction
