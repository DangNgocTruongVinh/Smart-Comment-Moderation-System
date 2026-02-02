import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import UserView from "./pages/UserView";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
    return (
        <Router>
            <nav style={{ padding: 12, borderBottom: "1px solid #eee" }}>
                <Link to="/">User View</Link>
                <span style={{ margin: "0 8px" }}>|</span>
                <Link to="/admin">Admin Dashboard</Link>
            </nav>
            <Routes>
                <Route path="/" element={<UserView />} />
                <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
        </Router>
    );
}
