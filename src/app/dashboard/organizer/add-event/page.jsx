import AddEventForm from "@/components/AddEventForm";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const id = params?.id || null;
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">
        {id ? "Edit Event" : "Host a New Event"}
      </h1>
      <AddEventForm eventId={id} />
    </div>
  );
}
