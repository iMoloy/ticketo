"use client";

import { useState, useEffect } from "react";
import { Card, CardContent as CardBody, CardHeader, Input, Button, Form, TextArea, Spinner } from "@heroui/react";
import { FaDollarSign, FaTicketAlt, FaCalendarDay } from "react-icons/fa";
import { toast } from "react-toastify";

const AttendeeOverviewItems = () => {
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Profile States
    const [profile, setProfile] = useState({
        name: "",
        image: "",
        bio: "",
    });

    // Stats States
    const [stats, setStats] = useState({
        totalSpent: 0,
        ticketsBooked: 0,
        upcomingEvents: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // 1. Fetch Session for profile values
                const sessionRes = await fetch("/api/auth/get-session");
                const sessionData = await sessionRes.json();
                if (sessionRes.status === 200 && sessionData?.user) {
                    setProfile({
                        name: sessionData.user.name || "",
                        image: sessionData.user.image || "",
                        bio: sessionData.user.bio || "",
                    });
                }

                // 2. Fetch Bookings for tickets counted
                const bookingsRes = await fetch("/api/bookings");
                const bookingsData = await bookingsRes.json();

                // 3. Fetch Payments for total spent
                const paymentsRes = await fetch("/api/payments");
                const paymentsData = await paymentsRes.json();

                if (bookingsRes.status === 200 && paymentsRes.status === 200) {
                    const ticketsBooked = bookingsData.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0);
                    
                    const now = new Date();
                    const upcomingEvents = bookingsData.filter((b) => {
                        if (!b.eventDate) return false;
                        return new Date(b.eventDate) > now;
                    }).length;

                    const totalSpent = paymentsData.reduce((sum, p) => sum + (parseFloat(p.amount) || 0), 0);

                    setStats({
                        totalSpent,
                        ticketsBooked,
                        upcomingEvents,
                    });
                } else {
                    setError("Failed to load dashboard data.");
                }
            } catch (err) {
                console.error("Fetch attendee dashboard error:", err);
                setError("Network error loading dashboard information.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        setError("");
        setSuccess("");

        try {
            const res = await fetch("/api/auth/update-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: profile.name,
                    image: profile.image,
                    bio: profile.bio,
                }),
            });

            const data = await res.json();
            if (res.status === 200 && data.success) {
                toast.success("Profile updated successfully!");
                setSuccess("Profile updated successfully!");
            } else {
                toast.error(data.error || "Failed to update profile.");
                setError(data.error || "Failed to update profile.");
            }
        } catch (err) {
            console.error("Save profile error:", err);
            toast.error("Network error saving profile.");
            setError("Network error saving profile.");
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="py-12 flex justify-center items-center">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {error && (
                <div className="p-4 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold text-center">
                    {error}
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs font-semibold text-center">
                    {success}
                </div>
            )}


            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spent</span>
                            <h2 className="text-3xl font-extrabold text-white">
                                {`$${stats.totalSpent.toFixed(2)}`}
                            </h2>
                        </div>
                        <div className="p-3.5 bg-green-500/10 text-green-400 rounded-2xl border border-green-500/20">
                            <FaDollarSign size={24} />
                        </div>
                    </CardBody>
                </Card>

                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Tickets Booked</span>
                            <h2 className="text-3xl font-extrabold text-white">
                                {stats.ticketsBooked}
                            </h2>
                        </div>
                        <div className="p-3.5 bg-pink-500/10 text-pink-400 rounded-2xl border border-pink-500/20">
                            <FaTicketAlt size={24} />
                        </div>
                    </CardBody>
                </Card>

                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Upcoming Events</span>
                            <h2 className="text-3xl font-extrabold text-white">
                                {stats.upcomingEvents}
                            </h2>
                        </div>
                        <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-2xl border border-indigo-500/20">
                            <FaCalendarDay size={24} />
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Profile Update Panel */}
            <Card className="glass border-white/5 max-w-3xl" radius="lg">
                <CardHeader className="flex flex-col gap-1 pb-4 border-b border-white/5">
                    <h3 className="text-xl font-bold text-white">Profile Information</h3>
                    <p className="text-slate-400 text-xs">Update your public details and biography details.</p>
                </CardHeader>
                <CardBody className="pt-6">
                    <Form onSubmit={handleSaveProfile} className="space-y-4 w-full">
                        <Input
                            label="Full Name"
                            labelPlacement="outside"
                            placeholder="John Doe"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            className="bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                            required
                        />

                        <Input
                            label="Avatar URL"
                            labelPlacement="outside"
                            placeholder="https://api.dicebear.com/7.x/adventurer/svg?seed=John"
                            value={profile.image}
                            onChange={(e) => setProfile({ ...profile, image: e.target.value })}
                            className="bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        />

                        <TextArea
                            id="bio"
                            label="Biography"
                            labelPlacement="outside"
                            placeholder="Tell us about yourself..."
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none min-h-[100px] text-white text-sm"
                        />

                        <Button
                            type="submit"
                            isLoading={submitLoading}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
                            radius="lg"
                        >
                            Save Profile
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AttendeeOverviewItems;