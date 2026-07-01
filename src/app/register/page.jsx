"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent as CardBody, Input, Button, Label, Form, Select, SelectTrigger, SelectValue, SelectIndicator, SelectPopover, ListBox, ListBoxItem, Spinner } from "@heroui/react";
import { FaUser, FaEnvelope, FaLock, FaImage, FaGoogle } from "react-icons/fa";
import Logo from "@/components/Logo";
import { signUp } from "@/lib/auth-client";
import { toast } from "react-toastify";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("attendee");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setLoading(true);

        try {
            // Generate avatar fallback if image URL is empty
            const avatarUrl = image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&bold=true`;

            const { data, error } = await signUp.email({
                email,
                password,
                name,
                image: avatarUrl,
                additionalFields: {
                    role,
                    isPremium: false,
                    isBlocked: false,
                },
                callbackURL: role === "organizer" ? "/dashboard/organizer" : "/dashboard/attendee",
            });

            if (error) {
                toast.error(error.message || "Failed to create account.");
                setLoading(false);
                return;
            }

            if (data?.user) {
                toast.success("Account created successfully!");
                
                // Redirect query param check
                const redirect = searchParams.get("redirect");
                if (redirect) {
                    router.push(redirect);
                    return;
                }

                // Default role-based routing
                if (role === "organizer") {
                    router.push("/dashboard/organizer");
                } else {
                    router.push("/dashboard/attendee");
                }
            } else {
                toast.error("Session creation failed. Please log in.");
                router.push("/login");
            }
        } catch (err) {
            console.error("Register page click error:", err);
            toast.error("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-lg border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4">
            <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
                <Logo />
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent">
                    Create an Account
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                    Join Ticketo to book premium events or host your own organization.
                </p>
            </CardHeader>
            <CardBody className="gap-4">
                <Form onSubmit={handleRegister} className="space-y-4 w-full">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        placeholder="John Doe"
                        labelPlacement="outside"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        startContent={<FaUser className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        required
                    />
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        labelPlacement="outside"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        startContent={<FaEnvelope className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        required
                    />
                    <Label htmlFor="image">Profile Image URL</Label>
                    <Input
                        id="image"
                        placeholder="https://example.com/avatar.jpg"
                        labelPlacement="outside"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        startContent={<FaImage className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                    />

                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        labelPlacement="outside"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        startContent={<FaLock className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        required
                    />

                    <div className="flex flex-col gap-2 w-full">
                        <Label htmlFor="role" className="text-sm font-semibold text-slate-300">Select Role</Label>
                        <Select
                            id="role"
                            aria-label="Select Role"
                            placeholder="Select Role"
                            className="w-full"
                        >
                            <SelectTrigger className="w-full flex items-center justify-between bg-slate-900/50 border border-white/10 rounded-xl px-3 h-11 text-white text-sm">
                                <SelectValue>
                                    {role === "organizer" ? "Organizer (Create & Host Events)" : "Attendee (Browse & Book Tickets)"}
                                </SelectValue>
                                <SelectIndicator />
                            </SelectTrigger>
                            <SelectPopover className="bg-slate-950 border border-white/10 rounded-xl shadow-2xl p-1 min-w-[200px]">
                                <ListBox 
                                    className="outline-none"
                                    selectionMode="single"
                                    selectedKeys={new Set([role])}
                                    onSelectionChange={(keys) => {
                                        const val = Array.from(keys)[0];
                                        if (val) setRole(val);
                                    }}
                                >
                                    <ListBoxItem key="attendee" id="attendee" textValue="Attendee" className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">Attendee (Browse & Book Tickets)</ListBoxItem>
                                    <ListBoxItem key="organizer" id="organizer" textValue="Organizer" className="p-2 text-white hover:bg-pink-500/20 rounded-lg cursor-pointer">Organizer (Create & Host Events)</ListBoxItem>
                                </ListBox>
                            </SelectPopover>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-12 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20"
                        radius="lg"
                    >
                        Create Account
                    </Button>
                </Form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="mx-4 text-xs text-slate-500 font-semibold uppercase">Or Sign Up With</span>
                    <div className="flex-grow border-t border-white/5" />
                </div>

                <Button
                    variant="bordered"
                    className="w-full border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-semibold h-11"
                    radius="lg"
                    startContent={<FaGoogle className="text-pink-500" />}
                    onClick={async () => {
                        try {
                            await signIn.social({
                                provider: "google",
                                callbackURL: "/dashboard",
                            });
                        } catch (err) {
                            console.error("Google sign up error:", err);
                            toast.error("Google login redirection failed.");
                        }
                    }}
                >
                    Google OAuth
                </Button>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-pink-500 hover:text-pink-400 font-semibold hover:underline">
                        Log In
                    </Link>
                </p>
            </CardBody>
        </Card>
    );
}

export default function RegisterPage() {
    return (
        <div className="flex-grow flex items-center justify-center py-12 px-4 bg-[#080c16]">
            <Suspense fallback={<Spinner size="lg" color="secondary" />}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}

