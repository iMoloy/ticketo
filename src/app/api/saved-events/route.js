import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET — fetch all saved events for the logged-in user
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const db = await getDb();
    const saved = await db
      .collection("savedEvents")
      .find({ userEmail: session.user.email })
      .sort({ savedAt: -1 })
      .toArray();

    return NextResponse.json(saved.map((s) => ({ ...s, _id: s._id.toString() })));
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST — toggle save/unsave an event
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Login required." }, { status: 401 });
    }

    const { eventId, eventTitle, eventBanner, eventCategory, eventDate, eventLocation, ticketPrice } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required." }, { status: 400 });
    }

    const db = await getDb();
    const existing = await db.collection("savedEvents").findOne({
      userEmail: session.user.email,
      eventId,
    });

    if (existing) {
      // Already saved → unsave it
      await db.collection("savedEvents").deleteOne({ _id: existing._id });
      return NextResponse.json({ saved: false, message: "Event removed from wishlist." });
    } else {
      // Not saved → save it
      await db.collection("savedEvents").insertOne({
        userEmail: session.user.email,
        eventId,
        eventTitle,
        eventBanner,
        eventCategory,
        eventDate,
        eventLocation,
        ticketPrice,
        savedAt: new Date(),
      });
      return NextResponse.json({ saved: true, message: "Event saved to wishlist!" });
    }
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
