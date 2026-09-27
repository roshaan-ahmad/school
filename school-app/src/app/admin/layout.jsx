"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const adminNav = [
  { href: "/admin",           icon: "📊", label: "Overview" },
  { href: "/admin/teachers",  icon: "👩‍🏫", label: "Teachers" },
  { href: "/admin/users",     icon: "👥", label: "Users" },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    const auth = localStorage.getItem("adminAuth");
    if (!auth) router.push("/admin/login");
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = () => {
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  return (
    <div className="ud-shell">
      <style>{`
        .navbar { display: none !important; }
        .footer { display: none !important; }
        body { overflow: hidden; }
      `}</style>

      {sideOpen && <div className="ud-overlay" onClick={() => setSideOpen(false)} />}

      <aside className={`ud-sidebar admin-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="ud-sidebar-logo">
          <span>Admin</span> Panel
        </div>

        <div className="ud-user-info">
          <div className="ud-avatar" style={{ background: "linear-gradient(135deg,#f472b6,#a78bfa)" }}>A</div>
          <div>
            <strong>Administrator</strong>
            <small>Super Admin</small>
          </div>
        </div>

        <nav className="ud-nav">
          {adminNav.map(item => (
            <Link key={item.href} href={item.href}
              className={`ud-nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSideOpen(false)}>
              <span>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>

        <button className="ud-logout" onClick={logout}>
          <span>🚪</span> Logout
        </button>
      </aside>

      <div className="ud-main">
        <header className="ud-topbar">
          <button className="ud-hamburger" onClick={() => setSideOpen(!sideOpen)}>
            <span /><span /><span />
          </button>
          <h1 className="ud-page-title">
            {adminNav.find(n => n.href === pathname)?.label || "Admin"}
          </h1>
        </header>
        <main className="ud-content">{children}</main>
      </div>
    </div>
  );
}
