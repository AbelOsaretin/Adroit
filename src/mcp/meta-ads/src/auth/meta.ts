export interface MetaAuthConfig {
  accessToken: string;
  adAccountId: string;
}

export const META_API_VERSION = "v19.0";
export const META_BASE_URL = `https://graph.facebook.com/${META_API_VERSION}`;

export async function metaApiRequest(
  endpoint: string,
  params: Record<string, string> = {},
  config: MetaAuthConfig,
  method: "GET" | "POST" = "GET"
) {
  const url = new URL(`${META_BASE_URL}${endpoint}`);
  url.searchParams.append("access_token", config.accessToken);

  if (method === "GET") {
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorBody)}`);
    }
    return response.json();
  } else {
    // POST request
    const body = new URLSearchParams(params);
    body.append("access_token", config.accessToken);
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(`Meta API error: ${response.statusText} - ${JSON.stringify(errorBody)}`);
    }
    return response.json();
  }
}
