"use client";

import { useState, useEffect, useCallback } from "react";
import { Button, Textarea as TextArea, Avatar, Spinner } from "@heroui/react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

function StarPicker({ value, onChange }) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    className="text-2xl transition-transform hover:scale-110 focus:outline-none"
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                    {star <= value ? (
                        <FaStar className="text-yellow-400" />
                    ) : (
                        <FaRegStar className="text-slate-500" />
                    )}
                </button>
            ))}
        </div>
    );
}

function StarDisplay({ rating, size = "sm" }) {
    const textSize = size === "lg" ? "text-xl" : "text-sm";
    return (
        <div className={`flex gap-0.5 ${textSize}`}>
            {[1, 2, 3, 4, 5].map((star) => (
                <span key={star}>
                    {star <= Math.round(rating) ? (
                        <FaStar className="text-yellow-400" />
                    ) : (
                        <FaRegStar className="text-slate-600" />
                    )}
                </span>
            ))}
        </div>
    );
}

export default function ReviewSection({ eventId }) {
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [totalReviews, setTotalReviews] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    const fetchReviews = useCallback(async () => {
        try {
            const res = await fetch(`/api/reviews?eventId=${eventId}`);
            if (!res.ok) return;
            const data = await res.json();
            setReviews(data.reviews || []);
            setAvgRating(data.avgRating);
            setTotalReviews(data.totalReviews || 0);
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a star rating.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, rating, comment }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error || "Failed to submit review.");
                return;
            }
            toast.success("Review submitted! Thank you.");
            setRating(0);
            setComment("");
            fetchReviews();
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Reviews</h2>
                {avgRating && (
                    <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-2xl">
                        <span className="text-3xl font-extrabold text-yellow-400">{avgRating}</span>
                        <div className="flex flex-col gap-1">
                            <StarDisplay rating={parseFloat(avgRating)} size="sm" />
                            <span className="text-xs text-slate-400">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Submit Review Form */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Write a Review</h3>
                <p className="text-xs text-slate-500">Only attendees with a confirmed booking can review.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs text-slate-400">Your Rating</label>
                        <StarPicker value={rating} onChange={setRating} />
                    </div>
                    <TextArea
                        placeholder="Share your experience... (optional)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        minRows={3}
                        maxLength={500}
                        className="w-full bg-slate-900/50 border-white/10"
                    />
                    <Button
                        type="submit"
                        isLoading={submitting}
                        className="bg-gradient-to-r from-pink-500 to-indigo-600 text-white font-bold"
                        radius="lg"
                    >
                        Submit Review
                    </Button>
                </form>
            </div>

            {/* Reviews List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Spinner color="secondary" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                    <FaRegStar className="text-4xl mx-auto mb-3 text-slate-700" />
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div
                            key={review._id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        src={review.userImage}
                                        name={review.userName}
                                        size="sm"
                                        className="bg-indigo-600 text-white"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-white">{review.userName}</p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(review.createdAt).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <StarDisplay rating={review.rating} />
                            </div>
                            {review.comment && (
                                <p className="text-sm text-slate-300 leading-relaxed">{review.comment}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
