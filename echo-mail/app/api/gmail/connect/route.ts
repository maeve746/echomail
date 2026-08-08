import { randomBytes } from "crypto";
import { NextResponse } from "next/server";

import { gmailReadonlyScopes } from "@/lib/google/oauth";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();

  if (!data?.claims) {
    return NextResponse.redirect(new URL("/login", getAppUrl()));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI ??
    `${getAppUrl()}/api/gmail/callback`;

  if (!clientId || !clientSecret || !redirectUri) {
    return redirectToDashboard(
      "Google OAuth is not configured. Add GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, and GOOGLE_REDIRECT_URI.",
    );
  }

  const state = randomBytes(32).toString("base64url");
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", gmailReadonlyScopes.join(" "));
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("state", state);

  const response = NextResponse.redirect(url);
  response.cookies.set("gmail_oauth_state", state, {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

function redirectToDashboard(message: string) {
  const url = new URL("/dashboard", getAppUrl());
  url.searchParams.set("l", "error");
  url.searchParams.set("message", message);

  return NextResponse.redirect(url);
}

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
