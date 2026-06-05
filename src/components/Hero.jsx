

"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
const Hero = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-indigo-600/15 via-slate-950 to-slate-950 -z-10" />
            <div className="absolute top-1/4 left-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-pink-500/10 to-indigo-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10" />

            <div className="max-w-5xl text-center space-y-8 animate-fade-slide-up">
                <div
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/5 text-pink-400 text-xs font-semibold uppercase tracking-wider animate-fade-slide-up"
                >
                    <FaRocket /> Introducing Ticketo v2.0
                </div>

                <h1
                    className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight animate-fade-slide-up delay-100"
                >
                    Discover Premium Events &{" "}
                    <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent">
                        Book Tickets
                    </span>{" "}
                    Seamlessly
                </h1>

                <p
                    className="text-slate-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed animate-fade-slide-up delay-200"
                >
                    Ticketo links passionate organizers with eager attendees. Browse local festivals, grand music nights, elite business seminars, and everything in between.
                </p>

                <div
                    className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-fade-slide-up delay-300"
                >
                    <Link href="/events">
                        <Button
                            className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-14 px-8 text-md shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all w-full sm:w-auto"
                            radius="full"
                        >
                            Explore Events
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button
                            variant="bordered"
                            className="border-white/10 hover:bg-white/5 hover:border-white/20 text-white font-semibold h-14 px-8 text-md w-full sm:w-auto border-2"
                            radius="full"
                        >
                            Create Organization
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Hero;