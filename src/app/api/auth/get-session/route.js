import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session && session.user) {
      try {
        const db = await getDb();
        const fullUser = await db.collection("user").findOne({ email: session.user.email });
        if (fullUser && fullUser.bio) {
          session.user.bio = fullUser.bio;
        }
      } catch (dbErr) {
        console.warn("Failed to fetch bio in get-session:", dbErr);
      }
    }

    return NextResponse.json(session || null);
  } catch (error) {
    console.error("Failed to get session:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
