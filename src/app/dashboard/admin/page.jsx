import UserStats from "@/components/UserStats";

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Global platform statistics overview.</p>
        </div>
      </div>
      <UserStats />
    </div>
  );
}
