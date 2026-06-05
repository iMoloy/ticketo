"use client";

import { Card } from "@heroui/react";
import { FaUsers, FaCalendarAlt, FaBuilding, FaDollarSign } from "react-icons/fa";

const UserStats = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
                { label: "Platform Users", value: 50, icon: FaUsers, color: "pink", gradient: "from-pink-500/10 via-pink-500/5 to-transparent" },
                { label: "Events Hosted", value: 5, icon: FaCalendarAlt, color: "indigo", gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent" },
                { label: "Organizations", value: 5, icon: FaBuilding, color: "purple", gradient: "from-purple-500/10 via-purple-500/5 to-transparent" },
                { label: "Total Revenue", value: "$0.00", icon: FaDollarSign, color: "green", gradient: "from-green-500/10 via-green-500/5 to-transparent" },
            ].map(({ label, value, icon: Icon, color, gradient }) => (
                <Card key={label} className={`relative overflow-hidden border border-white/5 bg-gradient-to-br ${gradient} backdrop-blur-xl shadow-xl hover:scale-[1.02] hover:border-white/10 transition-all duration-300`}>
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
    )
}

export default UserStats;