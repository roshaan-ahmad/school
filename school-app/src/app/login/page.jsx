"use client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Get teachers from localStorage
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    const teacher = teachers.find(t => t.email === form.email && t.password === form.password);

    if (!teacher) return setError("Invalid email or password.");
    if (teacher.status === "pending") return setError("Your account is pending admin verification. Please wait for approval.");
    if (teacher.status === "rejected") return setError("Your account has been rejected. Contact admin.");

    // verified teacher
    localStorage.setItem("user", JSON.stringify({ name: teacher.name, email: teacher.email, role: "teacher", id: teacher.id }));
    window.location.href = "/dashboard-user";
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1><span>UniSoft</span> School</h1>
          <p>Teacher Login</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <input type="email" placeholder="Email address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-btn">Sign In</button>
        </form>

        <p className="auth-switch">
          Don&apos;t have an account? <Link href="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}
