import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const algorithm = "aes-256-gcm";

export function encryptSecret(value: string) {
  const key = getEncryptionKey();
  const iv = randomBytes(12);
  const cipher = createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([
    cipher.update(value, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64url"),
    authTag.toString("base64url"),
    encrypted.toString("base64url"),
  ].join(".");
}

export function decryptSecret(value: string) {
  const key = getEncryptionKey();
  const [iv, authTag, encrypted] = value.split(".");

  if (!iv || !authTag || !encrypted) {
    throw new Error("Invalid encrypted secret format.");
  }

  const decipher = createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function getEncryptionKey() {
  const key = process.env.GMAIL_TOKEN_ENCRYPTION_KEY;

  if (!key) {
    throw new Error("Missing GMAIL_TOKEN_ENCRYPTION_KEY.");
  }

  const decoded = Buffer.from(key, "base64url");

  if (decoded.length !== 32) {
    throw new Error("GMAIL_TOKEN_ENCRYPTION_KEY must be 32 base64url bytes.");
  }

  return decoded;
}
