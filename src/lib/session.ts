// ---------------------------------------------------------------------------
// Session token: a signed, tamper-proof cookie value carrying { uid, role }.
// Uses Web Crypto (crypto.subtle) so the SAME code verifies in the edge
// middleware and in Node server actions. The signing secret is SESSION_SECRET,
// falling back to ADMIN_PASSCODE (already configured in prod) so there's no
// extra env var to set for the demo.
// ---------------------------------------------------------------------------

export const SESSION_COOKIE = "tb_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export type SessionPayload = { uid: number; role: "user" | "admin" };

function secret(): string {
  return (
    process.env.SESSION_SECRET ||
    process.env.ADMIN_PASSCODE ||
    "dev-only-insecure-secret"
  );
}

function toB64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function sign(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return toB64Url(new Uint8Array(sig));
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const body = toB64Url(new TextEncoder().encode(JSON.stringify(payload)));
  return `${body}.${await sign(body)}`;
}

// Returns the payload only if the signature checks out, else null.
export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if ((await sign(body)) !== sig) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(fromB64Url(body)));
    if (
      typeof payload?.uid === "number" &&
      (payload.role === "user" || payload.role === "admin")
    ) {
      return payload as SessionPayload;
    }
    return null;
  } catch {
    return null;
  }
}
