"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Card, CardHeader, CardContent as CardBody, CardFooter, Button, Spinner } from "@heroui/react";
import { FaCheckCircle, FaExclamationTriangle, FaArrowRight } from "react-icons/fa";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (!sessionId) {
            setError("No session ID was provided for verification.");
            setLoading(false);
            return;
        }

        async function verifySession() {
            try {
                const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
                const data = await res.json();

                if (res.status === 200 && data.success && data.type === "booking") {
                    setBooking(data.booking);
                    setSuccess(true);
                } else {
                    setError(data.error || "Failed to verify payment session.");
                }
            } catch (err) {
                console.error("Payment verify session error:", err);
                setError("Network error occurred during payment verification.");
            } finally {
                setLoading(false);
            }
        }

        verifySession();
    }, [sessionId]);

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#080c16] px-6 py-12 w-full">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />

            <Card className="w-full max-w-lg border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4">
                {loading && (
                    <CardBody className="py-12 flex flex-col items-center justify-center gap-4 text-center">
                        <Spinner size="lg" color="secondary" />
                        <h1 className="text-xl font-bold text-white mt-2">Verifying Payment Session...</h1>
                        <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                            We are connecting with Stripe to finalize your ticket reservations. Do not refresh or exit.
                        </p>
                    </CardBody>
                )}

                {!loading && !success && (
                    <CardBody className="py-8 flex flex-col items-center justify-center gap-4 text-center">
                        <FaExclamationTriangle className="text-red-500" size={56} />
                        <h1 className="text-2xl font-extrabold text-white">Verification Failed</h1>
                        <p className="text-slate-400 text-sm leading-relaxed max-sm:text-xs max-w-sm">
                            {error || "We encountered an error validating your Stripe checkout session. Please contact support."}
                        </p>
                        <CardFooter className="justify-center pt-6">
                            <Button as={Link} href="/events" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6" radius="lg">
                                Return to Events
                            </Button>
                        </CardFooter>
                    </CardBody>
                )}

                {!loading && success && (
                    <>
                        <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
                            <div className="p-3 bg-green-500/10 rounded-full text-green-500 border border-green-500/20 mb-2">
                                <FaCheckCircle size={48} className="animate-bounce" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-green-400 bg-clip-text text-transparent">
                                Payment Successful!
                            </h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Your seats are reserved. Here are your booking details.
                            </p>
                        </CardHeader>

                        <CardBody className="gap-6 bg-slate-900/40 p-6 rounded-2xl border border-white/5">
                            <div className="space-y-3">
                                <h3 className="text-white font-bold text-lg line-clamp-1">{booking?.eventTitle}</h3>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Attendee Email:</span>
                                    <span className="text-white font-semibold">{booking?.attendeeEmail}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Reserved Seats:</span>
                                    <span className="text-white font-semibold">{booking?.quantity} Ticket(s)</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Total Amount Paid:</span>
                                    <span className="text-green-400 font-extrabold">${booking?.amount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs text-slate-400">
                                    <span>Transaction ID:</span>
                                    <span className="text-indigo-400 font-semibold truncate max-w-[200px]">{booking?.transactionId}</span>
                                </div>
                            </div>
                        </CardBody>

                        <CardFooter className="flex flex-col sm:flex-row gap-3 pt-8 justify-center">
                            <Button
                                as={Link}
                                href="/dashboard/attendee/tickets"
                                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold h-11 px-6 shadow-lg shadow-pink-500/10 hover:shadow-pink-500/20"
                                radius="lg"
                                endContent={<FaArrowRight />}
                            >
                                View My Tickets
                            </Button>
                            <Button
                                as={Link}
                                href="/events"
                                variant="bordered"
                                className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-white font-semibold h-11 px-6"
                                radius="lg"
                            >
                                Browse More Events
                            </Button>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center bg-[#080c16] px-6 py-12">
                <Spinner size="lg" color="secondary" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
