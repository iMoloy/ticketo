import AttendeesTable from "@/components/AttendeesTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Event Attendees</h1>
      <AttendeesTable />
    </div>
  );
}
