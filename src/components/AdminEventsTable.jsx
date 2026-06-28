"use client";

import { useState, useEffect } from "react";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Spinner } from "@heroui/react";
import { FaCheck, FaTimes, FaTrashAlt } from "react-icons/fa";

const AdminEventsTable = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/admin/events");
      const data = await res.json();
      if (res.status === 200) {
        setEvents(data || []);
      } else {
        setError(data.error || "Failed to load events.");
      }
    } catch (err) {
      console.error("Fetch events error:", err);
      setError("Network error loading events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleModerate = async (id, status) => {
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: id,
          status,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        // Update in state
        setEvents(events.map((ev) => (ev._id === id ? { ...ev, status } : ev)));
      } else {
        alert(data.error || "Failed to update event status.");
      }
    } catch (err) {
      console.error("Moderate event error:", err);
      alert("Network error updating status.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to permanently delete this event listing?")) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/events?eventId=${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        // Remove from list
        setEvents(events.filter((ev) => ev._id !== id));
      } else {
        alert(data.error || "Failed to delete event.");
      }
    } catch (err) {
      console.error("Delete event error:", err);
      alert("Network error deleting event.");
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case "approved":
        return (
          <Chip size="sm" className="bg-green-500/10 text-green-400 border-green-500/20 font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1">
            Approved
          </Chip>
        );
      case "rejected":
        return (
          <Chip size="sm" className="bg-red-500/10 text-red-400 border-red-500/20 font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1">
            Rejected
          </Chip>
        );
      case "pending":
      default:
        return (
          <Chip size="sm" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1">
            Pending
          </Chip>
        );
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
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <div className="p-0 overflow-x-auto">
        <Table aria-label="Approve Organizer Events" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ORGANIZER EMAIL</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EVENT TITLE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CATEGORY</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TICKET PRICE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CAPACITY</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No event listings added by organizers.</p>}>
              {events.map((ev) => (
                <TableRow key={ev._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-indigo-400">{ev.organizerEmail}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-white">{ev.title}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{ev.category}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-green-400">
                    {ev.ticketPrice === 0 ? "Free" : `$${ev.ticketPrice?.toFixed(2)}`}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{ev.availableSeats} Seats</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    {getStatusChip(ev.status)}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <div className="flex items-center gap-2">
                      {ev.status !== "approved" && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="success"
                          isIconOnly
                          onClick={() => handleModerate(ev._id, "approved")}
                          title="Approve Event"
                        >
                          <FaCheck size={12} />
                        </Button>
                      )}
                      {ev.status !== "rejected" && (
                        <Button
                          size="sm"
                          variant="flat"
                          color="warning"
                          isIconOnly
                          onClick={() => handleModerate(ev._id, "rejected")}
                          title="Reject Event"
                        >
                          <FaTimes size={12} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="flat"
                        color="danger"
                        isIconOnly
                        onClick={() => handleDelete(ev._id)}
                        title="Delete Event"
                      >
                        <FaTrashAlt size={12} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContent>
        </Table>
      </div>
    </Card>
  );
};

export default AdminEventsTable;
