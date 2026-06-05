"use client";

import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import EventCard from "./EventCard";

const MOCK_EVENTS = [
  {
    _id: "1",
    title: "Global Tech Summit 2026",
    category: "Technology",
    banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    date: "November 12, 2026",
    location: "San Francisco, CA",
    ticketPrice: 149.00
  },
  {
    _id: "2",
    title: "Symphony Under the Stars",
    category: "Music",
    banner: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6",
    date: "December 05, 2026",
    location: "Central Park, NY",
    ticketPrice: 45.00
  },
  {
    _id: "3",
    title: "Culinary Arts & Wine Expo",
    category: "Food & Drink",
    banner: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3",
    date: "January 18, 2027",
    location: "Napa Valley, CA",
    ticketPrice: 85.00
  }
];

export default function FeaturedEvents({ featuredEvents = MOCK_EVENTS }) {
  const events = featuredEvents && featuredEvents.length > 0 ? featuredEvents : MOCK_EVENTS;
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">Featured Events</h2>
          <p className="text-slate-400 text-sm mt-2">Explore the hottest and most popular events happening this week.</p>
        </div>
        <Link href="/events" className="text-pink-500 hover:text-pink-400 font-semibold p-0 flex items-center gap-2 transition-colors">
          View All Events <FaChevronRight size={12} />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div key={event._id}>
            <EventCard event={event} buttonText="Book Ticket" />
          </div>
        ))}
      </div>
    </section>
  );
}
