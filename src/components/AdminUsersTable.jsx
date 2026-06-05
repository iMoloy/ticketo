import Image from "next/image";
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

const AdminUsersTable = () => {
  const users = [
    {
      _id: "u1",
      name: "John Doe",
      email: "john@example.com",
      role: "attendee",
      isBlocked: false,
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=John"
    },
    {
      _id: "u2",
      name: "Organizer John",
      email: "organizer@example.com",
      role: "organizer",
      isBlocked: false,
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Organizer"
    },
    {
      _id: "u3",
      name: "Banned User",
      email: "banned@example.com",
      role: "attendee",
      isBlocked: true,
      image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Banned"
    }
  ];

  return (
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      <div className="p-0 overflow-x-auto">
        <Table aria-label="Users table" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AVATAR</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">NAME</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EMAIL</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ROLE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No users found</p>}>
              {users.map((usr) => (
                <TableRow key={usr._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle text-slate-300">
                    <div className="h-10 w-10 relative">
                      <Image
                        fill
                        src={
                          usr.image && (usr.image.startsWith("http") || usr.image.startsWith("/"))
                            ? usr.image
                            : "https://images.unsplash.com/photo-1549880181-56a44cf8a4a1"
                        }
                        className="rounded-full object-cover border border-white/10"
                        alt="avatar"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle font-semibold text-white">
                    {usr.name}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle text-slate-300 font-medium">
                    {usr.email}
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      className={`font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1 ${usr.role === "admin"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                        : usr.role === "organizer"
                          ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}
                    >
                      {usr.role}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    <Chip
                      size="sm"
                      className={`font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1 ${usr.isBlocked
                        ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : "bg-green-500/10 text-green-400 border-green-500/20"
                        }`}
                    >
                      {usr.isBlocked ? "Blocked" : "Active"}
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

export default AdminUsersTable;
