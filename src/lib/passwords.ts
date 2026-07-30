import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

// ---------------------------------------------------------------------------
// Password hashing (server-only — uses node:crypto, never imported by the edge
// middleware). scrypt with a per-password random salt; stored as "salt:hash".
// A real app might reach for argon2/bcrypt, but scrypt ships with Node and is
// perfectly fine for this demo.
// ---------------------------------------------------------------------------
const KEYLEN = 64;

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = scryptSync(password, salt, KEYLEN);
  // Constant-time compare (both are KEYLEN bytes, so lengths match).
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
