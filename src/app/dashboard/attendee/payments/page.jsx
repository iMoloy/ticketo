import PaymentsTable from "@/components/PaymentsTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Payment History</h1>
      <PaymentsTable />
    </div>
  );
}
