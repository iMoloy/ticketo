"use client";

import { useState, useEffect } from "react";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Spinner } from "@heroui/react";

const AttendeesTable = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch("/api/bookings");
                const data = await res.json();
                if (res.status === 200) {
                    setBookings(data);
                } else {
                    setError(data.error || "Failed to load attendees.");
                }
            } catch (err) {
                console.error("Fetch organizer bookings error:", err);
                setError("Network error loading attendees list.");
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="mt-6">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
                        {error}
                    </div>
                )}

                <div className="p-0 overflow-x-auto">
                    <Table aria-label="Event Bookings Table" removeWrapper>
                        <TableContent>
                            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>ATTENDEE NAME</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EMAIL ADDRESS</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EVENT TICKET</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">QUANTITY</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">BOOKING DATE</TableColumn>
                            </TableHeader>
                            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No ticket purchases logged for your events.</p>}>
                                {bookings.map((b) => (
                                    <TableRow key={b._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                                        <TableCell className="py-4 px-6 align-middle font-bold text-white">
                                            {b.attendeeName || "Attendee"}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                            {b.attendeeEmail}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 align-middle text-pink-500 font-semibold">
                                            {b.eventTitle || "Unknown Event"}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                            {b.quantity} ticket{b.quantity > 1 ? "s" : ""}
                                        </TableCell>
                                        <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                            {new Date(b.bookingDate).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </TableContent>
                    </Table>
                </div>
            </Card>
        </div>
    );
};

export default AttendeesTable;