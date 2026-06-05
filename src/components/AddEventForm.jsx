"use client";import { Card, CardHeader, Form, Input, Button, Select, SelectTrigger, SelectValue, SelectIndicator, SelectPopover, ListBox, ListBoxItem, TextArea } from "@heroui/react";

const AddEventForm = () => {
    const CATEGORIES = ["Music", "Tech", "Sports", "Arts", "Business", "Food", "Other"];
    const LOCATIONS = ["New York", "San Francisco", "London", "Dhaka", "Tokyo", "Berlin", "Online"];

    return (
        <div className="mt-6 max-w-3xl">
            <Card className="border border-white/5 bg-slate-900/40 backdrop-blur-xl shadow-2xl rounded-2xl" radius="lg">
                <CardHeader className="flex flex-col gap-1 pb-4 border-b border-white/5 p-6">
                    <h3 className="text-xl font-bold text-white">Host a New Event</h3>
                    <p className="text-slate-400 text-xs">Fill out the detailed event information. Banners and dates are required.</p>
                </CardHeader>
                <div className="p-6">
                    <Form className="space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <Input label="Event Title" labelPlacement="outside" placeholder="e.g. Rock Fest 2026" required className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" />
                            <Input label="Banner Image URL" labelPlacement="outside" placeholder="https://images.unsplash.com/..." required className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                            <div className="flex flex-col gap-2 w-full">
                                <Select
                                    id="event-category"
                                    aria-label="Category"
                                    placeholder="Select Category"
                                    className="w-full"
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
                                <Select
                                    id="event-location"
                                    aria-label="Location"
                                    placeholder="Select Location"
                                    className="w-full"
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
                                <Input id="event-date" type="date" label="Date" labelPlacement="outside" required className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Input id="event-price" type="number" min={0} step="any" label="Ticket Price ($)" labelPlacement="outside" placeholder="0.00" required className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" />
                            </div>
                            <div className="flex flex-col gap-2 w-full">
                                <Input id="event-seats" type="number" min={1} label="Available Capacity" labelPlacement="outside" placeholder="100" required className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 w-full">
                            <TextArea id="event-desc" label="Detailed Description" labelPlacement="outside" placeholder="Outline the detailed schedule, speaker list, and amenities..." required className="w-full bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none min-h-[120px] text-white text-sm" />
                        </div>
                        <Button type="submit" className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-11 px-6 shadow-lg shadow-pink-500/10" radius="lg">Host Event Now</Button>
                    </Form>
                </div>
            </Card>
        </div>
    )
}

export default AddEventForm;