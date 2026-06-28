"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, Table, TableContent, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Button, Spinner } from "@heroui/react";

const AdminUsersTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (res.status === 200) {
        setUsers(data || []);
      } else {
        setError(data.error || "Failed to load user list.");
      }
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Network error loading users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBlock = async (id, isCurrentlyBlocked) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: id,
          isBlocked: !isCurrentlyBlocked,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        // Toggle in state
        setUsers(users.map((usr) => (usr.id === id || usr._id === id ? { ...usr, isBlocked: !isCurrentlyBlocked } : usr)));
      } else {
        alert(data.error || "Failed to update block status.");
      }
    } catch (err) {
      console.error("Toggle block user error:", err);
      alert("Network error updating status.");
    }
  };

  if (loading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <Spinner color="secondary" size="lg" />
      </div>
    );
  }

  return (
    <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl p-6 rounded-2xl">
      {error && (
        <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
          {error}
        </div>
      )}

      <div className="p-0 overflow-x-auto">
        <Table aria-label="Users table" className="min-w-[900px] w-full text-left border-collapse" removeWrapper>
          <TableContent>
            <TableHeader className="bg-slate-950/40 border-b border-white/5 rounded-t-xl">
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">AVATAR</TableColumn>
              <TableColumn isRowHeader className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">NAME</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">EMAIL</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ROLE</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">STATUS</TableColumn>
              <TableColumn className="py-4 px-6 text-slate-400 font-extrabold uppercase text-[11px] tracking-wider border-b border-white/5 bg-slate-950/20">ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<p className="text-slate-500 py-10 text-center font-medium">No users found</p>}>
              {users.map((usr) => (
                <TableRow key={usr.id || usr._id} className="border-b border-white/5 hover:bg-white/5 transition-colors duration-150 last:border-b-0">
                  <TableCell className="py-4 px-6 align-middle text-slate-300">
                    <div className="h-10 w-10 relative">
                      <Image
                        fill
                        src={
                          usr.image && (usr.image.startsWith("http") || usr.image.startsWith("/"))
                            ? usr.image
                            : `https://ui-avatars.com/api/?name=${encodeURIComponent(usr.name || "User")}&background=7c3aed&color=fff&bold=true`
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
                      color={usr.isBlocked ? "danger" : "success"}
                      variant="flat"
                      className="font-bold uppercase text-[10px] tracking-wider border px-2.5 py-1"
                    >
                      {usr.isBlocked ? "Blocked" : "Active"}
                    </Chip>
                  </TableCell>
                  <TableCell className="py-4 px-6 align-middle">
                    {usr.role !== "admin" && (
                      <Button
                        size="sm"
                        variant="flat"
                        color={usr.isBlocked ? "success" : "danger"}
                        onClick={() => handleToggleBlock(usr.id || usr._id, usr.isBlocked)}
                        className="font-bold text-xs"
                      >
                        {usr.isBlocked ? "Unblock" : "Block"}
                      </Button>
                    )}
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
