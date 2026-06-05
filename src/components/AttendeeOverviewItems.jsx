"use client";

import { Card, CardContent as CardBody, CardHeader, Input, Button, Form, TextArea } from "@heroui/react";
import { FaDollarSign, FaTicketAlt, FaCalendarDay } from "react-icons/fa";

const AttendeeOverviewItems = () => {
    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="glass border-white/5" radius="lg">
                    <CardBody className="p-6 flex flex-row items-center justify-between">
                        <div className="space-y-1">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Total Spent</span>
                            <h2 className="text-3xl font-extrabold text-white">
                                $298.00
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
                                4
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
                                2
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
                    <Form className="space-y-4 w-full">
                        <Input
                            label="Full Name"
                            labelPlacement="outside"
                            placeholder="John Doe"
                            className="bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        />

                        <Input
                            label="Avatar URL"
                            labelPlacement="outside"
                            placeholder="https://api.dicebear.com/7.x/adventurer/svg?seed=John"
                            className="bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        />

                        <TextArea
                            id="bio"
                            label="Biography"
                            labelPlacement="outside"
                            placeholder="Tell us about yourself..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-xl focus:outline-none min-h-[100px] text-white text-sm"
                        />

                        <Button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
                            radius="lg"
                        >
                            Save Profile
                        </Button>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default AttendeeOverviewItems;