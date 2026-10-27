import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE, checkPassword, createToken } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    if (!body.password || !checkPassword(body.password)) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const store = await cookies();
    store.set(ADMIN_COOKIE, createToken(), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
