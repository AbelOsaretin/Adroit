import { googleAdsTools } from './google-ads';
import { metaAdsTools } from './meta-ads';

export const adPlatformTools = {
  ...googleAdsTools,
  ...metaAdsTools,
};

export { googleAdsTools } from './google-ads';
export { metaAdsTools } from './meta-ads';
