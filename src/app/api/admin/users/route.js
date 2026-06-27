import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all users (admin only)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const db = await getDb();
    const users = await db.collection("user").find({}).toArray();

    const formatted = users.map((u) => ({
      ...u,
      _id: u._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET admin users error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// PUT block/unblock a user (admin only)
export async function PUT(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const { userId, isBlocked } = body;

    if (!userId || isBlocked === undefined) {
      return NextResponse.json({ error: "Missing userId or isBlocked parameters." }, { status: 400 });
    }

    const db = await getDb();

    // Prevent blocking oneself
    if (userId === session.user.id) {
      return NextResponse.json({ error: "Self-blocking is prohibited." }, { status: 400 });
    }

    await db.collection("user").updateOne(
      { id: userId }, // BetterAuth stores user IDs under "id" instead of "_id" in some adapters, but MongoDB stores as id
      {
        $set: {
          isBlocked: !!isBlocked,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT admin block user error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
