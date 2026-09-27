"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function UserDashboardHome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const cards = [
    { icon: "📝", label: "Test Generator", desc: "Generate custom exam papers", href: "/dashboard-user/test-generator", color: "#38bdf8" },
    { icon: "🤖", label: "Text Generate",  desc: "AI powered text generation",  href: "/dashboard-user/text-generate",  color: "#a78bfa" },
    { icon: "📄", label: "Past Papers",    desc: "Browse previous exam papers",  href: "/past-papers",                   color: "#f472b6" },
    { icon: "👤", label: "My Account",     desc: "Manage your profile",          href: "/dashboard-user/my-account",     color: "#34d399" },
  ];

  return (
    <div className="ud-home">
      <div className="ud-welcome">
        <h2>Welcome back, <span>{user?.name || "Student"}</span> 👋</h2>
        <p>What would you like to do today?</p>
      </div>

      <div className="ud-cards">
        {cards.map((c) => (
          <Link key={c.href} href={c.href} className="ud-card" style={{ "--card-color": c.color }}>
            <div className="ud-card-icon">{c.icon}</div>
            <h3>{c.label}</h3>
            <p>{c.desc}</p>
            <span className="ud-card-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
