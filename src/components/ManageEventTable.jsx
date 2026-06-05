"use client";

import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip } from "@heroui/react";

const ManageEventTable = () => {
    return (
        <div className="mt-6">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
                <div className="p-0 overflow-x-auto">
                    <Table aria-label="Manage Events Table" removeWrapper>
                        <TableContent>
                            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>EVENT</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CATEGORY</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TICKET PRICE</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AVAILABLE SEATS</TableColumn>
                                <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
                            </TableHeader>
                            <TableBody>
                                <TableRow className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                                    <TableCell className="py-4 px-6 align-middle font-bold text-white"><span className="line-clamp-1 truncate max-w-[150px]">Global Tech Summit 2026</span></TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">Technology</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">11/12/2026</TableCell>
                                    <TableCell className="py-4 px-6 align-middle font-semibold text-green-400">$149.00</TableCell>
                                    <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">120</TableCell>
                                    <TableCell className="py-4 px-6 align-middle">
                                        <Chip
                                            size="sm"
                                            color="warning"
                                            variant="flat"
                                            className="font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1"
                                        >
                                            Pending
                                        </Chip>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </TableContent>
                    </Table>
                </div>
            </Card>
        </div>
    )
}

export default ManageEventTable;