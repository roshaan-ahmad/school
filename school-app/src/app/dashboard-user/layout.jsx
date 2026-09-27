"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard-user",            icon: "🏠", label: "Dashboard" },
  { href: "/dashboard-user/test-generator", icon: "📝", label: "Test Generator" },
  { href: "/dashboard-user/text-generate",  icon: "🤖", label: "Text Generate" },
  { href: "/dashboard-user/my-account",     icon: "👤", label: "My Account" },
];

export default function UserDashboardLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [user, setUser]         = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (!u) { router.push("/login"); return; }
    setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return (
    <div className="ud-loading">
      <div className="loader" />
    </div>
  );

  return (
    <div className="ud-shell">
      {/* hide global navbar & footer */}
      <style>{`
        .navbar { display: none !important; }
        .footer { display: none !important; }
        body { overflow: hidden; }
      `}</style>

      {/* ── Mobile overlay ── */}
      {sideOpen && <div className="ud-overlay" onClick={() => setSideOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={`ud-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="ud-sidebar-logo">
          <span>UniSoft</span> School
        </div>

        <div className="ud-user-info">
          <div className="ud-avatar">{user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}</div>
          <div>
            <strong>{user.name || "User"}</strong>
            <small>{user.role || "student"}</small>
          </div>
        </div>

        <nav className="ud-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`ud-nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSideOpen(false)}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <button className="ud-logout" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* ── Main area ── */}
      <div className="ud-main">
        {/* Top bar */}
        <header className="ud-topbar">
          <button className="ud-hamburger" onClick={() => setSideOpen(!sideOpen)}>
            <span /><span /><span />
          </button>
          <h1 className="ud-page-title">
            {navItems.find((n) => n.href === pathname)?.label || "Dashboard"}
          </h1>
          <div className="ud-topbar-right">
            <span className="ud-topbar-user">{user.name || user.email}</span>
          </div>
        </header>

        <main className="ud-content">
          {children}
        </main>
      </div>
    </div>
  );
}
