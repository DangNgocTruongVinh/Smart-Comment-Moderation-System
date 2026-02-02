import React, { useState, useEffect } from "react";
import { postComment, getComments } from "../api/commentService";

function CommentForm({ onPosted }) {
    const [username, setUsername] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        if (!username || !content) return;
        setLoading(true);
        try {
            await postComment({ username, content });
            setUsername("");
            setContent("");
            onPosted && onPosted();
        } catch (err) {
            console.error(err);
            alert("Failed to post comment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={submit} style={{ marginBottom: 16 }}>
            <div>
                <input
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <textarea
                    placeholder="Write a comment..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    cols={50}
                />
            </div>
            <div>
                <button type="submit" disabled={loading}>
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </div>
        </form>
    );
}

function CommentList() {
    const [comments, setComments] = useState([]);

    const load = async () => {
        try {
            const data = await getComments("approved");
            setComments(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div>
            <h3>Approved Comments</h3>
            {comments.length === 0 && <div>No comments yet.</div>}
            <ul>
                {comments.map((c) => (
                    <li key={c.id} style={{ marginBottom: 12 }}>
                        <strong>{c.username}</strong>
                        <div>{c.content}</div>
                        <small>{new Date(c.created_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function UserView() {
    const [refreshKey, setRefreshKey] = useState(0);
    return (
        <div style={{ padding: 20 }}>
            <h2>User View</h2>
            <CommentForm onPosted={() => setRefreshKey((k) => k + 1)} />
            <CommentList key={refreshKey} />
        </div>
    );
}
