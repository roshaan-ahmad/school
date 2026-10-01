"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const cards = [
  { icon: "fa-file-pen",      label: "Test Generator", desc: "Generate custom exam papers instantly", href: "/dashboard-user/test-generator", color: "#38bdf8" },
  { icon: "fa-list-check",    label: "All Tests",      desc: "View & edit all your saved tests",      href: "/dashboard-user/all-tests",      color: "#818cf8" },
  { icon: "fa-wand-sparkles", label: "Text Generate",  desc: "AI powered content generation",         href: "/dashboard-user/text-generate",  color: "#a78bfa" },
  { icon: "fa-file-lines",    label: "Past Papers",    desc: "Browse previous exam papers",            href: "/past-papers",                   color: "#f472b6" },
  { icon: "fa-circle-user",   label: "My Account",     desc: "Manage your profile settings",          href: "/dashboard-user/my-account",     color: "#34d399" },
];

export default function UserDashboardHome() {
  const [user, setUser] = useState(null);
  useEffect(() => { const u = localStorage.getItem("user"); if (u) setUser(JSON.parse(u)); }, []);

  return (
    <div className="ud-home">
      <div className="ud-welcome">
        <div className="ud-welcome-text">
          <h2>Welcome back, <span>{user?.name || "Teacher"}</span></h2>
          <p>What would you like to do today?</p>
        </div>
        <div className="ud-welcome-badge">
          <i className="fa-solid fa-star" /> Verified Teacher
        </div>
      </div>

      <div className="ud-cards">
        {cards.map(c => (
          <Link key={c.href} href={c.href} className="ud-card" style={{"--card-color": c.color}}>
            <div className="ud-card-icon-wrap" style={{background: c.color+"18", border: `1px solid ${c.color}33`}}>
              <i className={`fa-solid ${c.icon}`} style={{color: c.color}} />
            </div>
            <h3>{c.label}</h3>
            <p>{c.desc}</p>
            <span className="ud-card-arrow" style={{color: c.color}}>
              <i className="fa-solid fa-arrow-right" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
