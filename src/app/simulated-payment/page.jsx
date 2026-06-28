"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardContent as CardBody, CardFooter, Button, Spinner, Input } from "@heroui/react";
import { FaCcStripe, FaLock, FaCreditCard, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";

function SimulatedPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id") || searchParams.get("sessionId");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [sessionDetails, setSessionDetails] = useState(null);

  // Prefilled mock credit card state
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("•••");
  const [cardName, setCardName] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("No session ID found. Cannot initiate payment.");
      setLoading(false);
      return;
    }

    async function fetchSession() {
      try {
        const res = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);
        const data = await res.json();
        
        if (res.status === 200 && data.success) {
          // If already paid, redirect straight to success
          router.replace(
            data.type === "booking"
              ? `/payment-success?session_id=${sessionId}`
              : `/premium-success?session_id=${sessionId}`
          );
        } else if (data.sessionDetails) {
          setSessionDetails(data.sessionDetails);
          setCardName(data.sessionDetails.userEmail.split("@")[0].toUpperCase());
        } else {
          setError(data.error || "Failed to fetch simulated payment details.");
        }
      } catch (err) {
        console.error("Fetch mock session error:", err);
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }

    fetchSession();
  }, [sessionId, router]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!sessionId) return;

    setProcessing(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/verify-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          action: "complete",
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.success) {
        router.push(data.redirectUrl);
      } else {
        setError(data.error || "Simulated payment transaction failed.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Simulated payment submit error:", err);
      setError("Network error occurred during payment processing.");
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#080c16]">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="secondary" />
          <p className="text-slate-400 text-sm">Opening Sandbox Checkout...</p>
        </div>
      </div>
    );
  }

  if (error && !sessionDetails) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#080c16] px-6">
        <Card className="w-full max-w-md border border-red-500/20 bg-slate-950/70 backdrop-blur-xl p-6 text-center">
          <CardBody className="gap-4">
            <h2 className="text-2xl font-bold text-red-500">Checkout Error</h2>
            <p className="text-slate-300 text-sm">{error}</p>
            <Button as={Link} href="/events" className="bg-indigo-600 text-white mt-4 font-semibold">
              Browse Events
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#080c16] px-6 py-12 relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-purple-500/10 rounded-full blur-[120px] -z-10" />

      <Card className="w-full max-w-xl border border-white/5 bg-slate-950/70 backdrop-blur-xl shadow-2xl p-4 md:p-6">
        <CardHeader className="flex flex-col gap-1 items-center pb-6 text-center border-b border-white/5">
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded-full text-xs font-semibold uppercase tracking-wider mb-2">
            <FaLock size={10} />
            Stripe Payment Sandbox
          </div>
          <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FaCcStripe size={28} className="text-indigo-400" />
            Ticketo Secure Checkout
          </h1>
          <p className="text-slate-400 text-xs">
            Review your order details and simulate a safe mock payment.
          </p>
        </CardHeader>

        <form onSubmit={handlePaymentSubmit}>
          <CardBody className="gap-6 py-6">
            {error && (
              <div className="p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs text-center font-medium">
                {error}
              </div>
            )}

            {/* Order Summary */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-white/5 space-y-3">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Order Summary</h3>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="text-white font-bold text-sm line-clamp-1">{sessionDetails?.eventTitle}</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    {sessionDetails?.type === "booking" 
                      ? `${sessionDetails.quantity} Ticket(s) reserved for ${sessionDetails.userEmail}`
                      : `Premium Organizer Account Upgrade`
                    }
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-indigo-400 font-extrabold text-base">
                    ${sessionDetails?.amount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Form inputs */}
            <div className="space-y-4">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider">Simulated Card Details</h3>

              <div className="space-y-3">
                <Input
                  label="Cardholder Name"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  isRequired
                  variant="bordered"
                  classNames={{
                    inputWrapper: "border-white/10 hover:border-white/20 bg-slate-900/50",
                    input: "text-white text-sm"
                  }}
                />

                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <Input
                      label="Card Number"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      isRequired
                      variant="bordered"
                      startContent={<FaCreditCard className="text-slate-500 text-sm" />}
                      classNames={{
                        inputWrapper: "border-white/10 hover:border-white/20 bg-slate-900/50",
                        input: "text-white text-sm"
                      }}
                    />
                  </div>
                  <div>
                    <Input
                      label="Expires"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      isRequired
                      variant="bordered"
                      classNames={{
                        inputWrapper: "border-white/10 hover:border-white/20 bg-slate-900/50",
                        input: "text-white text-sm"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Security notice */}
            <div className="flex items-start gap-2.5 text-[11px] text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-white/5">
              <span className="text-green-500 font-bold uppercase">Sandbox Node:</span>
              <span>
                No actual money is charged. This payment screen simulates Stripe's secure webhook flow. Click pay below to finalize.
              </span>
            </div>
          </CardBody>

          <CardFooter className="flex flex-col sm:flex-row gap-3 border-t border-white/5 pt-6">
            <Button
              as={Link}
              href="/events"
              variant="light"
              className="w-full sm:w-auto text-slate-400 hover:text-white font-semibold"
              startContent={<FaArrowLeft />}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={processing}
              className="w-full sm:flex-1 bg-gradient-to-r from-yellow-500 to-indigo-600 text-white font-bold h-11 px-6 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/20"
              radius="lg"
            >
              {processing ? "Processing simulated payment..." : `Pay $${sessionDetails?.amount?.toFixed(2)} Now`}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default function SimulatedPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[85vh] flex items-center justify-center bg-[#080c16]">
        <Spinner size="lg" color="secondary" />
      </div>
    }>
      <SimulatedPaymentContent />
    </Suspense>
  );
}
