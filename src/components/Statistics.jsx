"use client";

export default function Statistics({ stats = { totalEvents: 150, totalAttendees: 95000, totalOrgs: 80 } }) {
  return (
    <section className="py-20 bg-gradient-to-r from-pink-900/10 via-indigo-900/10 to-transparent border-t border-white/5 w-full">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text">
            {stats.totalEvents}+
          </span>
          <p className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Premium Events Held</p>
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text">
            {stats.totalAttendees.toLocaleString()}+
          </span>
          <p className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Happy Attendees</p>
        </div>

        <div className="space-y-2">
          <span className="text-5xl font-extrabold text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 bg-clip-text">
            {stats.totalOrgs}+
          </span>
          <p className="text-slate-300 font-semibold text-sm uppercase tracking-wider">Vetted Organizations</p>
        </div>
      </div>
    </section>
  );
}
