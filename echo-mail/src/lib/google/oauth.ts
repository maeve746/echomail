export const gmailReadonlyScopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
];

export type GoogleTokenResponse = {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  id_token?: string;
};

export async function exchangeGoogleCodeForTokens({
  code,
  redirectUri,
}: {
  code: string;
  redirectUri: string;
}) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Missing Google OAuth environment variables.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokens = (await response.json()) as GoogleTokenResponse & {
    error?: string;
    error_description?: string;
  };

  if (!response.ok) {
    throw new Error(
      tokens.error_description ?? tokens.error ?? "Google token exchange failed.",
    );
  }

  return tokens;
}

export async function fetchGmailProfile(accessToken: string) {
  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/profile",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const profile = (await response.json()) as {
    emailAddress?: string;
    error?: {
      message?: string;
    };
  };

  if (!response.ok || !profile.emailAddress) {
    throw new Error(
      profile.error?.message ?? "Unable to fetch Gmail profile.",
    );
  }

  return profile;
}
