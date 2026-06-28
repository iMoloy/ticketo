"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from "@heroui/react";

const TicketsTable = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();
        if (res.status === 200) {
          setTickets(data || []);
        } else {
          setError(data.error || "Failed to load tickets.");
        }
      } catch (err) {
        console.error("Fetch tickets error:", err);
        setError("Network error loading tickets.");
      } finally {
        setLoading(false);
      }
    }
    fetchTickets();
  }, []);

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
        <Table aria-label="My Tickets Table" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>EVENT NAME</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">QUANTITY</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TOTAL PAID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No ticket passes booked yet. Explore Browse Events!</p>}>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-bold text-white">
                    <Link href={`/events/${ticket.eventId}`} className="hover:text-pink-500 hover:underline">
                      {ticket.eventTitle}
                    </Link>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                    {new Date(ticket.bookingDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{ticket.quantity} ticket(s)</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-semibold text-green-400">${ticket.amount?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      className="font-bold uppercase text-[10px] tracking-wider border border-green-500/20 px-2"
                    >
                      Paid
                    </Chip>
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

export default TicketsTable;
