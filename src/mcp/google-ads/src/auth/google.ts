export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  developerToken: string;
}

export type GoogleAdsConfig = GoogleAuthConfig;

export interface GoogleAdsTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getAccessToken(config: GoogleAuthConfig): Promise<string> {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      refresh_token: config.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get access token");
  }

  const data: GoogleAdsTokenResponse = await response.json();
  return data.access_token;
}

export async function googleAdsApiRequest(
  endpoint: string,
  config: GoogleAuthConfig,
  options: RequestInit = {}
) {
  const accessToken = await getAccessToken(config);

  const response = await fetch(`https://googleads.googleapis.com/v17/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${accessToken}`,
      "developer-token": config.developerToken,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Google Ads API error: ${response.statusText}`);
  }

  return response.json();
}
