"use client";

import { useState, useEffect } from "react";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from "@heroui/react";

const TransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await fetch("/api/admin/transactions");
        const data = await res.json();
        if (res.status === 200) {
          setTransactions(data || []);
        } else {
          setError(data.error || "Failed to load transactions.");
        }
      } catch (err) {
        console.error("Fetch transactions error:", err);
        setError("Network error loading transactions.");
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
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
        <Table aria-label="Platform Transaction Logs" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">USER EMAIL</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TRANSACTION ID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AMOUNT</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TYPE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">PAYMENT STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No global transactions logged on this platform.</p>}>
              {transactions.map((t) => (
                <TableRow key={t._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-white">{t.userEmail}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-mono text-xs text-indigo-400 truncate max-w-[250px]">{t.transactionId}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-extrabold text-green-400">${t.amount?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{new Date(t.paidAt || t.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      className={`font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1 ${
                        t.type === "upgrade" 
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      }`}
                    >
                      {t.type || "booking"}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      variant="flat"
                      color="success"
                      className="font-bold uppercase text-[10px] tracking-wider border border-green-500/20 px-2.5 py-1.5"
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

export default TransactionsTable;
