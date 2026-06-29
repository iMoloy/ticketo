import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { user } = session;
    const body = await request.json();
    const { name, image, bio } = body;

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const db = await getDb();

    // Update the user document in the BetterAuth 'user' collection
    await db.collection("user").updateOne(
      { email: user.email },
      {
        $set: {
          name,
          image: image || "",
          bio: bio || "",
          updatedAt: new Date(),
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST update-profile error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
