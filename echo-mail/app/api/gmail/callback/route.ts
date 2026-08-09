import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  exchangeGoogleCodeForTokens,
  fetchGmailProfile,
} from "@/lib/google/oauth";
import { syncGmailInbox } from "@/lib/google/gmail";
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
    return redirectToDashboard(requestUrl, getOAuthErrorMessage(error));
  }

  if (!code || !state || !storedState || state !== storedState) {
    return redirectToDashboard(
      requestUrl,
      "The Gmail connection session expired. Try connecting Gmail again.",
    );
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (!userId) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user?.email) {
      return redirectToDashboard(
        requestUrl,
        "Your login session could not be verified. Sign in again before connecting Gmail.",
      );
    }

    const redirectUri =
      process.env.GOOGLE_REDIRECT_URI ??
      `${getAppUrl(requestUrl.origin)}/api/gmail/callback`;
    const tokens = await exchangeGoogleCodeForTokens({ code, redirectUri });
    const expiresAt = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
      : null;
    const profile = await fetchGmailProfile(tokens.access_token);

    if (!emailsMatch(user.email, profile.emailAddress)) {
      return redirectToDashboard(
        requestUrl,
        `Gmail connection failed. You signed in as ${user.email}, but selected ${profile.emailAddress}. Use the same email account to connect Gmail.`,
      );
    }

    const admin = createAdminClient();

    const { error: upsertError } = await admin
      .from("gmail_connections")
      .upsert({
        user_id: userId,
        gmail_email: profile.emailAddress,
        access_token: encryptSecret(tokens.access_token),
        refresh_token: tokens.refresh_token
          ? encryptSecret(tokens.refresh_token)
          : undefined,
        expires_at: expiresAt,
        scopes: tokens.scope?.split(" ") ?? [],
      }, { onConflict: "user_id" });

    if (upsertError) {
      throw upsertError;
    }

    const { syncedCount } = await syncGmailInbox({
      accessToken: tokens.access_token,
      admin,
      userId,
    });

    const response = NextResponse.redirect(
      new URL(
        `/dashboard?l=connected&synced=${syncedCount}`,
        requestUrl.origin,
      ),
    );
    response.cookies.delete("gmail_oauth_state");

    return response;
  } catch (error) {
    console.error("Gmail OAuth callback failed", error);

    return redirectToDashboard(
      requestUrl,
      "Gmail connection failed. Check your Google OAuth settings and Supabase table setup.",
    );
  }
}

function redirectToDashboard(requestUrl: URL, message: string) {
  const url = new URL("/dashboard", requestUrl.origin);
  url.searchParams.set("l", "error");
  url.searchParams.set("message", message);

  return NextResponse.redirect(url);
}

function getAppUrl(origin: string) {
  return process.env.NEXT_PUBLIC_APP_URL ?? origin;
}

function getOAuthErrorMessage(error: string) {
  if (error === "access_denied") {
    return "Google access was denied. Try connecting Gmail again.";
  }

  return "Google OAuth returned an error. Try connecting Gmail again.";
}

function emailsMatch(firstEmail: string, secondEmail: string) {
  return firstEmail.trim().toLowerCase() === secondEmail.trim().toLowerCase();
}
