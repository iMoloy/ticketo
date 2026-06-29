import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const db = await getDb();

    // 1. Get counts
    const usersCount = await db.collection("user").countDocuments({});
    const eventsCount = await db.collection("events").countDocuments({});
    const orgsCount = await db.collection("organizations").countDocuments({});

    // 2. Sum up revenue from payments collection
    const paymentRecords = await db.collection("payments").find({}).toArray();
    const totalRevenue = paymentRecords.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

    return NextResponse.json({
      usersCount,
      eventsCount,
      orgsCount,
      totalRevenue,
    });
  } catch (error) {
    console.error("GET admin stats error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
