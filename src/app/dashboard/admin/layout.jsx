import DashboardSidebar from "@/components/DashboardSidebar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080c16]">
      <DashboardSidebar role="admin" />
      <div className="flex-grow p-6 lg:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
