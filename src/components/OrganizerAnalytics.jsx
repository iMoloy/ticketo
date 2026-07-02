"use client";

import { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from "recharts";
import {
    FaDollarSign, FaTicketAlt, FaCalendarAlt, FaCheckCircle
} from "react-icons/fa";

const StatCard = ({ icon: Icon, label, value, color }) => (
    <Card className="glass border border-white/5 p-5 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="text-xl text-white" />
        </div>
        <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{label}</p>
            <p className="text-2xl font-extrabold text-white">{value}</p>
        </div>
    </Card>
);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 shadow-xl text-sm">
                <p className="text-slate-400 font-semibold mb-1">{label}</p>
                {payload.map((p) => (
                    <p key={p.name} style={{ color: p.color }} className="font-bold">
                        {p.name === "revenue" ? `$${p.value}` : p.value} {p.name}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function OrganizerAnalytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/organizer/analytics")
            .then((r) => r.json())
            .then((d) => setData(d))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    if (!data || data.error) {
        return (
            <div className="text-center py-10 text-slate-500">
                Failed to load analytics data.
            </div>
        );
    }

    const { stats, revenueByEvent, monthlyData } = data;

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-1">Analytics</h1>
                <p className="text-sm text-slate-500">Revenue and ticket insights for your events</p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                <StatCard
                    icon={FaDollarSign}
                    label="Total Revenue"
                    value={`$${stats.totalRevenue.toFixed(2)}`}
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                />
                <StatCard
                    icon={FaTicketAlt}
                    label="Tickets Sold"
                    value={stats.totalTickets}
                    color="bg-gradient-to-br from-pink-500 to-rose-600"
                />
                <StatCard
                    icon={FaCalendarAlt}
                    label="Total Events"
                    value={stats.totalEvents}
                    color="bg-gradient-to-br from-indigo-500 to-violet-600"
                />
                <StatCard
                    icon={FaCheckCircle}
                    label="Approved Events"
                    value={stats.approvedEvents}
                    color="bg-gradient-to-br from-yellow-500 to-orange-500"
                />
            </div>

            {/* Monthly Revenue Line Chart */}
            <Card className="glass border border-white/5 p-6 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-white">Monthly Revenue Trend</h2>
                    <p className="text-xs text-slate-500">Last 7 months revenue & ticket sales</p>
                </div>
                {monthlyData.every((m) => m.revenue === 0) ? (
                    <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
                        No revenue data yet. Start selling tickets!
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8" }} />
                            <Line type="monotone" dataKey="revenue" stroke="#ec4899" strokeWidth={2.5} dot={{ fill: "#ec4899", r: 4 }} activeDot={{ r: 6 }} name="revenue" />
                            <Line type="monotone" dataKey="tickets" stroke="#6366f1" strokeWidth={2} dot={{ fill: "#6366f1", r: 3 }} strokeDasharray="4 2" name="tickets" />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </Card>

            {/* Revenue per Event Bar Chart */}
            <Card className="glass border border-white/5 p-6 space-y-4">
                <div>
                    <h2 className="text-lg font-bold text-white">Revenue by Event</h2>
                    <p className="text-xs text-slate-500">Total revenue generated per event</p>
                </div>
                {revenueByEvent.every((e) => e.revenue === 0) ? (
                    <div className="h-48 flex items-center justify-center text-slate-600 text-sm">
                        No booking data yet for your events.
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={revenueByEvent} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#64748b", fontSize: 10 }}
                                axisLine={false}
                                tickLine={false}
                                angle={-30}
                                textAnchor="end"
                                interval={0}
                            />
                            <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ fontSize: "12px", color: "#94a3b8", paddingTop: "24px" }} />
                            <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[6, 6, 0, 0]} name="revenue" />
                            <Bar dataKey="tickets" fill="url(#ticketGradient)" radius={[6, 6, 0, 0]} name="tickets" />
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ec4899" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#be185d" stopOpacity={0.6} />
                                </linearGradient>
                                <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                    <stop offset="100%" stopColor="#4338ca" stopOpacity={0.6} />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </Card>
        </div>
    );
}
