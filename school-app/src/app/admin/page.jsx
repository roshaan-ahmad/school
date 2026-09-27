"use client";
import { useEffect, useState } from "react";

export default function AdminOverview() {
  const [stats, setStats] = useState({ teachers: 0, pending: 0, verified: 0, rejected: 0 });

  useEffect(() => {
    const teachers = JSON.parse(localStorage.getItem("teachers") || "[]");
    setStats({
      teachers: teachers.length,
      pending:  teachers.filter(t => t.status === "pending").length,
      verified: teachers.filter(t => t.status === "verified").length,
      rejected: teachers.filter(t => t.status === "rejected").length,
    });
  }, []);

  const cards = [
    { label: "Total Teachers", value: stats.teachers, icon: "👩🏫", color: "#38bdf8" },
    { label: "Pending",        value: stats.pending,  icon: "⏳",   color: "#fbbf24" },
    { label: "Verified",       value: stats.verified, icon: "✅",   color: "#34d399" },
    { label: "Rejected",       value: stats.rejected, icon: "❌",   color: "#f87171" },
  ];

  return (
    <div>
      <h2 className="admin-section-title">Overview</h2>
      <div className="admin-stats">
        {cards.map(c => (
          <div key={c.label} className="admin-stat-card" style={{ "--sc": c.color }}>
            <span className="admin-stat-icon">{c.icon}</span>
            <div>
              <strong>{c.value}</strong>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
