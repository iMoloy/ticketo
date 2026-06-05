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

const PaymentsTable = () => {
  const payments = [
    {
      _id: "p1",
      transactionId: "ch_mock_stripe_transaction_12345",
      amount: 298.00,
      paidAt: "2026-06-03T10:00:00Z",
      paymentStatus: "paid"
    },
    {
      _id: "p2",
      transactionId: "ch_mock_stripe_transaction_67890",
      amount: 45.00,
      paidAt: "2026-05-15T14:30:00Z",
      paymentStatus: "paid"
    }
  ];

  return (
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      <div className="p-0 overflow-x-auto">
        <Table aria-label="Payment History Table" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20" isRowHeader>TRANSACTION ID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AMOUNT PAID</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">DATE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No receipt records in transaction logs.</p>}>
              {payments.map((p) => (
                <TableRow key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-indigo-400 truncate max-w-[200px]">
                    {p.transactionId}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-green-400">${p.amount?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{new Date(p.paidAt).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      variant="flat"
                      color={p.paymentStatus === "failed" ? "danger" : "success"}
                      className="font-bold uppercase text-[10px] tracking-wider border border-white/5 px-2"
                    >
                      {p.paymentStatus || 'succeeded'}
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
