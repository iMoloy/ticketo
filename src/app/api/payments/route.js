import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
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
      query = { userEmail: user.email };
    } else if (user.role === "admin") {
      query = {}; // Admins see all logs
    } else {
      // Organizers don't see personal payment list (they use bookings list for revenue)
      query = { userEmail: user.email };
    }

    const payments = await db
      .collection("payments")
      .find(query)
      .sort({ paidAt: -1 })
      .toArray();

    const formatted = payments.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET payments error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
