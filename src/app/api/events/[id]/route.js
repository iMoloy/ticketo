import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET single event details with organizer organization joined
export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
    }

    const db = await getDb();
    const event = await db.collection("events").findOne({ _id: eventObjectId });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Join organization details
    const organization = await db.collection("organizations").findOne({ userEmail: event.organizerEmail });

    return NextResponse.json({
      ...event,
      _id: event._id.toString(),
      organization: organization || null,
    });
  } catch (error) {
    console.error("GET event detail error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// PUT updates event parameters (resets status to pending, asserts ownership)
export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized. Organizer role required." }, { status: 401 });
    }

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
    }

    const db = await getDb();
    const event = await db.collection("events").findOne({ _id: eventObjectId });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Verify ownership
    if (event.organizerEmail !== session.user.email) {
      return NextResponse.json({ error: "Access Denied. You do not own this listing." }, { status: 403 });
    }

    const body = await request.json();
    const { title, banner, category, location, date, ticketPrice, availableSeats, description } = body;

    if (!title || !banner || !category || !location || !date || ticketPrice === undefined || !availableSeats || !description) {
      return NextResponse.json({ error: "All parameters are required." }, { status: 400 });
    }

    await db.collection("events").updateOne(
      { _id: eventObjectId },
      {
        $set: {
          title,
          banner,
          category,
          location,
          date: new Date(date),
          ticketPrice: parseFloat(ticketPrice) || 0,
          availableSeats: parseInt(availableSeats) || 0,
          description,
          status: "pending", // Reset status back to pending approval when updated
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT event error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE destroys event listing (asserts ownership)
export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized. Organizer role required." }, { status: 401 });
    }

    let eventObjectId;
    try {
      eventObjectId = new ObjectId(id);
    } catch (e) {
      return NextResponse.json({ error: "Invalid Event ID" }, { status: 400 });
    }

    const db = await getDb();
    const event = await db.collection("events").findOne({ _id: eventObjectId });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Verify ownership
    if (event.organizerEmail !== session.user.email) {
      return NextResponse.json({ error: "Access Denied. You do not own this listing." }, { status: 403 });
    }

    await db.collection("events").deleteOne({ _id: eventObjectId });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE event error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
