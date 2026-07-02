"use client";

import { useState, useEffect } from "react";
import { Card, Spinner, Button } from "@heroui/react";
import { FaHeart, FaCalendarAlt, FaMapMarkerAlt, FaTrash } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";

export default function WishlistPage() {
    const [savedEvents, setSavedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSaved = async () => {
        try {
            const res = await fetch("/api/saved-events");
            if (res.ok) {
                const data = await res.json();
                setSavedEvents(data);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    }, []);

    const handleUnsave = async (eventId) => {
        try {
            const res = await fetch("/api/saved-events", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setSavedEvents((prev) => prev.filter((e) => e.eventId !== eventId));
            }
        } catch {
            toast.error("Failed to remove event.");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <FaHeart className="text-red-500 text-xl" />
                <h1 className="text-2xl font-bold text-white">My Wishlist</h1>
                <span className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-1 rounded-full">
                    {savedEvents.length} saved
                </span>
            </div>

            {savedEvents.length === 0 ? (
                <Card className="glass border border-white/5 p-12 text-center space-y-4">
                    <FaHeart className="text-5xl text-slate-700 mx-auto" />
                    <p className="text-slate-400 font-medium">No saved events yet.</p>
                    <p className="text-slate-600 text-sm">
                        Click the ❤️ on any event card to save it here.
                    </p>
                    <Link href="/events">
                        <Button className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold" radius="lg">
                            Browse Events
                        </Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {savedEvents.map((item) => (
                        <Card
                            key={item._id}
                            className="glass-card flex flex-col p-0 overflow-hidden border border-white/5 shadow-xl"
                            radius="lg"
                        >
                            <div className="relative h-44 w-full">
                                <Image
                                    src={item.eventBanner && item.eventBanner.startsWith("http") ? item.eventBanner : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"}
                                    alt={item.eventTitle}
                                    fill
                                    className="object-cover"
                                />
                                <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur text-pink-400 font-bold text-xs uppercase tracking-wide px-3 py-1.5 rounded-full border border-pink-500/20">
                                    {item.eventCategory}
                                </span>
                                <button
                                    onClick={() => handleUnsave(item.eventId)}
                                    className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center border border-red-400 shadow-lg hover:bg-red-600 transition-colors"
                                    title="Remove from wishlist"
                                >
                                    <FaTrash className="text-white text-xs" />
                                </button>
                            </div>
                            <div className="p-5 flex-grow space-y-3">
                                <h3 className="font-bold text-white line-clamp-1">{item.eventTitle}</h3>
                                <div className="space-y-1.5 text-slate-400 text-xs">
                                    {item.eventDate && (
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-pink-500/70" />
                                            <span>{typeof item.eventDate === "string" ? item.eventDate : new Date(item.eventDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {item.eventLocation && (
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-pink-500/70" />
                                            <span className="truncate">{item.eventLocation}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="px-5 pb-5 pt-3 border-t border-white/5 flex justify-between items-center">
                                <span className="text-pink-400 font-extrabold">
                                    {item.ticketPrice === 0 ? "Free" : `$${Number(item.ticketPrice).toFixed(2)}`}
                                </span>
                                <Link href={`/events/${item.eventId}`}>
                                    <Button
                                        size="sm"
                                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold"
                                        radius="md"
                                    >
                                        View Event
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
