import TicketsTable from "@/components/TicketsTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">My Tickets</h1>
      <TicketsTable />
    </div>
  );
}
