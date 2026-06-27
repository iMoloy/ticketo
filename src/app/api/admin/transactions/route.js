import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all transactions logged (admin only)
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    const db = await getDb();
    const payments = await db.collection("payments").find({}).sort({ paidAt: -1 }).toArray();

    const formatted = payments.map((p) => ({
      ...p,
      _id: p._id.toString(),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error("GET admin transactions error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
