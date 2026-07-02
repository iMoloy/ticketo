import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// GET all comments for an event
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get("eventId");

    if (!eventId) {
      return NextResponse.json({ error: "eventId is required." }, { status: 400 });
    }

    const db = await getDb();
    const comments = await db
      .collection("comments")
      .find({ eventId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      comments.map((c) => ({ ...c, _id: c._id.toString() }))
    );
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// POST a new comment (any logged-in user)
export async function POST(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Login required to comment." }, { status: 401 });
    }

    const { eventId, text } = await request.json();

    if (!eventId || !text?.trim()) {
      return NextResponse.json({ error: "eventId and comment text are required." }, { status: 400 });
    }

    if (text.trim().length > 600) {
      return NextResponse.json({ error: "Comment must be under 600 characters." }, { status: 400 });
    }

    const db = await getDb();

    const newComment = {
      eventId,
      userEmail: session.user.email,
      userName: session.user.name || "Anonymous",
      userImage: session.user.image || null,
      userRole: session.user.role || "attendee",
      text: text.trim(),
      createdAt: new Date(),
    };

    const result = await db.collection("comments").insertOne(newComment);

    return NextResponse.json({
      success: true,
      comment: { ...newComment, _id: result.insertedId.toString() },
    });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

// DELETE a comment (own comment only)
export async function DELETE(request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { commentId } = await request.json();
    if (!commentId) {
      return NextResponse.json({ error: "commentId is required." }, { status: 400 });
    }

    const { ObjectId } = await import("mongodb");
    const db = await getDb();

    const comment = await db.collection("comments").findOne({ _id: new ObjectId(commentId) });
    if (!comment) {
      return NextResponse.json({ error: "Comment not found." }, { status: 404 });
    }

    // Only owner or admin can delete
    if (comment.userEmail !== session.user.email && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized to delete this comment." }, { status: 403 });
    }

    await db.collection("comments").deleteOne({ _id: new ObjectId(commentId) });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
