"use client";

import { useState, useEffect } from "react";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from "@heroui/react";

const PaymentsTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        const res = await fetch("/api/payments");
        const data = await res.json();
        if (res.status === 200) {
          setPayments(data || []);
        } else {
          setError(data.error || "Failed to load payment receipts.");
        }
      } catch (err) {
        console.error("Fetch payments error:", err);
        setError("Network error loading payments.");
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
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
        <Table aria-label="Payment History Table" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>TRANSACTION ID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TYPE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AMOUNT PAID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No receipt records in transaction logs.</p>}>
              {payments.map((p) => (
                <TableRow key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-indigo-400 truncate max-w-[200px]" title={p.transactionId}>
                    {p.transactionId}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      className={`font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1 ${
                        p.type === "upgrade" 
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {p.type || "booking"}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-green-400">${p.amount?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                    {new Date(p.paidAt || p.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      className="font-bold uppercase text-[10px] tracking-wider border border-green-500/20 px-2"
                    >
                      Succeeded
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

export default PaymentsTable;
