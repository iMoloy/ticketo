"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Button, Input } from "@heroui/react";
import { FaCheck } from "react-icons/fa";
import { useSession } from "@/lib/auth-client";
import { toast } from "react-toastify";

export default function BookingWidget({ eventId, ticketPrice = 49.99, availableSeats = 120 }) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isSoldOut = availableSeats <= 0;

  const handleBook = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${eventId}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "booking",
          eventId,
          quantity,
        }),
      });

      const data = await res.json();
      if (res.status === 200 && data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create checkout session.");
        setError(data.error || "Failed to create checkout session.");
        setLoading(false);
      }
    } catch (err) {
      console.error("BookingWidget click error:", err);
      toast.error("Network error occurred. Please try again.");
      setError("Network error occurred. Please try again.");
      setLoading(false);
    }
  };


  const handleQuantityChange = (e) => {
    const val = parseInt(e.target.value);
    if (isNaN(val) || val < 1) {
      setQuantity(1);
    } else if (val > availableSeats) {
      setQuantity(availableSeats);
    } else {
      setQuantity(val);
    }
  };

  const totalAmount = ticketPrice * quantity;

  return (
    <Card className="glass border-white/5 sticky top-24" radius="lg">
      <div className="p-8 space-y-6">
        <h3 className="text-xl font-bold text-white">Booking Details</h3>

        {error && (
          <div className="p-2.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-xl text-xs text-center font-medium">
            {error}
          </div>
        )}

        {/* Stat list */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Ticket Price:</span>
            <span className="text-pink-400 font-extrabold text-xl">
              {ticketPrice === 0 ? "Free" : `$${ticketPrice.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Available Seats:</span>
            <span className="text-white font-bold">
              {isSoldOut ? (
                <span className="text-red-500 uppercase">Sold Out</span>
              ) : (
                `${availableSeats} Seats Left`
              )}
            </span>
          </div>
        </div>

        {!isSoldOut && (
          <>
            {/* Quantity selector */}
            <Input
              type="number"
              label="Quantity"
              labelPlacement="outside"
              value={quantity.toString()}
              onChange={handleQuantityChange}
              min={1}
              max={availableSeats}
              className="bg-slate-900/50 border-white/10 hover:border-pink-500/50 focus-within:!border-pink-500"
            />

            <div className="flex justify-between items-center text-sm font-semibold text-white pt-2">
              <span>Total Amount:</span>
              <span className="text-white text-lg">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </>
        )}

        <Button
          isDisabled={isSoldOut}
          isLoading={loading}
          onClick={handleBook}
          className={`w-full font-bold h-12 shadow-lg ${isSoldOut
            ? "bg-slate-800 text-slate-500 shadow-none cursor-not-allowed"
            : "bg-gradient-to-r from-pink-500 to-indigo-600 text-white shadow-pink-500/10 hover:shadow-pink-500/20"
            }`}
          radius="lg"
        >
          {isSoldOut ? "Sold Out" : user ? "Book Ticket Now" : "Login to Book"}
        </Button>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 text-center justify-center pt-2">
          <FaCheck className="text-green-500 shrink-0" />
          <span>Instant confirmation | Vetted organizers</span>
        </div>
      </div>
    </Card>
  );
}
