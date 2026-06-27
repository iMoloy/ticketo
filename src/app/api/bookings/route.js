import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const db = await getDb();
    let query = {};

    if (user.role === "attendee") {
      query = { attendeeEmail: user.email };
    } else if (user.role === "organizer") {
      // Find events hosted by this organizer
      const events = await db
        .collection("events")
        .find({ organizerEmail: user.email })
        .toArray();
      const eventIds = events.map((e) => e._id.toString());
      query = { eventId: { $in: eventIds } };
    } else if (user.role === "admin") {
      // Admins see all bookings
      query = {};
    } else {
      return NextResponse.json({ error: "Invalid role access." }, { status: 403 });
    }

    const rawBookings = await db
      .collection("bookings")
      .find(query)
      .sort({ bookingDate: -1 })
      .toArray();

    // Join eventDate and attendeeName in results
    const bookings = [];
    for (const b of rawBookings) {
      let eventDate = "";
      try {
        const ev = await db.collection("events").findOne({ _id: new ObjectId(b.eventId) });
        if (ev) {
          eventDate = ev.date;
        }
      } catch (err) {}

      let attendeeName = "Attendee";
      try {
        const usr = await db.collection("user").findOne({ email: b.attendeeEmail });
        if (usr) {
          attendeeName = usr.name || "Attendee";
        }
      } catch (err) {}

      bookings.push({
        ...b,
        _id: b._id.toString(),
        eventDate,
        attendeeName,
      });
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("GET bookings error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
