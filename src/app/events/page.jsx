import Link from "next/link";
import { Suspense } from "react";
import { Card } from "@heroui/react";
import FilterPanel from "@/components/FilterPanel";
import EventCard from "@/components/EventCard";

export const revalidate = 0; // Fresh fetch from backend on each request

export default async function BrowseEventsPage() {
    const events = [
        {
            _id: "1",
            title: "Global Tech Summit 2026",
            category: "Tech",
            banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
            date: "November 12, 2026",
            location: "San Francisco",
            ticketPrice: 149.00
        },
        {
            _id: "2",
            title: "Symphony Under the Stars",
            category: "Music",
            banner: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
            date: "December 05, 2026",
            location: "New York",
            ticketPrice: 45.00
        },
        {
            _id: "3",
            title: "Culinary Arts & Wine Expo",
            category: "Food",
            banner: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
            date: "January 18, 2027",
            location: "San Francisco",
            ticketPrice: 85.00
        },
        {
            _id: "4",
            title: "Art & Motion Showcase",
            category: "Arts",
            banner: "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
            date: "February 22, 2027",
            location: "Online",
            ticketPrice: 0
        }
    ];
    return (
        <div className="min-h-screen py-16 px-6 max-w-7xl mx-auto w-full space-y-12 bg-[#080c16]">
            {/* HEADER */}
            <div className="text-center md:text-left space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tight text-white">Browse Premium Events</h1>
                <p className="text-slate-400 text-sm max-w-xl">
                    Search, filter, and discover state-of-the-art events. Instant Stripe booking guarantees your seat.
                </p>
            </div>

            {/* Interactive client-side filters wrapped in Suspense */}
            <Suspense fallback={<div className="h-28 w-full glass animate-pulse rounded-2xl" />}>
                <FilterPanel />
            </Suspense>

            {/* Server component events list wrapped in Suspense */}
            <Suspense fallback={
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Array(6).fill(0).map((_, i) => (
                        <Card key={i} className="bg-slate-900/50 border border-white/5 p-4 space-y-4 animate-pulse">
                            <div className="h-48 rounded-xl bg-slate-800" />
                            <div className="space-y-3">
                                <div className="h-4 bg-slate-800 w-3/5 rounded-lg" />
                                <div className="h-6 bg-slate-800 w-4/5 rounded-lg" />
                                <div className="h-4 bg-slate-800 w-2/5 rounded-lg" />
                            </div>
                        </Card>
                    ))}
                </div>
            }>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} buttonText="View Details" />
                    ))}
                </div>
            </Suspense>
        </div>
    );
}
