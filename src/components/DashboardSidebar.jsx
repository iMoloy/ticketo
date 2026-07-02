"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  FaUserCircle,
  FaTicketAlt,
  FaHistory,
  FaBuilding,
  FaCalendarAlt,
  FaPlus,
  FaUsers,
  FaUserShield,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaHeart
} from "react-icons/fa";
import { Button, Drawer } from "@heroui/react";
import Logo from "./Logo";
import Image from "next/image";

import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

// Menu items for each role
const MENU_BY_ROLE = {
  attendee: [
    { key: "overview", label: "Overview", icon: FaUserCircle },
    { key: "tickets", label: "My Tickets", icon: FaTicketAlt },
    { key: "payments", label: "Payments", icon: FaHistory },
    { key: "wishlist", label: "Wishlist", icon: FaHeart },
  ],
  organizer: [
    { key: "overview", label: "Overview", icon: FaUsers },
    { key: "organization", label: "Organization", icon: FaBuilding },
    { key: "add-event", label: "Add Event", icon: FaPlus },
    { key: "manage-events", label: "Manage Events", icon: FaCalendarAlt },
    { key: "attendees", label: "Attendees", icon: FaUsers },
  ],
  admin: [
    { key: "users", label: "Users", icon: FaUserShield },
    { key: "events", label: "Approve Events", icon: FaCalendarAlt },
    { key: "transactions", label: "Transaction Logs", icon: FaHistory },
  ],
};

export default function DashboardSidebar({ role = "organizer" }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const handleLogout = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  const menuItems = MENU_BY_ROLE[role] || MENU_BY_ROLE.attendee;

  const getPath = (tabKey) => {
    if (role === "admin") {
      return `/dashboard/admin/${tabKey}`;
    }
    if (tabKey === "overview") {
      return `/dashboard/${role}`;
    }
    return `/dashboard/${role}/${tabKey}`;
  };

  const displayName = user?.name || "Jane Doe";
  const userAvatar = user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7c3aed&color=fff&bold=true`;

  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-slate-950/80 backdrop-blur-xl">
      {/* Brand / Logo */}
      <div className="px-6 py-5 border-b border-white/5">
        <Logo />
      </div>

      {/* User Profile */}
      <div className="px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-500/60 shrink-0">
            <Image
              width={40}
              height={40}
              src={userAvatar}
              alt="Avatar"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-bold truncate leading-tight">
              {displayName}
            </p>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${role === "admin" ? "text-yellow-400" : role === "organizer" ? "text-indigo-400" : "text-pink-400"}`}>
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow overflow-y-auto px-3 py-4 space-y-1">
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest px-3 pb-2">Navigation</p>

        {menuItems.map(({ key, label, icon: Icon }) => {
          const targetPath = getPath(key);
          const isActive = pathname === targetPath || (role === "admin" && pathname === "/dashboard/admin" && key === "users");
          return (
            <Link
              key={key}
              href={targetPath}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 text-left cursor-pointer ${isActive
                ? "bg-gradient-to-r from-pink-500/20 to-indigo-600/20 text-white border border-pink-500/20 shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-gradient-to-br from-pink-500 to-indigo-600 text-white shadow-md shadow-pink-500/20" : "bg-white/5 text-slate-400"}`}>
                <Icon size={14} />
              </span>
              <span>{label}</span>
              {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-pink-400" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Links */}
      <div className="px-3 py-4 border-t border-white/5 space-y-1">
        <Link href="/" className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-150">
          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <FaHome size={13} />
          </span>
          Back to Site
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-all duration-150 cursor-pointer"
        >
          <span className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
            <FaSignOutAlt size={13} />
          </span>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Persistent aside panel) */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile Top Header + Toggleable HeroUI Drawer */}
      <div className="lg:hidden w-full flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-white/5 backdrop-blur-xl sticky top-0 z-50">
        <Logo />

        <Drawer>
          <Button variant="bordered" className="border-white/10 hover:border-white/20 text-white font-semibold flex items-center gap-2 min-w-0 px-3 py-1.5 h-10" radius="lg">
            <FaBars />
            Menu
          </Button>
          <Drawer.Backdrop>
            <Drawer.Content placement="left" className="bg-slate-950/95 border-r border-white/5 backdrop-blur-xl p-0 w-64 max-w-xs">
              <Drawer.Dialog className="bg-transparent h-full flex flex-col p-0 border-none shadow-none">
                <Drawer.CloseTrigger className="text-white hover:text-red-400 absolute right-4 top-5 z-50 cursor-pointer" />
                <SidebarContent />
              </Drawer.Dialog>
            </Drawer.Content>
          </Drawer.Backdrop>
        </Drawer>
      </div>
    </>
  );
}
