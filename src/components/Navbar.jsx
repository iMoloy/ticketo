"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaTicketAlt, FaUser, FaSignOutAlt, FaThLarge } from "react-icons/fa";
import Logo from "./Logo";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setDropdownOpen(false);
    alert("Logged Out! (Design Only)");
  };



  const mockUser = {
    name: "Jane Doe",
    email: "jane@example.com",
    role: "attendee",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/65 backdrop-blur-md py-3.5 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Logo />

        {/* NAVIGATION LINKS */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-semibold transition-all py-1.5 px-3.5 rounded-full ${pathname === "/" ? "text-white bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`text-sm font-semibold transition-all py-1.5 px-3.5 rounded-full ${pathname.startsWith("/events") ? "text-white bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
          >
            Browse Events
          </Link>
          {isLoggedIn && (
            <Link
              href={`/dashboard/${mockUser.role}`}
              className={`text-sm font-semibold transition-all py-1.5 px-3.5 rounded-full ${pathname.startsWith("/dashboard") ? "text-white bg-white/5 border border-white/10" : "text-slate-400 hover:text-white"}`}
            >
              Dashboard
            </Link>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-4">


          {!isLoggedIn && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoggedIn(true)}
                className="inline-flex items-center justify-center font-semibold text-xs text-slate-300 hover:text-white h-9 px-4 rounded-xl hover:bg-white/5 transition"
              >
                Login
              </button>
              <Link
                href="/register"
                className="inline-flex items-center justify-center font-semibold text-xs bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20 transition h-9 px-4 rounded-xl"
              >
                Sign Up
              </Link>
            </div>
          )}

          {isLoggedIn && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
              >
                <img
                  className="w-9 h-9 rounded-full object-cover border border-pink-500 shadow-md shadow-pink-500/10"
                  src={mockUser.image}
                  alt="avatar"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl py-2 z-55 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User info */}
                  <div className="px-4 py-2.5 border-b border-white/5 mb-1.5 cursor-default">
                    <p className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                      {mockUser.role} Account
                    </p>
                    <p className="font-bold text-white text-sm mt-0.5">{mockUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">{mockUser.email}</p>
                  </div>

                  {/* Actions */}
                  <Link
                    href="/dashboard/organizer"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaThLarge className="text-slate-400 text-sm shrink-0" />
                    <span>My Dashboard</span>
                  </Link>

                  <Link
                    href={`/dashboard/${mockUser.role}`}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition cursor-pointer"
                  >
                    <FaUser className="text-slate-400 text-sm shrink-0" />
                    <span>Profile Settings</span>
                  </Link>

                  <div className="border-t border-white/5 my-1.5" />

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition cursor-pointer"
                  >
                    <FaSignOutAlt className="text-sm shrink-0 text-red-400" />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
