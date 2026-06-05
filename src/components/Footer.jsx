import Link from "next/link";
import { FaTicketAlt, FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-pink-500 to-indigo-500 p-2 rounded-lg text-white">
              <FaTicketAlt className="text-lg" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-pink-500 bg-clip-text text-transparent">
              Ticketo
            </span>
          </Link>
          <p className="text-slate-400 text-sm leading-relaxed">
            The next-generation event discovery and seamless ticket booking platform connecting passionate organizers with eager attendees.
          </p>
          <div className="flex gap-4 text-slate-400">
            <a href="#" className="hover:text-pink-500 transition-colors"><FaFacebook size={18} /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><FaTwitter size={18} /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><FaInstagram size={18} /></a>
            <a href="#" className="hover:text-pink-500 transition-colors"><FaGithub size={18} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Discover Events</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link href="/events?category=Music" className="hover:text-white transition-colors">Music Festivals</Link></li>
            <li><Link href="/events?category=Tech" className="hover:text-white transition-colors">Tech Conferences</Link></li>
            <li><Link href="/events?category=Sports" className="hover:text-white transition-colors">Sports Matches</Link></li>
            <li><Link href="/events?category=Arts" className="hover:text-white transition-colors">Art Exhibitions</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">For Organizers</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><Link href="/register?role=organizer" className="hover:text-white transition-colors">Create Organization</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Host an Event</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">Premium Packages</Link></li>
            <li><a href="#" className="hover:text-white transition-colors">Pricing & Fees</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Company</h3>
          <ul className="space-y-2 text-slate-400 text-sm">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-8 text-center text-slate-500 text-xs">
        <p>&copy; {new Date().getFullYear()} Ticketo Inc. All rights reserved. Developed by Antigravity AI.</p>
      </div>
    </footer>
  );
}
