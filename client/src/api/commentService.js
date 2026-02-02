import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    timeout: 10000,
});

export async function postComment({ username, content }) {
    const res = await api.post("/comments", { username, content });
    return res.data;
}

export async function getComments(status) {
    const params = {};
    if (status) params.status = status;
    const res = await api.get("/comments", { params });
    return res.data;
}

export async function updateCommentStatus(id, data) {
    const res = await api.put(`/comments/${id}`, data);
    return res.data;
}

export async function deleteComment(id) {
    const res = await api.delete(`/comments/${id}`);
    return res.data;
}
