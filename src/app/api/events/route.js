import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET list of events (public listings with filters OR organizer's own listings)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const location = searchParams.get("location") || "";
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 6;
    const skip = (page - 1) * limit;

    // Support comma-separated multi-value filters using $in
    const categories = category ? category.split(",").map((c) => c.trim()).filter(Boolean) : [];
    const locations = location ? location.split(",").map((l) => l.trim()).filter(Boolean) : [];

    const own = searchParams.get("own") === "true";

    const db = await getDb();

    // 1. Organizer requesting their own events
    if (own) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session || !session.user || session.user.role !== "organizer") {
        return NextResponse.json({ error: "Unauthorized. Organizer role required." }, { status: 401 });
      }

      const events = await db
        .collection("events")
        .find({ organizerEmail: session.user.email })
        .sort({ date: -1 })
        .toArray();

      return NextResponse.json({ events });
    }

    // 2. Public Browse Request (approved events only)
    const query = { status: "approved" };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    // Use $in for multiple categories, $regex for single
    if (categories.length > 1) {
      query.category = { $in: categories };
    } else if (categories.length === 1) {
      query.category = { $regex: new RegExp(`^${categories[0]}$`, "i") };
    }
    // Use $in for multiple locations, $regex for single
    if (locations.length > 1) {
      query.location = { $in: locations };
    } else if (locations.length === 1) {
      query.location = { $regex: new RegExp(`^${locations[0]}$`, "i") };
    }

    const totalCount = await db.collection("events").countDocuments(query);
    const rawEvents = await db
      .collection("events")
      .find(query)
      .sort({ date: 1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const events = rawEvents.map((doc) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return NextResponse.json({
      events,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET events error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST creates a new event listing
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized. Organizer role required." }, { status: 401 });
    }

    const db = await getDb();

    // 1. Verify organization exists first
    const org = await db.collection("organizations").findOne({ userId: session.user.id });
    if (!org) {
      return NextResponse.json(
        { error: "Please setup your organization profile first before hosting events." },
        { status: 403 }
      );
    }

    // 2. Enforce free organizer event limit (max 3)
    const isPremium = !!session.user.isPremium;
    if (!isPremium) {
      const hostedCount = await db.collection("events").countDocuments({ organizerEmail: session.user.email });
      if (hostedCount >= 3) {
        return NextResponse.json(
          { error: "Free organizers are limited to 3 events. Upgrade to Premium for unlimited hosting." },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { title, banner, category, location, date, ticketPrice, availableSeats, description } = body;

    if (!title || !banner || !category || !location || !date || ticketPrice === undefined || !availableSeats || !description) {
      return NextResponse.json({ error: "All event parameters are required." }, { status: 400 });
    }

    const newEvent = {
      title,
      banner,
      category,
      location,
      date: new Date(date),
      ticketPrice: parseFloat(ticketPrice) || 0,
      availableSeats: parseInt(availableSeats) || 0,
      description,
      status: "pending", // Reset new events to pending moderation
      organizerEmail: session.user.email,
      createdAt: new Date(),
    };

    const result = await db.collection("events").insertOne(newEvent);

    return NextResponse.json({
      success: true,
      eventId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("POST event error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
