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

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    if (user.isBlocked) {
      return NextResponse.json({ error: "Your account is blocked." }, { status: 403 });
    }

    const body = await request.json();
    const { type } = body;

    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const db = await getDb();

    if (type === "booking") {
      const { eventId, quantity } = body;
      if (!eventId || !quantity || quantity <= 0) {
        return NextResponse.json({ error: "Event ID and valid quantity are required." }, { status: 400 });
      }

      // Check event
      const event = await db.collection("events").findOne({ _id: new ObjectId(eventId) });
      if (!event) {
        return NextResponse.json({ error: "Event not found." }, { status: 404 });
      }

      if (event.status !== "approved") {
        return NextResponse.json({ error: "This event is not active or approved." }, { status: 400 });
      }

      if (event.availableSeats < quantity) {
        return NextResponse.json({ error: `Only ${event.availableSeats} seats available.` }, { status: 400 });
      }

      const totalAmount = event.ticketPrice * quantity;

      // Check if Stripe is configured
      if (stripe) {
        // Stripe checkout session
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: event.title,
                  description: `Ticket booking for ${event.title}`,
                  images: event.banner ? [event.banner] : [],
                },
                unit_amount: Math.round(event.ticketPrice * 100), // in cents
              },
              quantity: quantity,
            },
          ],
          mode: "payment",
          metadata: {
            type: "booking",
            eventId: eventId,
            quantity: quantity.toString(),
            userId: user.id,
            userEmail: user.email,
            eventTitle: event.title,
            amount: totalAmount.toString(),
          },
          success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/events/${eventId}`,
        });

        return NextResponse.json({ url: stripeSession.url });
      } else {
        // Simulated checkout flow
        const mockSessionId = `mock_booking_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        
        await db.collection("simulated_sessions").insertOne({
          sessionId: mockSessionId,
          type: "booking",
          eventId: eventId,
          eventTitle: event.title,
          quantity: quantity,
          amount: totalAmount,
          userId: user.id,
          userEmail: user.email,
          status: "pending",
          createdAt: new Date(),
        });

        return NextResponse.json({ url: `${origin}/simulated-payment?session_id=${mockSessionId}` });
      }

    } else if (type === "upgrade") {
      const upgradePrice = 49.00;

      // Verify if user is organizer
      if (user.role !== "organizer") {
        return NextResponse.json({ error: "Only organizers can upgrade to Premium." }, { status: 403 });
      }

      if (user.isPremium) {
        return NextResponse.json({ error: "You are already a Premium organizer." }, { status: 400 });
      }

      // Check if Stripe is configured
      if (stripe) {
        const stripeSession = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "Ticketo Organizer Premium Upgrade",
                  description: "Unlock unlimited event hosting and advanced organization tools.",
                },
                unit_amount: Math.round(upgradePrice * 100), // in cents
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: {
            type: "upgrade",
            userId: user.id,
            userEmail: user.email,
            amount: upgradePrice.toString(),
          },
          success_url: `${origin}/premium-success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/dashboard/organizer`,
        });

        return NextResponse.json({ url: stripeSession.url });
      } else {
        // Simulated checkout flow
        const mockSessionId = `mock_upgrade_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

        await db.collection("simulated_sessions").insertOne({
          sessionId: mockSessionId,
          type: "upgrade",
          amount: upgradePrice,
          userId: user.id,
          userEmail: user.email,
          status: "pending",
          createdAt: new Date(),
        });

        return NextResponse.json({ url: `${origin}/simulated-payment?session_id=${mockSessionId}` });
      }
    } else {
      return NextResponse.json({ error: "Invalid payment type." }, { status: 400 });
    }
  } catch (error) {
    console.error("POST checkout-session error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
