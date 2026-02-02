import React, { useState, useEffect } from "react";
import { getComments, updateCommentStatus, deleteComment } from "../api/commentService";

export default function AdminDashboard() {
    const [filter, setFilter] = useState("pending");
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async (f) => {
        setLoading(true);
        try {
            const data = await getComments(f);
            setComments(data);
        } catch (err) {
            console.error(err);
            alert("Failed to load comments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load(filter);
    }, [filter]);

    const onApprove = async (id) => {
        try {
            await updateCommentStatus(id, { status: "approved" });
            setComments((cs) => cs.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to approve");
        }
    };

    const onDelete = async (id) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await deleteComment(id);
            setComments((cs) => cs.filter((c) => c.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Admin Dashboard</h2>
            <div style={{ marginBottom: 12 }}>
                <button onClick={() => setFilter("pending")} disabled={filter === "pending"}>
                    Chờ duyệt (Pending)
                </button>
                <button onClick={() => setFilter("rejected")} disabled={filter === "rejected"} style={{ marginLeft: 8 }}>
                    Đã từ chối (Rejected)
                </button>
            </div>

            {loading && <div>Loading...</div>}

            <ul>
                {comments.map((c) => (
                    <li key={c.id} style={{ marginBottom: 12, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>
                        <div><strong>{c.username}</strong></div>
                        <div>{c.content}</div>
                        <div style={{ fontSize: 12, color: "#666" }}>
                            Predicted: {c.predicted_label} ({c.confidence ? Math.round(c.confidence * 100) : 0}%)
                        </div>
                        <div style={{ marginTop: 6 }}>
                            <button onClick={() => onApprove(c.id)}>Duyệt (Approve)</button>
                            <button onClick={() => onDelete(c.id)} style={{ marginLeft: 8 }}>Xóa (Delete)</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
