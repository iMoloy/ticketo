import DashboardSidebar from "@/components/DashboardSidebar";

export default function OrganizerLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080c16]">
      <DashboardSidebar role="organizer" />
      <div className="flex-grow p-6 lg:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
