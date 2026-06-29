"use client";

import { useState, useEffect } from "react";
import { Card, Spinner } from "@heroui/react";
import { FaUsers, FaCalendarAlt, FaBuilding, FaDollarSign } from "react-icons/fa";

const UserStats = () => {
    const [stats, setStats] = useState({
        usersCount: 0,
        eventsCount: 0,
        orgsCount: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/admin/stats");
                const data = await res.json();
                if (res.status === 200) {
                    setStats(data);
                } else {
                    setError(data.error || "Failed to load admin stats.");
                }
            } catch (err) {
                console.error("Fetch admin stats error:", err);
                setError("Network error loading stats.");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="py-6 flex justify-center items-center">
                <Spinner color="secondary" size="md" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
                {error}
            </div>
        );
    }

    const items = [
        { label: "Platform Users", value: stats.usersCount, icon: FaUsers, color: "pink", gradient: "from-pink-500/10 via-pink-500/5 to-transparent" },
        { label: "Events Hosted", value: stats.eventsCount, icon: FaCalendarAlt, color: "indigo", gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent" },
        { label: "Organizations", value: stats.orgsCount, icon: FaBuilding, color: "purple", gradient: "from-purple-500/10 via-purple-500/5 to-transparent" },
        { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: FaDollarSign, color: "green", gradient: "from-green-500/10 via-green-500/5 to-transparent" },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map(({ label, value, icon: Icon, color, gradient }) => (
                <Card key={label} className={`relative overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-xl hover:scale-[1.02] hover:border-white/10 transition-all duration-300`}>
                    <div className="flex justify-between items-center p-6">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
                            <h2 className="text-3xl font-black text-white">
                                {value}
                            </h2>
                        </div>

                        <div className={`p-3.5 rounded-2xl bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
                            <Icon size={20} />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default UserStats;