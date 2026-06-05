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

const AdminEventsTable = () => {
  const events = [
    {
      _id: "e1",
      organizerEmail: "organizer1@example.com",
      title: "Global Tech Summit 2026",
      category: "Tech",
      ticketPrice: 149.00,
      availableSeats: 120,
      status: "pending"
    },
    {
      _id: "e2",
      organizerEmail: "organizer2@example.com",
      title: "Symphony Under the Stars",
      category: "Music",
      ticketPrice: 45.00,
      availableSeats: 300,
      status: "approved"
    }
  ];

  return (
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      <div className="p-0 overflow-x-auto">
        <Table aria-label="Approve Organizer Events" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ORGANIZER EMAIL</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EVENT TITLE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CATEGORY</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">TICKET PRICE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">CAPACITY</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No event listings added by organizers.</p>}>
              {events.map((ev) => (
                <TableRow key={ev._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle font-semibold text-indigo-400">{ev.organizerEmail}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-white">{ev.title}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{ev.category}</TableCell>
                  <TableCell className="py-4 px-6 align-middle font-bold text-green-400">${ev.ticketPrice?.toFixed(2)}</TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">{ev.availableSeats} Seats</TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      className={`font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1 ${
                        ev.status === "approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : ev.status === "rejected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                      }`}
                    >
                      {ev.status || "pending"}
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

export default AdminEventsTable;
