import AddEventForm from "@/components/AddEventForm";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Host a New Event</h1>
      <AddEventForm />
    </div>
  );
}
