"use client";

import { useState } from "react";
import { Button } from "@heroui/react";
import {
    FaShare,
    FaFacebook,
    FaTwitter,
    FaWhatsapp,
    FaLink,
    FaCheck,
    FaTimes,
} from "react-icons/fa";

export default function ShareButton({ title, eventId }) {
    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const eventUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/events/${eventId}`
            : `https://ticketo-client.vercel.app/events/${eventId}`;

    const encodedUrl = encodeURIComponent(eventUrl);
    const encodedTitle = encodeURIComponent(`🎟️ ${title} — Book your ticket on Ticketo!`);

    const shareLinks = [
        {
            label: "Facebook",
            icon: FaFacebook,
            color: "text-blue-500",
            bg: "hover:bg-blue-500/10 border-blue-500/20",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            label: "Twitter / X",
            icon: FaTwitter,
            color: "text-sky-400",
            bg: "hover:bg-sky-400/10 border-sky-400/20",
            href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
        {
            label: "WhatsApp",
            icon: FaWhatsapp,
            color: "text-green-400",
            bg: "hover:bg-green-400/10 border-green-400/20",
            href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
    ];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(eventUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const el = document.createElement("textarea");
            el.value = eventUrl;
            document.body.appendChild(el);
            el.select();
            document.execCommand("copy");
            document.body.removeChild(el);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="relative">
            <Button
                onPress={() => setOpen((prev) => !prev)}
                variant="flat"
                className="bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 font-semibold"
                startContent={<FaShare className="text-pink-400" />}
                radius="lg"
            >
                Share
            </Button>

            {open && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setOpen(false)}
                    />

                    {/* Dropdown Panel */}
                    <div className="absolute right-0 top-12 z-40 w-60 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="flex items-center justify-between px-2 pb-2 border-b border-white/5">
                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Share Event</p>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-600 hover:text-white transition-colors"
                            >
                                <FaTimes className="text-xs" />
                            </button>
                        </div>

                        {shareLinks.map(({ label, icon: Icon, color, bg, href }) => (
                            <a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent ${bg} transition-all duration-150 group`}
                            >
                                <Icon className={`text-lg ${color}`} />
                                <span className="text-sm text-slate-300 group-hover:text-white font-medium">{label}</span>
                            </a>
                        ))}

                        {/* Copy Link */}
                        <button
                            onClick={handleCopy}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-transparent hover:bg-indigo-500/10 hover:border-indigo-500/20 transition-all duration-150 group"
                        >
                            {copied ? (
                                <FaCheck className="text-lg text-green-400" />
                            ) : (
                                <FaLink className="text-lg text-indigo-400" />
                            )}
                            <span className={`text-sm font-medium transition-colors ${copied ? "text-green-400" : "text-slate-300 group-hover:text-white"}`}>
                                {copied ? "Link Copied!" : "Copy Link"}
                            </span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
