"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent as CardBody, CardFooter, Button, Spinner } from "@heroui/react";
import { FaCrown, FaExclamationTriangle, FaCheckCircle, FaArrowRight } from "react-icons/fa";

function PremiumSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

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

        if (res.status === 200 && data.success) {
          setSuccess(true);
        } else {
          setError(data.error || "Failed to verify premium session upgrade.");
        }
      } catch (err) {
        console.error("Premium verify session error:", err);
        setError("Network error occurred during payment verification.");
      } finally {
        setLoading(false);
      }
    }

    verifySession();
  }, [sessionId]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#080c16] px-6 py-12 w-full relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 -z-10" />

      <Card className="w-full max-w-lg border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4">
        {loading && (
          <CardBody className="py-12 flex flex-col items-center justify-center gap-4 text-center">
            <Spinner size="lg" color="secondary" />
            <h1 className="text-xl font-bold text-white mt-2">Verifying Upgrade Session...</h1>
            <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
              We are connecting with Stripe to finalize your premium organizer upgrade. Do not refresh.
            </p>
          </CardBody>
        )}

        {!loading && !success && (
          <CardBody className="py-8 flex flex-col items-center justify-center gap-4 text-center">
            <FaExclamationTriangle className="text-red-500" size={56} />
            <h1 className="text-2xl font-extrabold text-white">Upgrade Verification Failed</h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              {error || "We encountered an error validating your premium payment session. Please contact support."}
            </p>
            <CardFooter className="justify-center pt-6">
              <Button as={Link} href="/dashboard/organizer" className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold h-11 px-6" radius="lg">
                Back to Dashboard
              </Button>
            </CardFooter>
          </CardBody>
        )}

        {!loading && success && (
          <>
            <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center">
              <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500 border border-yellow-500/20 mb-2">
                <FaCrown size={48} className="animate-bounce text-yellow-400" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                Upgrade Successful!
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                You are now a Premium Organizer.
              </p>
            </CardHeader>

            <CardBody className="gap-6 bg-slate-900/40 p-6 rounded-2xl border border-white/5 text-center">
              <div className="space-y-4">
                <FaCheckCircle className="text-green-500 mx-auto" size={40} />
                <h3 className="text-white font-bold text-lg">Unlimited Hosting Unlocked</h3>
                <p className="text-slate-400 text-xs leading-relaxed max-w-md mx-auto">
                  The event limit has been permanently removed from your account. You can now host unlimited events, manage ticket configurations, and track complex ticket sales stats in real time!
                </p>
              </div>
            </CardBody>

            <CardFooter className="flex pt-8 justify-center">
              <Button
                as={Link}
                href="/dashboard/organizer"
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-950 font-extrabold h-11 px-8 shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20"
                radius="lg"
                endContent={<FaArrowRight />}
              >
                Go to Dashboard
              </Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center bg-[#080c16]">
        <Spinner size="lg" color="secondary" />
      </div>
    }>
      <PremiumSuccessContent />
    </Suspense>
  );
}
