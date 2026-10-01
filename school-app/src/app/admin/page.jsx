"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminOverview() {
  const [stats, setStats] = useState({ total:0, pending:0, verified:0, rejected:0 });

  useEffect(() => {
    const t = JSON.parse(localStorage.getItem("teachers") || "[]");
    setStats({ total:t.length, pending:t.filter(x=>x.status==="pending").length, verified:t.filter(x=>x.status==="verified").length, rejected:t.filter(x=>x.status==="rejected").length });
  }, []);

  const cards = [
    { label:"Total Teachers", value:stats.total,    icon:"fa-chalkboard-user", color:"#38bdf8" },
    { label:"Pending",        value:stats.pending,  icon:"fa-clock",           color:"#fbbf24" },
    { label:"Verified",       value:stats.verified, icon:"fa-circle-check",    color:"#34d399" },
    { label:"Rejected",       value:stats.rejected, icon:"fa-circle-xmark",    color:"#f87171" },
  ];

  return (
    <div>
      <h2 className="admin-section-title">
        <i className="fa-solid fa-chart-pie" style={{marginRight:"10px",color:"#f472b6"}} />Overview
      </h2>
      <div className="admin-stats">
        {cards.map(c => (
          <div key={c.label} className="admin-stat-card" style={{"--sc":c.color}}>
            <div className="admin-stat-icon-wrap" style={{background:c.color+"18"}}>
              <i className={`fa-solid ${c.icon}`} style={{color:c.color}} />
            </div>
            <div>
              <strong>{c.value}</strong>
              <p>{c.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-quick-links">
        <h3>Quick Actions</h3>
        <div className="admin-quick-grid">
          <Link href="/admin/teachers" className="admin-quick-card">
            <i className="fa-solid fa-user-check" />
            <span>Verify Teachers</span>
          </Link>
          <Link href="/admin/users" className="admin-quick-card">
            <i className="fa-solid fa-users" />
            <span>Manage Users</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
