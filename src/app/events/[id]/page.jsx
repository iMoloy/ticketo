import Link from "next/link";
import { Card, Button } from "@heroui/react";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaArrowLeft, FaStar } from "react-icons/fa";
import BookingWidget from "@/components/BookingWidget";
import ReviewSection from "@/components/ReviewSection";
import ShareButton from "@/components/ShareButton";
import CommentsSection from "@/components/CommentsSection";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";
import EventNotFound from "@/components/EventNotFound";

export default async function EventDetailsPage({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const db = await getDb();
    let eventDoc = null;
    try {
        eventDoc = await db.collection("events").findOne({ _id: new ObjectId(id) });
    } catch (e) {
        // Invalid ObjectId gracefully handled
    }

    // Fetch review stats for this event
    const reviews = await db.collection("reviews").find({ eventId: id }).toArray();
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
        : null;

    if (!eventDoc) {
        return <EventNotFound />;
    }

    let organization = null;
    if (eventDoc.organizationId) {
        try {
            organization = await db.collection("organizations").findOne({ _id: new ObjectId(eventDoc.organizationId) });
        } catch (e) {}
    }
    if (!organization && eventDoc.organizerEmail) {
        organization = await db.collection("organizations").findOne({ organizerEmail: eventDoc.organizerEmail });
    }

    const event = {
        ...eventDoc,
        _id: eventDoc._id.toString(),
        date: eventDoc.date instanceof Date 
            ? eventDoc.date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
            : new Date(eventDoc.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        organization: organization ? {
            ...organization,
            _id: organization._id.toString()
        } : {
            organizationName: "Featured Sponsor",
            logo: "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1",
            description: "A community organizer supporting Ticketo platform events.",
            website: "ticketo.com"
        }
    };


    return (
        <div className="min-h-screen py-16 px-6 max-w-6xl mx-auto w-full space-y-12 bg-[#080c16]">
            {/* Back Button */}
            <Link href="/events">
                <Button
                    variant="light"
                    className="text-slate-400 hover:text-white"
                    startContent={<FaArrowLeft />}
                >
                    Back to Browse
                </Button>
            </Link>

            {/* Banner */}
            <div className="relative h-[300px] md:h-[450px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/5">
                <Image
                    src={event.banner}
                    alt={event.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-1" />

                <span className="absolute top-6 left-6 bg-pink-500 text-white font-extrabold text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-pink-400/20 shadow-lg z-10">
                    {event.category}
                </span>

                {avgRating && (
                    <span className="absolute top-6 right-6 flex items-center gap-1.5 bg-black/60 backdrop-blur text-yellow-400 font-bold text-sm px-3 py-2 rounded-full border border-yellow-400/20 shadow-lg z-10">
                        <FaStar />
                        {avgRating}
                        <span className="text-white/60 font-normal text-xs">({totalReviews})</span>
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Details & Description */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl flex-1">
                                {event.title}
                            </h1>
                            <ShareButton title={event.title} eventId={event._id} />
                        </div>

                        <div className="flex flex-wrap gap-6 text-sm text-slate-300">
                            <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-pink-500" />
                                <span>
                                    {event.date}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaMapMarkerAlt className="text-pink-500" />
                                <span>
                                    {event.location}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Event Description</h2>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                            {event.description || "No description provided for this event. Reach out to the organization for more details."}
                        </p>
                    </div>

                    {/* Organizer Info */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Organizer Profile</h2>
                        <Card className="glass p-6 border-white/5" radius="lg">
                            <div className="p-0 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <Image
                                    src={event.organization?.logo && (event.organization.logo.startsWith("http") || event.organization.logo.startsWith("/")) ? event.organization.logo : "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1"}
                                    width={80}
                                    height={80}
                                    className="rounded-full border-2 border-indigo-500 object-cover shrink-0 h-20 w-20"
                                    alt="logo"
                                />
                                <div className="space-y-2 text-center sm:text-left">
                                    <h3 className="text-xl font-bold text-white">
                                        {event.organization?.organizationName || "Featured Organization"}
                                    </h3>
                                    <p className="text-slate-400 text-xs leading-relaxed max-w-lg">
                                        {event.organization?.description || "Curator of leading corporate panel discussions, tech events, and community music festivals."}
                                    </p>
                                    {event.organization?.website && (
                                        <a
                                            href={event.organization.website.startsWith("http") ? event.organization.website : `https://${event.organization.website}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-block text-indigo-400 hover:text-indigo-300 text-sm font-semibold hover:underline"
                                        >
                                            Visit Official Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Reviews Section */}
                    <ReviewSection eventId={event._id} />

                    {/* Comments / Q&A Section */}
                    <CommentsSection eventId={event._id} />
                </div>

                {/* Right Column: Ticket Booking Widget */}
                <div className="space-y-6">
                    <BookingWidget eventId={event._id} ticketPrice={event.ticketPrice} availableSeats={event.availableSeats} />
                </div>
            </div>
        </div>
    );
}
