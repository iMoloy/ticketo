import AttendeeOverviewItems from "@/components/AttendeeOverviewItems";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Attendee Dashboard</h1>
      <AttendeeOverviewItems />
    </div>
  );
}
