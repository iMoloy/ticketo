"use client";

import { useState, useEffect, useCallback } from "react";
import { Avatar, Button, Spinner } from "@heroui/react";
import { FaCommentDots, FaTrash, FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";

export default function CommentsSection({ eventId }) {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const res = await fetch(`/api/comments?eventId=${eventId}`);
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch {
            // silent
        } finally {
            setLoading(false);
        }
    }, [eventId]);

    useEffect(() => {
        fetchComments();
    }, [fetchComments]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        if (!user) {
            toast.error("Please login to comment.");
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch("/api/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ eventId, text }),
            });
            const data = await res.json();
            if (res.ok) {
                setText("");
                setComments((prev) => [data.comment, ...prev]);
                toast.success("Comment posted!");
            } else {
                toast.error(data.error || "Failed to post comment.");
            }
        } catch {
            toast.error("Network error.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            const res = await fetch("/api/comments", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ commentId }),
            });
            if (res.ok) {
                setComments((prev) => prev.filter((c) => c._id !== commentId));
                toast.success("Comment deleted.");
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to delete comment.");
            }
        } catch {
            toast.error("Network error.");
        }
    };

    const roleBadge = (role) => {
        if (role === "organizer") return <span className="text-[10px] font-bold uppercase bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-0.5 rounded-full">Organizer</span>;
        if (role === "admin") return <span className="text-[10px] font-bold uppercase bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-0.5 rounded-full">Admin</span>;
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <FaCommentDots className="text-indigo-400 text-xl" />
                <h2 className="text-2xl font-bold text-white">Q&amp;A / Comments</h2>
                <span className="text-xs text-slate-500 bg-white/5 border border-white/10 px-2 py-1 rounded-full">
                    {comments.length}
                </span>
            </div>

            {/* Comment Input */}
            <form onSubmit={handleSubmit} className="flex gap-3 items-start">
                <Avatar
                    src={user?.image}
                    name={user?.name || "?"}
                    size="sm"
                    className="bg-indigo-600 text-white shrink-0 mt-1"
                />
                <div className="flex-1 flex gap-2">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={user ? "Ask a question or leave a comment..." : "Login to join the conversation..."}
                        disabled={!user || submitting}
                        maxLength={600}
                        rows={2}
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none transition-colors disabled:opacity-50"
                    />
                    <Button
                        type="submit"
                        isLoading={submitting}
                        isDisabled={!user || !text.trim()}
                        className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-bold self-end"
                        radius="lg"
                        isIconOnly
                    >
                        <FaPaperPlane />
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            {loading ? (
                <div className="flex justify-center py-8">
                    <Spinner color="secondary" />
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-10 text-slate-600">
                    <FaCommentDots className="text-4xl mx-auto mb-3 text-slate-800" />
                    <p>No comments yet. Start the conversation!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {comments.map((comment) => (
                        <div
                            key={comment._id}
                            className="flex gap-3 p-4 bg-white/[0.03] border border-white/5 rounded-2xl group hover:border-white/10 transition-colors"
                        >
                            <Avatar
                                src={comment.userImage}
                                name={comment.userName}
                                size="sm"
                                className="bg-indigo-600 text-white shrink-0"
                            />
                            <div className="flex-1 min-w-0 space-y-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-white">{comment.userName}</span>
                                    {roleBadge(comment.userRole)}
                                    <span className="text-xs text-slate-600">
                                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                            month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                                        })}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed break-words">{comment.text}</p>
                            </div>
                            {/* Delete button — own comment or admin */}
                            {user && (user.email === comment.userEmail || user.role === "admin") && (
                                <button
                                    onClick={() => handleDelete(comment._id)}
                                    className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all shrink-0 self-start mt-0.5"
                                    title="Delete comment"
                                >
                                    <FaTrash className="text-xs" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
