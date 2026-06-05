import {
  Card,
  Table,
  TableContent,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from "@heroui/react";

const TransactionsTable = () => {
  const transactions = [
    {
      _id: "t1",
      userEmail: "attendee@example.com",
      transactionId: "ch_mock_stripe_transaction_12345",
      amount: 298.00,
      paidAt: "2026-06-03T10:00:00Z",
      paymentStatus: "paid"
    },
    {
      _id: "t2",
      userEmail: "organizer@example.com",
      transactionId: "ch_mock_stripe_transaction_99999",
      amount: 49.00,
      paidAt: "2026-06-02T15:00:00Z",
      paymentStatus: "paid"
    }
  ];

  return (
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      <div className="p-0 overflow-x-auto">
        <Table aria-label="Platform Transaction Logs" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">USER EMAIL</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TRANSACTION ID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AMOUNT</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">PAYMENT STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No global transactions logged on this platform.</p>}>
              {transactions.map((t) => (
                <TableRow key={t._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-white">{t.userEmail}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-mono text-xs text-indigo-400 truncate max-w-[250px]">{t.transactionId}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-extrabold text-green-400">${t.amount?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{new Date(t.paidAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={t.paymentStatus === "failed" ? "danger" : "success"}
                      className="font-bold uppercase text-[10px] tracking-wider border border-white/5 px-2.5 py-1.5"
                    >
                      {t.paymentStatus || "succeeded"}
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
