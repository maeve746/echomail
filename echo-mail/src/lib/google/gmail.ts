import type { SupabaseClient } from "@supabase/supabase-js";

type GmailListResponse = {
  messages?: Array<{
    id: string;
    threadId: string;
  }>;
  nextPageToken?: string;
};

type GmailMessage = {
  id: string;
  threadId: string;
  labelIds?: string[];
  snippet?: string;
  internalDate?: string;
  payload?: {
    headers?: Array<{
      name: string;
      value: string;
    }>;
  };
};

type GmailMessageRow = {
  user_id: string;
  gmail_message_id: string;
  gmail_thread_id: string;
  label_ids: string[];
  snippet: string | null;
  subject: string | null;
  from_email: string | null;
  to_email: string | null;
  received_at: string | null;
  payload: GmailMessage["payload"] | null;
  raw_message: GmailMessage;
};

export async function syncGmailInbox({
  accessToken,
  admin,
  userId,
}: {
  accessToken: string;
  admin: SupabaseClient;
  userId: string;
}) {
  const messageRefs = await listInboxMessageRefs(accessToken);
  const syncedMessages: GmailMessageRow[] = [];

  for (let index = 0; index < messageRefs.length; index += 10) {
    const batch = messageRefs.slice(index, index + 10);
    const messages = await Promise.all(
      batch.map((message) => fetchGmailMessage(accessToken, message.id)),
    );

    syncedMessages.push(
      ...messages.map((message) => toMessageRow(userId, message)),
    );
  }

  for (let index = 0; index < syncedMessages.length; index += 100) {
    const batch = syncedMessages.slice(index, index + 100);
    const { error } = await admin
      .from("gmail_messages")
      .upsert(batch, { onConflict: "user_id,gmail_message_id" });

    if (error) {
      throw error;
    }
  }

  return {
    syncedCount: syncedMessages.length,
  };
}

async function listInboxMessageRefs(accessToken: string) {
  const messages: GmailListResponse["messages"] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      "https://gmail.googleapis.com/gmail/v1/users/me/messages",
    );
    url.searchParams.set("labelIds", "INBOX");
    url.searchParams.set("maxResults", "500");

    if (pageToken) {
      url.searchParams.set("pageToken", pageToken);
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = (await response.json()) as GmailListResponse & {
      error?: {
        message?: string;
      };
    };

    if (!response.ok) {
      throw new Error(data.error?.message ?? "Unable to list Gmail inbox.");
    }

    messages.push(...(data.messages ?? []));
    pageToken = data.nextPageToken;
  } while (pageToken);

  return messages;
}

async function fetchGmailMessage(accessToken: string, messageId: string) {
  const url = new URL(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
  );
  url.searchParams.set("format", "full");

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const message = (await response.json()) as GmailMessage & {
    error?: {
      message?: string;
    };
  };

  if (!response.ok) {
    throw new Error(message.error?.message ?? "Unable to fetch Gmail message.");
  }

  return message;
}

function toMessageRow(userId: string, message: GmailMessage): GmailMessageRow {
  const headers = message.payload?.headers ?? [];

  return {
    user_id: userId,
    gmail_message_id: message.id,
    gmail_thread_id: message.threadId,
    label_ids: message.labelIds ?? [],
    snippet: message.snippet ?? null,
    subject: getHeader(headers, "subject"),
    from_email: getHeader(headers, "from"),
    to_email: getHeader(headers, "to"),
    received_at: message.internalDate
      ? new Date(Number(message.internalDate)).toISOString()
      : null,
    payload: message.payload ?? null,
    raw_message: message,
  };
}

function getHeader(
  headers: Array<{
    name: string;
    value: string;
  }>,
  name: string,
) {
  return (
    headers.find((header) => header.name.toLowerCase() === name)?.value ?? null
  );
}
