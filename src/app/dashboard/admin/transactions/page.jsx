import TransactionsTable from "@/components/TransactionsTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Global Transactions Logs</h1>
      <TransactionsTable />
    </div>
  );
}
