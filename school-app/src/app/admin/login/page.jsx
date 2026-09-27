"use client";
import { useState } from "react";

// Admin credentials — hardcoded, not visible to users
const ADMIN_EMAIL    = "admin@unisoft.com";
const ADMIN_PASSWORD = "admin@123";

export default function AdminLoginPage() {
  const [form, setForm]   = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth", "true");
      window.location.href = "/admin";
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">🔐</div>
        <h1><span>Admin</span> Panel</h1>
        <p>Restricted access only</p>

        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: "1.5rem" }}>
          <div className="input-group">
            <input type="email" placeholder="Admin Email" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Admin Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">Access Admin Panel</button>
        </form>
      </div>
    </div>
  );
}
