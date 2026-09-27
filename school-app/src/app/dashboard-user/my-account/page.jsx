"use client";
import { useEffect, useState } from "react";

export default function MyAccount() {
  const [user, setUser] = useState(null);
  useEffect(() => { const u = localStorage.getItem("user"); if (u) setUser(JSON.parse(u)); }, []);
  if (!user) return null;
  return (
    <div className="ud-account">
      <h2>My Account</h2>
      <div className="ud-account-card">
        <div className="ud-account-avatar">{user.name?.[0]?.toUpperCase() || "U"}</div>
        <div className="ud-account-info">
          <div className="ud-account-row"><label>Name</label><span>{user.name || "—"}</span></div>
          <div className="ud-account-row"><label>Email</label><span>{user.email || "—"}</span></div>
          <div className="ud-account-row"><label>Role</label><span className="ud-role-badge">{user.role || "student"}</span></div>
        </div>
      </div>
    </div>
  );
}
