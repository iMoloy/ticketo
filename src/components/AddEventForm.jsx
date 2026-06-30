"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, Form, Input, Button, Select, SelectTrigger, SelectValue, SelectIndicator, SelectPopover, ListBox, ListBoxItem, TextArea, Spinner } from "@heroui/react";
import { toast } from "react-toastify";

const CATEGORIES = ["Music", "Tech", "Sports", "Arts", "Business", "Food", "Other"];
const LOCATIONS = ["New York", "San Francisco", "London", "Dhaka", "Tokyo", "Berlin", "Online"];

const AddEventForm = ({ eventId = null }) => {
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [banner, setBanner] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [ticketPrice, setTicketPrice] = useState("0");
    const [availableSeats, setAvailableSeats] = useState("100");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // Load event data in edit mode
    useEffect(() => {
        if (!eventId) return;

        async function fetchEventDetails() {
            setLoading(true);
            try {
                const res = await fetch(`/api/events/${eventId}`);
                const data = await res.json();
                if (res.status === 200 && data) {
                    setTitle(data.title || "");
                    setBanner(data.banner || "");
                    setCategory(data.category || "");
                    setLocation(data.location || "");
                    
                    // Format date to YYYY-MM-DD
                    if (data.date) {
                        const dateObj = new Date(data.date);
                        const formatted = dateObj.toISOString().split("T")[0];
                        setDate(formatted);
                    }
                    
                    setTicketPrice(data.ticketPrice?.toString() || "0");
                    setAvailableSeats(data.availableSeats?.toString() || "100");
                    setDescription(data.description || "");
                } else {
                    setError("Failed to load event details for editing.");
                }
            } catch (err) {
                console.error("Edit mode load error:", err);
                setError("Error loading event data.");
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [eventId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        if (!category) {
            toast.error("Please select an event category.");
            setError("Please select an event category.");
            setSaving(false);
            return;
        }

        if (!location) {
            toast.error("Please select an event location.");
            setError("Please select an event location.");
            setSaving(false);
            return;
        }

        const payload = {
            title,
            banner,
            category,
            location,
            date,
            ticketPrice: parseFloat(ticketPrice) || 0,
            availableSeats: parseInt(availableSeats) || 0,
            description,
        };

        try {
            const url = eventId ? `/api/events/${eventId}` : "/api/events";
            const method = eventId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (res.status === 200 && (data.success || data.eventId || eventId)) {
                const msg = eventId ? "Event updated successfully! (Status reset to pending moderation)" : "Event hosted successfully! Pending admin approval.";
                toast.success(msg);
                setSuccess(msg);
                
                // If hosting a new event, clear inputs
                if (!eventId) {
                    setTitle("");
                    setBanner("");
                    setCategory("");
                    setLocation("");
                    setDate("");
                    setTicketPrice("0");
                    setAvailableSeats("100");
                    setDescription("");
                }

                // Redirect after brief delay
                setTimeout(() => {
                    router.push("/dashboard/organizer/manage-events");
                }, 2000);
            } else {
                toast.error(data.error || "Failed to submit event details.");
                setError(data.error || "Failed to submit event details.");
            }
        } catch (err) {
            console.error("Submit event form error:", err);
            toast.error("Network error occurred.");
            setError("Network error occurred.");
        } finally {
            setSaving(false);
        }
    };


    if (loading) {
        return (
            <div className="py-16 flex justify-center items-center">
                <Spinner color="secondary" size="lg" />
            </div>
        );
    }

    return (
        <div className="mt-6 max-w-3xl">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-2xl" radius="lg">
                <CardHeader className="flex flex-col gap-1 pb-4 border-b border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white">
                        {eventId ? "Edit Event Details" : "Host a New Event"}
                    </h3>
                    <p className="text-slate-400 text-xs">
                        {eventId ? "Update the fields below. Edits will reset approval back to pending." : "Fill out the detailed event information. Banners and dates are required."}
                    </p>
                </CardHeader>
                <div className="p-6">
                    <Form onSubmit={handleSubmit} className="space-y-4 w-full">
                        {error && (
                            <div className="w-full p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs text-center font-semibold">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="w-full p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl text-xs text-center font-semibold">
                                {success}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Input 
                                label="Event Title" 
                                labelPlacement="outside" 
                                placeholder="e.g. Rock Fest 2026" 
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required 
                                className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                            />
                            <Input 
                                label="Banner Image URL" 
                                labelPlacement="outside" 
                                placeholder="https://images.unsplash.com/..." 
                                value={banner}
                                onChange={(e) => setBanner(e.target.value)}
                                required 
                                className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-xs font-semibold text-slate-300">Category</span>
                                <Select
                                    id="event-category"
                                    aria-label="Category"
                                    placeholder="Select Category"
                                    className="w-full"
                                    selectedKeys={category ? new Set([category]) : new Set()}
                                    onSelectionChange={(keys) => setCategory(Array.from(keys)[0] || "")}
                                >
                                    <SelectTrigger className="w-full flex items-center justify-between bg-slate-900/50 border border-white/10 rounded-xl px-3 h-11 text-white text-sm">
                                        <SelectValue />
                                        <SelectIndicator />
                                    </SelectTrigger>
                                    <SelectPopover className="bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-1 min-w-[200px]">
                                        <ListBox className="outline-none">
                                            {CATEGORIES.map((cat) => <ListBoxItem key={cat} id={cat} textValue={cat} className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">{cat}</ListBoxItem>)}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <span className="text-xs font-semibold text-slate-300">Location</span>
                                <Select
                                    id="event-location"
                                    aria-label="Location"
                                    placeholder="Select Location"
                                    className="w-full"
                                    selectedKeys={location ? new Set([location]) : new Set()}
                                    onSelectionChange={(keys) => setLocation(Array.from(keys)[0] || "")}
                                >
                                    <SelectTrigger className="w-full flex items-center justify-between bg-slate-900/50 border border-white/10 rounded-xl px-3 h-11 text-white text-sm">
                                        <SelectValue />
                                        <SelectIndicator />
                                    </SelectTrigger>
                                    <SelectPopover className="bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-1 min-w-[200px]">
                                        <ListBox className="outline-none">
                                            {LOCATIONS.map((loc) => <ListBoxItem key={loc} id={loc} textValue={loc} className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">{loc}</ListBoxItem>)}
                                        </ListBox>
                                    </SelectPopover>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <Input 
                                    id="event-date" 
                                    type="date" 
                                    label="Date" 
                                    labelPlacement="outside" 
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    required 
                                    className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Input 
                                    id="event-price" 
                                    type="number" 
                                    min={0} 
                                    step="any" 
                                    label="Ticket Price ($)" 
                                    labelPlacement="outside" 
                                    placeholder="0.00" 
                                    value={ticketPrice}
                                    onChange={(e) => setTicketPrice(e.target.value)}
                                    required 
                                    className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                                />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Input 
                                    id="event-seats" 
                                    type="number" 
                                    min={1} 
                                    label="Available Capacity" 
                                    labelPlacement="outside" 
                                    placeholder="100" 
                                    value={availableSeats}
                                    onChange={(e) => setAvailableSeats(e.target.value)}
                                    required 
                                    className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" 
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <TextArea 
                                id="event-desc" 
                                label="Detailed Description" 
                                labelPlacement="outside" 
                                placeholder="Outline the detailed schedule, speaker list, and amenities..." 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required 
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none min-h-[120px] text-white text-sm" 
                            />
                        </div>

                        <Button 
                            type="submit" 
                            isLoading={saving}
                            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-11 px-6 shadow-lg shadow-pink-500/10" 
                            radius="lg"
                        >
                            {eventId ? "Update Event" : "Host Event Now"}
                        </Button>
                    </Form>
                </div>
            </Card>
        </div>
    );
};

export default AddEventForm;