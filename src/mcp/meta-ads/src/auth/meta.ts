export interface MetaAuthConfig {
  accessToken: string;
  adAccountId: string;
}

export const META_API_VERSION = "v19.0";
export const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export async function metaApiRequest(
  endpoint: string,
  params: Record<string, string> = {},
  config: MetaAuthConfig
) {
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.append("access_token", config.accessToken);
  Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Meta API error: ${response.statusText}`);
  }
  return response.json();
}
