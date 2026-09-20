"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "", role: "student" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logging in as ${form.role}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1><span>UniSoft</span> School</h1>
          <p>Sign in to your account</p>
        </div>

        <div className="role-tabs">
          {["student", "teacher", "admin"].map((r) => (
            <button
              key={r}
              className={`role-tab ${form.role === r ? "active" : ""}`}
              onClick={() => setForm({ ...form, role: r })}
              type="button"
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input
              type="email"
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="auth-options">
            <label><input type="checkbox" /> Remember me</label>
            <Link href="#">Forgot password?</Link>
          </div>
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
