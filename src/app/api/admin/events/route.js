import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all events (admin only)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const db = await getDb();
    const events = await db.collection("events").find({}).sort({ createdAt: -1 }).toArray();

    const formatted = events.map((e) => ({
      ...e,
      _id: e._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET admin events error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// PUT approves or rejects event listing (admin only)
export async function PUT(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const body = await request.json();
    const { eventId, status } = body;

    if (!eventId || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json({ error: "Invalid parameters." }, { status: 400 });
    }

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(eventId);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Event ID." }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("events").updateOne(
      { _id: eventObjectId },
      {
        $set: {
          status,
          moderatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT admin moderate event error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE deletes any event listing (admin only)
export async function DELETE(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId parameter." }, { status: 400 });
    }

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(eventId);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Event ID." }, { status: 400 });
    }

    const db = await getDb();
    await db.collection("events").deleteOne({ _id: eventObjectId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE admin event error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
