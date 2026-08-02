
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { weatherAgent } from './agents/weather-agent';
import { marketingAgent } from './agents/marketing-agent';


export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { weatherAgent, marketingAgent },
  storage: new LibSQLStore({
    id: "mastra-storage",
    url: process.env.TURSO_DATABASE_URL ?? "file:./mastra.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
