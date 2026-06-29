"use client";

import { useState, useEffect } from "react";
import { Card, CardContent as CardBody, Button, Spinner } from "@heroui/react";
import { FaCalendarAlt, FaUsers, FaDollarSign, FaCrown } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";

const OrganizerOverviewItems = () => {
    const { data: sessionData, isPending: sessionLoading } = useSession();
    const [stats, setStats] = useState({
        totalEvents: 0,
        totalSoldTickets: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);
    const [upgradeLoading, setUpgradeLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch hosted events
                const eventsRes = await fetch("/api/events?own=true");
                const eventsData = await eventsRes.json();
                
                // Fetch bookings
                const bookingsRes = await fetch("/api/bookings");
                const bookingsData = await bookingsRes.json();

                if (eventsRes.status === 200 && bookingsRes.status === 200) {
                    const totalEvents = eventsData.events ? eventsData.events.length : 0;
                    
                    // Sum up sold tickets and revenue from bookings
                    const totalSoldTickets = bookingsData.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0);
                    const totalRevenue = bookingsData.reduce((sum, b) => sum + (parseFloat(b.amount) || 0), 0);

                    setStats({
                        totalEvents,
                        totalSoldTickets,
                        totalRevenue,
                    });
                } else {
                    setError("Failed to fetch organizer statistics.");
                }
            } catch (err) {
                console.error("Fetch organizer stats error:", err);
                setError("Network error loading statistics.");
            } finally {
                setLoading(false);
            }
        };

        if (sessionData?.user) {
            fetchStats();
        } else if (!sessionLoading) {
            setLoading(false);
        }
    }, [sessionData, sessionLoading]);

    const handleUpgrade = async () => {
        setUpgradeLoading(true);
        setError("");
        try {
            const res = await fetch("/api/stripe/checkout-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    type: "upgrade",
                }),
            });

            const data = await res.json();
            if (res.status === 200 && data.url) {
                window.location.href = data.url;
            } else {
                setError(data.error || "Failed to initiate premium upgrade session.");
                setUpgradeLoading(false);
            }
        } catch (err) {
            console.error("Premium upgrade error:", err);
            setError("Network error initiating upgrade checkout.");
            setUpgradeLoading(false);
        }
    };

    if (loading || sessionLoading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    const isPremium = sessionData?.user?.isPremium === true;

    return (
        <div className="space-y-6 mt-6">
            {error && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Hosted Events</span>
                            <h2 className="text-3xl font-extrabold text-white">{stats.totalEvents}</h2>
                        </div>
                        <div className="p-3.5 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20"><FaCalendarAlt size={24} /></div>
                    </CardBody>
                </Card>
                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Ticket Sales</span>
                            <h2 className="text-3xl font-extrabold text-white">{stats.totalSoldTickets}</h2>
                        </div>
                        <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20"><FaUsers size={24} /></div>
                    </CardBody>
                </Card>
                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Accumulated Revenue</span>
                            <h2 className="text-3xl font-extrabold text-white">{`$${stats.totalRevenue.toFixed(2)}`}</h2>
                        </div>
                        <div className="p-3.5 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20"><FaDollarSign size={24} /></div>
                    </CardBody>
                </Card>
            </div>

            {!isPremium && (
                <Card className="border border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 via-amber-600/5 to-transparent relative overflow-hidden" radius="lg">
                    <CardBody className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><FaCrown className="text-yellow-400" /> Unlock Unlimited Event Creation</h3>
                            <p className="text-slate-400 text-xs max-w-xl leading-relaxed">Standard organizer accounts are limited to <strong>3 events</strong>. Upgrade to our Premium Package for <strong>$49.00</strong> to host unlimited events.</p>
                        </div>
                        <Button 
                            onClick={handleUpgrade}
                            isLoading={upgradeLoading}
                            className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold h-11 px-6 shadow-lg shadow-yellow-500/10 shrink-0" 
                            radius="lg"
                        >
                            Upgrade to Premium
                        </Button>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default OrganizerOverviewItems;