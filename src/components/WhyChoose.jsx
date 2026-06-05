"use client";

import { FaAward, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function WhyChoose() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-white md:text-4xl">Why Choose Ticketo</h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm mt-3">
          Delivering an elite and state-of-the-art event management system that empowers everyone.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="glass p-8 rounded-2xl hover:border-pink-500/30 transition duration-300 group">
          <div className="bg-pink-500/10 text-pink-400 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
            <FaAward size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Premium Events Only</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Every event created is moderated by administrators to guarantee maximum platform authenticity and top-tier event experiences.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl hover:border-indigo-500/30 transition duration-300 group">
          <div className="bg-indigo-500/10 text-indigo-400 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
            <FaShieldAlt size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">100% Secure Checkout</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Ticket transactions and package upgrades are integrated directly with Stripe Checkout, keeping payments fast and secure.
          </p>
        </div>

        <div className="glass p-8 rounded-2xl hover:border-purple-500/30 transition duration-300 group">
          <div className="bg-purple-500/10 text-purple-400 p-4 rounded-xl inline-block mb-6 group-hover:scale-110 transition-transform">
            <FaUsers size={28} />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Organizer Analytics</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Organizers receive dedicated dashboards containing detailed tables of attendees, ticket sales tracking, and real-time revenue stats.
          </p>
        </div>
      </div>
    </section>
  );
}
