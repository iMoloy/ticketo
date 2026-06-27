import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    return NextResponse.json(session || null);
  } catch (error) {
    console.error("Failed to get session:", error);
    return NextResponse.json(null, { status: 500 });
  }
}
