"use client";

import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

const AttendeesTable = () => {
    return (
        <div className="mt-6">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
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
                                <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                                    <TableCell className="py-4 px-6 align-middle font-bold text-white">Nazmus Sakib</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">sakib@gmail.com</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-pink-500 font-semibold">Global Tech Summit 2026</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">2 tickets</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">6/3/2026</TableCell>
                                </TableRow>
                            </TableBody>
                        </TableContent>
                    </Table>
                </div>
            </Card>
        </div>
    )
}

export default AttendeesTable;