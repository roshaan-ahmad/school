"use client";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirm: "", role: "student", classNo: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return alert("Passwords do not match");
    alert(`Account created for ${form.name}`);
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-wide">
        <div className="auth-header">
          <h1><span>UniSoft</span> School</h1>
          <p>Create your account</p>
        </div>

        <div className="role-tabs">
          {["student", "teacher", "parent"].map((r) => (
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

        <form onSubmit={handleSubmit} className="auth-form register-grid">
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          {form.role === "student" && (
            <div className="input-group">
              <select
                value={form.classNo}
                onChange={(e) => setForm({ ...form, classNo: e.target.value })}
                required
              >
                <option value="">Select Class</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12</option>
              </select>
            </div>
          )}
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="auth-btn register-btn">Create Account</button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link href="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  );
}
