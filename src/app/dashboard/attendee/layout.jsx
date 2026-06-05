import DashboardSidebar from "@/components/DashboardSidebar";

export default function AttendeeLayout({ children }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#080c16]">
      <DashboardSidebar role="attendee" />
      <div className="flex-grow p-6 lg:p-10 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
