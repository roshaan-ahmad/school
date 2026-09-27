"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", password: "", confirm: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    if (teachers.find(t => t.email === form.email)) return setError("Email already registered.");

    const newTeacher = {
      id: Date.now().toString(),
      name: form.name,
      email: form.email,
      phone: form.phone,
      subject: form.subject,
      password: form.password,
      role: "teacher",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("teachers", JSON.stringify([...teachers, newTeacher]));
    setDone(true);
  };

  if (done) return (
    <div className="auth-page">
      <div className="auth-card" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
        <h2 style={{ marginBottom: "0.5rem" }}>Registration Submitted!</h2>
        <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem" }}>
          Your account is pending admin verification. You will be able to login once approved.
        </p>
        <Link href="/login" className="auth-btn" style={{ display: "block", textAlign: "center" }}>Back to Login</Link>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h1><span>UniSoft</span> School</h1>
          <p>Teacher Registration</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form register-grid">
          <div className="input-group">
            <input type="text" placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="email" placeholder="Email Address" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="tel" placeholder="Phone Number" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div className="input-group">
            <input type="text" placeholder="Subject (e.g. Physics)" value={form.subject}
              onChange={e => setForm({ ...form, subject: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Password" value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div className="input-group">
            <input type="password" placeholder="Confirm Password" value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          </div>
          {error && <p className="auth-error" style={{ gridColumn: "1/-1" }}>{error}</p>}
          <button type="submit" className="auth-btn register-btn">Submit Registration</button>
        </form>

        <p className="auth-switch">Already have an account? <Link href="/login">Sign in</Link></p>
      </div>
    </div>
  );
}
