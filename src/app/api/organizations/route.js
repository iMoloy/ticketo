import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET current user's organization profile
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const org = await db.collection("organizations").findOne({ userId: session.user.id });

    return NextResponse.json(org || null);
  } catch (error) {
    console.error("Failed to get organization:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST/PUT creates or updates organization profile
export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "organizer") {
      return NextResponse.json({ error: "Unauthorized. Organizer role required." }, { status: 401 });
    }

    const body = await request.json();
    const { organizationName, logo, website, description } = body;

    if (!organizationName || !logo || !website || !description) {
      return NextResponse.json({ error: "All profile fields are required." }, { status: 400 });
    }

    const db = await getDb();

    // Check if profile exists, update it, else create it
    const existing = await db.collection("organizations").findOne({ userId: session.user.id });

    if (existing) {
      await db.collection("organizations").updateOne(
        { userId: session.user.id },
        {
          $set: {
            organizationName,
            logo,
            website,
            description,
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await db.collection("organizations").insertOne({
        userId: session.user.id,
        userEmail: session.user.email,
        organizationName,
        logo,
        website,
        description,
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save organization:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
