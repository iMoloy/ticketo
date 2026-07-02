import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const db = await getDb();
    const organizerEmail = session.user.email;

    // 1. Get all events by this organizer
    const events = await db
      .collection("events")
      .find({ organizerEmail })
      .toArray();

    const eventIds = events.map((e) => e._id.toString());
    const eventMap = Object.fromEntries(
      events.map((e) => [e._id.toString(), e.title])
    );

    // 2. Get all paid bookings for these events
    const bookings = await db
      .collection("bookings")
      .find({ eventId: { $in: eventIds }, paymentStatus: "paid" })
      .toArray();

    // 3. Revenue per event (for bar chart)
    const revenueByEvent = eventIds.map((id) => {
      const eventBookings = bookings.filter((b) => b.eventId === id);
      const revenue = eventBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
      const tickets = eventBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
      return {
        name: (eventMap[id] || "Unknown").slice(0, 20),
        revenue: parseFloat(revenue.toFixed(2)),
        tickets,
      };
    });

    // 4. Revenue over time (last 7 months, for line chart)
    const now = new Date();
    const monthlyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
      const label = d.toLocaleString("en-US", { month: "short", year: "2-digit" });

      const monthBookings = bookings.filter((b) => {
        const bd = new Date(b.bookingDate || b.createdAt);
        return bd >= d && bd < next;
      });

      const revenue = monthBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
      const tickets = monthBookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
      monthlyData.push({ label, revenue: parseFloat(revenue.toFixed(2)), tickets });
    }

    // 5. Summary stats
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalTickets = bookings.reduce((sum, b) => sum + (b.quantity || 1), 0);
    const totalEvents = events.length;
    const approvedEvents = events.filter((e) => e.status === "approved").length;

    return NextResponse.json({
      revenueByEvent,
      monthlyData,
      stats: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalTickets,
        totalEvents,
        approvedEvents,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
