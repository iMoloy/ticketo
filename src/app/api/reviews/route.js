import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

// GET all reviews for an event
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required" }, { status: 400 });
    }

    const db = await getDb();
    const reviews = await db
      .collection("reviews")
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = reviews.map((r) => ({ ...r, _id: r._id.toString() }));

    // Calculate average rating
    const avgRating =
      reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return NextResponse.json({ reviews: serialized, avgRating, totalReviews: reviews.length });
  } catch (error) {
    console.error("GET reviews error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST a new review (attendee must have a confirmed booking)
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Login required to submit a review." }, { status: 401 });
    }

    const { eventId, rating, comment } = await request.json();

    if (!eventId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Valid eventId and rating (1-5) are required." }, { status: 400 });
    }

    const db = await getDb();

    // Verify user has a confirmed booking for this event
    const booking = await db.collection("bookings").findOne({
      eventId,
      userEmail: session.user.email,
      paymentStatus: "paid",
    });

    if (!booking) {
      return NextResponse.json(
        { error: "You can only review events you have attended." },
        { status: 403 }
      );
    }

    // Prevent duplicate reviews
    const existing = await db.collection("reviews").findOne({
      eventId,
      userEmail: session.user.email,
    });

    if (existing) {
      return NextResponse.json(
        { error: "You have already submitted a review for this event." },
        { status: 409 }
      );
    }

    const newReview = {
      eventId,
      userEmail: session.user.email,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      rating: parseInt(rating),
      comment: comment?.trim() || "",
      createdAt: new Date(),
    };

    const result = await db.collection("reviews").insertOne(newReview);

    return NextResponse.json({
      success: true,
      review: { ...newReview, _id: result.insertedId.toString() },
    });
  } catch (error) {
    console.error("POST review error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
