import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "massar_admin";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const SESSION_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

function sign(payload: string): string {
  return crypto.createHmac("sha256", ADMIN_PASSWORD).update(payload).digest("hex");
}

export function createToken(): string {
  const exp = Date.now() + SESSION_TTL;
  const payload = `admin.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [role, expStr, sig] = parts;
  if (role !== "admin") return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;
  const expected = sign(`${role}.${expStr}`);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function checkPassword(password: string): boolean {
  const a = Buffer.from(password, "utf8");
  const b = Buffer.from(ADMIN_PASSWORD, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}
