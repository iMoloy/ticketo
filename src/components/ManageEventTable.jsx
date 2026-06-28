"use client";

import { useState, useEffect } from "react";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Spinner } from "@heroui/react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Link from "next/link";

const ManageEventTable = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchEvents = async () => {
        try {
            const res = await fetch("/api/events?own=true");
            const data = await res.json();
            if (res.status === 200) {
                setEvents(data.events || []);
            } else {
                setError(data.error || "Failed to load hosted events.");
            }
        } catch (err) {
            console.error("Fetch organizer events error:", err);
            setError("Network error loading events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to permanently delete this event? This action cannot be undone.")) {
            return;
        }

        try {
            const res = await fetch(`/api/events/${id}`, {
                method: "DELETE",
            });
            const data = await res.json();

            if (res.status === 200 && data.success) {
                // Remove from state list
                setEvents(events.filter((e) => e._id !== id));
            } else {
                alert(data.error || "Failed to delete event.");
            }
        } catch (err) {
            console.error("Delete event error:", err);
            alert("Network error deleting event.");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "approved":
                return "success";
            case "rejected":
                return "danger";
            case "pending":
            default:
                return "warning";
        }
    };

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
                    {events.length === 0 ? (
                        <div className="text-center py-12 text-slate-400 text-sm">
                            You have not hosted any events yet. Click "Add Event" to host your first event!
                        </div>
                    ) : (
                        <Table aria-label="Manage Events Table" removeWrapper>
                            <TableContent>
                                <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>EVENT</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CATEGORY</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TICKET PRICE</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">SEATS</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
                                    <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ACTIONS</TableColumn>
                                </TableHeader>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                                            <TableCell className="py-4 px-6 align-middle font-bold text-white">
                                                <span className="line-clamp-1 truncate max-w-[150px]" title={event.title}>
                                                    {event.title}
                                                </span>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                                {event.category}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                                {new Date(event.date).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle font-semibold text-green-400">
                                                {event.ticketPrice === 0 ? "Free" : `$${event.ticketPrice.toFixed(2)}`}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                                                {event.availableSeats}
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle">
                                                <Chip
                                                    size="sm"
                                                    color={getStatusColor(event.status)}
                                                    variant="flat"
                                                    className="font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1"
                                                >
                                                    {event.status}
                                                </Chip>
                                            </TableCell>
                                            <TableCell className="py-4 px-6 align-middle">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        as={Link}
                                                        href={`/dashboard/organizer/add-event?id=${event._id}`}
                                                        variant="light"
                                                        isIconOnly
                                                        className="text-indigo-400 hover:text-indigo-300 min-w-0 p-1"
                                                        title="Edit Event"
                                                    >
                                                        <FaEdit size={14} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDelete(event._id)}
                                                        variant="light"
                                                        isIconOnly
                                                        className="text-red-400 hover:text-red-300 min-w-0 p-1"
                                                        title="Delete Event"
                                                    >
                                                        <FaTrashAlt size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </TableContent>
                        </Table>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default ManageEventTable;