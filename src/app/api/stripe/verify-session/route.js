import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

// Helper to fulfill a booking in the database
async function fulfillBooking(db, { eventId, quantity, userId, userEmail, eventTitle, amount, transactionId }) {
  // Check if booking already exists for this transaction ID
  const existingBooking = await db.collection("bookings").findOne({ transactionId });
  if (existingBooking) {
    return existingBooking;
  }

  // Decrement seats on the event
  const updateResult = await db.collection("events").updateOne(
    { _id: new ObjectId(eventId), availableSeats: { $gte: quantity } },
    { $inc: { availableSeats: -quantity } }
  );

  if (updateResult.modifiedCount === 0) {
    throw new Error("No available seats left for this quantity.");
  }

  // Create booking
  const bookingRecord = {
    eventId,
    eventTitle,
    attendeeEmail: userEmail,
    quantity,
    amount,
    bookingDate: new Date(),
    transactionId,
  };
  const bookingResult = await db.collection("bookings").insertOne(bookingRecord);

  // Create payment record
  const paymentRecord = {
    bookingId: bookingResult.insertedId.toString(),
    userEmail,
    amount,
    paidAt: new Date(),
    transactionId,
    type: "booking",
    eventId,
    eventTitle,
    quantity,
  };
  await db.collection("payments").insertOne(paymentRecord);

  return {
    ...bookingRecord,
    _id: bookingResult.insertedId.toString(),
  };
}

// Helper to fulfill a premium upgrade in the database
async function fulfillUpgrade(db, { userId, userEmail, amount, transactionId }) {
  // Check if payment already exists for this transaction ID
  const existingPayment = await db.collection("payments").findOne({ transactionId });
  if (existingPayment) {
    return { success: true, alreadyUpgraded: true };
  }

  // Update user profile to premium
  const updateResult = await db.collection("user").updateOne(
    { email: userEmail },
    { $set: { isPremium: true } }
  );

  if (updateResult.modifiedCount === 0) {
    // If not found by email, try by ID
    await db.collection("user").updateOne(
      { _id: userId },
      { $set: { isPremium: true } }
    );
  }

  // Create payment record
  const paymentRecord = {
    userEmail,
    amount,
    paidAt: new Date(),
    transactionId,
    type: "upgrade",
  };
  await db.collection("payments").insertOne(paymentRecord);

  return { success: true };
}

// GET handler to check session status and return details
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    const db = await getDb();

    // 1. Handle Simulated Sessions
    if (sessionId.startsWith("mock_")) {
      const simSession = await db.collection("simulated_sessions").findOne({ sessionId });
      if (!simSession) {
        return NextResponse.json({ error: "Simulated session not found." }, { status: 404 });
      }

      if (simSession.status === "completed") {
        if (simSession.type === "booking") {
          return NextResponse.json({
            success: true,
            type: "booking",
            booking: {
              eventTitle: simSession.eventTitle,
              attendeeEmail: simSession.userEmail,
              quantity: simSession.quantity,
              amount: simSession.amount,
              transactionId: simSession.sessionId,
            },
          });
        } else {
          return NextResponse.json({
            success: true,
            type: "upgrade",
            amount: simSession.amount,
            userEmail: simSession.userEmail,
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          status: "pending",
          message: "Payment simulation is pending execution.",
          sessionDetails: {
            type: simSession.type,
            eventTitle: simSession.eventTitle || "Premium Upgrade",
            amount: simSession.amount,
            quantity: simSession.quantity || 1,
            userEmail: simSession.userEmail,
          }
        });
      }
    }

    // 2. Handle Real Stripe Sessions
    if (!stripe) {
      return NextResponse.json({ error: "Stripe configuration is missing." }, { status: 500 });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);
    if (!stripeSession) {
      return NextResponse.json({ error: "Stripe session not found." }, { status: 404 });
    }

    if (stripeSession.payment_status === "paid") {
      const meta = stripeSession.metadata;
      const amount = parseFloat(meta.amount) || stripeSession.amount_total / 100;

      if (meta.type === "booking") {
        const booking = await fulfillBooking(db, {
          eventId: meta.eventId,
          quantity: parseInt(meta.quantity),
          userId: meta.userId,
          userEmail: meta.userEmail,
          eventTitle: meta.eventTitle,
          amount,
          transactionId: sessionId,
        });

        return NextResponse.json({
          success: true,
          type: "booking",
          booking: {
            eventTitle: booking.eventTitle,
            attendeeEmail: booking.attendeeEmail,
            quantity: booking.quantity,
            amount: booking.amount,
            transactionId: sessionId,
          },
        });
      } else if (meta.type === "upgrade") {
        await fulfillUpgrade(db, {
          userId: meta.userId,
          userEmail: meta.userEmail,
          amount,
          transactionId: sessionId,
        });

        return NextResponse.json({
          success: true,
          type: "upgrade",
          amount,
          userEmail: meta.userEmail,
        });
      }
    }

    return NextResponse.json({ error: "Session has not been paid." }, { status: 400 });
  } catch (error) {
    console.error("GET verify-session error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}

// POST handler to complete simulated payments
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, action } = body;

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required." }, { status: 400 });
    }

    const db = await getDb();

    // Only allow simulated session completion through this POST API
    if (!sessionId.startsWith("mock_")) {
      return NextResponse.json({ error: "Stripe transactions must be paid directly on Stripe's website." }, { status: 400 });
    }

    const simSession = await db.collection("simulated_sessions").findOne({ sessionId });
    if (!simSession) {
      return NextResponse.json({ error: "Simulated session not found." }, { status: 404 });
    }

    if (action === "complete") {
      if (simSession.status === "completed") {
        return NextResponse.json({
          success: true,
          message: "Session is already completed.",
          redirectUrl: simSession.type === "booking"
            ? `/payment-success?session_id=${sessionId}`
            : `/premium-success?session_id=${sessionId}`,
        });
      }

      // Process completion
      if (simSession.type === "booking") {
        await fulfillBooking(db, {
          eventId: simSession.eventId,
          quantity: simSession.quantity,
          userId: simSession.userId,
          userEmail: simSession.userEmail,
          eventTitle: simSession.eventTitle,
          amount: simSession.amount,
          transactionId: sessionId,
        });
      } else if (simSession.type === "upgrade") {
        await fulfillUpgrade(db, {
          userId: simSession.userId,
          userEmail: simSession.userEmail,
          amount: simSession.amount,
          transactionId: sessionId,
        });
      }

      // Mark simulated session as completed
      await db.collection("simulated_sessions").updateOne(
        { sessionId },
        { $set: { status: "completed", completedAt: new Date() } }
      );

      return NextResponse.json({
        success: true,
        message: "Simulated payment processed successfully.",
        redirectUrl: simSession.type === "booking"
          ? `/payment-success?session_id=${sessionId}`
          : `/premium-success?session_id=${sessionId}`,
      });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("POST verify-session error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
