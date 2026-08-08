import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  exchangeGoogleCodeForTokens,
  getGoogleEmailFromIdToken,
} from "@/lib/google/oauth";
import { encryptSecret } from "@/lib/security/encryption";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const error = requestUrl.searchParams.get("error");
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const storedState = request.cookies.get("gmail_oauth_state")?.value;

  if (error) {
    return redirectToDashboard(requestUrl, error);
  }

  if (!code || !state || !storedState || state !== storedState) {
    return redirectToDashboard(requestUrl, "invalid_oauth_state");
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  try {
    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ??
      `${getAppUrl(requestUrl.origin)}/api/gmail/callback`;
    const tokens = await exchangeGoogleCodeForTokens({ code, redirectUri });
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;
    const admin = createAdminClient();

    const { error: upsertError } = await admin
      .from("gmail_connections")
      .upsert({
        user_id: userId,
        email: getGoogleEmailFromIdToken(tokens.id_token),
        access_token_encrypted: encryptSecret(tokens.access_token),
        refresh_token_encrypted: tokens.refresh_token
          ? encryptSecret(tokens.refresh_token)
          : undefined,
        scope: tokens.scope,
        token_type: tokens.token_type,
        expiry_date: expiresAt,
        connected_at: new Date().toISOString(),
      });

    if (upsertError) {
      throw upsertError;
    }

    const response = redirectToDashboard(requestUrl, "connected");
    response.cookies.delete("gmail_oauth_state");

    return response;
  } catch (error) {
    console.error("Gmail OAuth callback failed", error);

    return redirectToDashboard(requestUrl, "connection_failed");
  }
}

function redirectToDashboard(requestUrl: URL, status: string) {
  return NextResponse.redirect(
    new URL(`/dashboard?gmail=${encodeURIComponent(status)}`, requestUrl.origin),
  );
}

function getAppUrl(origin: string) {
  return process.env.NEXT_PUBLIC_APP_URL ?? origin;
}
