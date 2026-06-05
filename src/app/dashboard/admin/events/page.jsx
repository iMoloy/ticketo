import AdminEventsTable from "@/components/AdminEventsTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Approve Events</h1>
      <AdminEventsTable />
    </div>
  );
}
