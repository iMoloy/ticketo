import AdminUsersTable from "@/components/AdminUsersTable";

export default function Page() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold text-white">Manage Users</h1>
      <AdminUsersTable />
    </div>
  );
}
