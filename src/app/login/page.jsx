"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardContent as CardBody, Input, Button, Label, Form, Spinner } from "@heroui/react";
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import Logo from "@/components/Logo";
import { signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            toast.error("Please fill in all fields.");
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signIn.email({
                email,
                password,
                dontRedirect: true,
            });

            if (error) {
                toast.error(error.message || "Invalid email or password.");
                setLoading(false);
                return;
            }

            if (data?.user) {
                toast.success(`Welcome back, ${data.user.name || "User"}!`);
                
                // Check if redirect query param exists
                const redirect = searchParams.get("redirect");
                if (redirect) {
                    router.push(redirect);
                    return;
                }

                // Default role-based routing
                const role = data.user.role;
                if (role === "admin") {
                    router.push("/dashboard/admin");
                } else if (role === "organizer") {
                    router.push("/dashboard/organizer");
                } else {
                    router.push("/dashboard/attendee");
                }
            } else {
                toast.error("Failed to fetch session. Please try again.");
                setLoading(false);
            }
        } catch (err) {
            console.error("Login page click error:", err);
            toast.error("An unexpected error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4">
            <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
                <Logo />
                <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-pink-500 bg-clip-text text-transparent">
                    Welcome Back
                </h1>
                <p className="text-slate-400 text-sm mt-1">
                    Access your Ticketo account and purchase event tickets.
                </p>
            </CardHeader>
            <CardBody className="gap-4">
                <Form onSubmit={handleLogin} className="space-y-4 w-full">
                    <Label htmlFor="email">
                        Email Address
                    </Label>
                    <Input
                        id="email"
                        placeholder="john@example.com"
                        type="email"
                        labelPlacement="outside"
                        value={email}
                        onValueChange={setEmail}
                        startContent={<FaEnvelope className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        required
                    />
                    <Label htmlFor="password">
                        Password
                    </Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        labelPlacement="outside"
                        value={password}
                        onValueChange={setPassword}
                        startContent={<FaLock className="text-slate-400 text-sm" />}
                        className="w-full bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
                        required
                    />

                    <Button
                        type="submit"
                        isLoading={loading}
                        className="w-full bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-12 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20"
                        radius="lg"
                    >
                        Sign In
                    </Button>
                </Form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-white/5" />
                    <span className="mx-4 text-xs text-slate-500 font-semibold uppercase">Or Login With</span>
                    <div className="flex-grow border-t border-white/5" />
                </div>

                <Button
                    variant="bordered"
                    className="w-full border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-semibold h-11"
                    radius="lg"
                    startContent={<FaGoogle className="text-pink-500" />}
                    onClick={() => toast.info("Google OAuth configured for live setups.")}
                >
                    Google Account
                </Button>

                <p className="text-center text-sm text-slate-400 mt-6">
                    Don't have an account?{" "}
                    <Link href="/register" className="text-pink-500 hover:text-pink-400 font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </CardBody>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex-grow flex items-center justify-center py-12 px-4 bg-[#080c16]">
            <Suspense fallback={<Spinner size="lg" color="secondary" />}>
                <LoginForm />
            </Suspense>
        </div>
    );
}

