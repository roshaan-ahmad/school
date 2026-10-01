"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const navItems = [
  { href: "/dashboard-user",                icon: "fa-house",        label: "Dashboard" },
  { href: "/dashboard-user/test-generator", icon: "fa-file-pen",     label: "Test Generator" },
  { href: "/dashboard-user/all-tests",      icon: "fa-list-check",   label: "All Tests" },
  { href: "/dashboard-user/text-generate",  icon: "fa-wand-sparkles",label: "Text Generate" },
  { href: "/dashboard-user/my-account",     icon: "fa-circle-user",  label: "My Account" },
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
      <div className="ud-spinner"><i className="fa-solid fa-circle-notch fa-spin" /></div>
    </div>
  );

  return (
    <div className="ud-shell">
      <style>{`
        .navbar{display:none!important}
        .footer{display:none!important}
        body{overflow:hidden}
      `}</style>

      {sideOpen && <div className="ud-overlay" onClick={() => setSideOpen(false)} />}

      <aside className={`ud-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="ud-sidebar-logo">
          <i className="fa-solid fa-graduation-cap" />
          <span>UniSoft</span>
        </div>

        <div className="ud-user-info">
          <div className="ud-avatar">
            {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
          </div>
          <div className="ud-user-text">
            <strong>{user.name || "Teacher"}</strong>
            <small><i className="fa-solid fa-circle-check" style={{color:"#34d399",marginRight:"4px"}} />{user.role || "teacher"}</small>
          </div>
        </div>

        <nav className="ud-nav">
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              className={`ud-nav-item ${pathname === item.href ? "active" : ""}`}
              onClick={() => setSideOpen(false)}>
              <i className={`fa-solid ${item.icon}`} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="ud-logout" onClick={logout}>
          <i className="fa-solid fa-right-from-bracket" />
          <span>Logout</span>
        </button>
      </aside>

      <div className="ud-main">
        <header className="ud-topbar">
          <button className="ud-hamburger" onClick={() => setSideOpen(!sideOpen)}>
            <i className={`fa-solid ${sideOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
          <h1 className="ud-page-title">
            {navItems.find(n => pathname.startsWith(n.href) && n.href !== "/dashboard-user")?.label
              || (pathname === "/dashboard-user" ? "Dashboard" : "Dashboard")}
          </h1>
          <div className="ud-topbar-right">
            <span className="ud-topbar-user">
              <i className="fa-regular fa-user" style={{marginRight:"6px"}} />
              {user.name || user.email}
            </span>
          </div>
        </header>
        <main className="ud-content">{children}</main>
      </div>
    </div>
  );
}
