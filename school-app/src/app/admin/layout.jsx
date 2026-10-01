"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const adminNav = [
  { href: "/admin",          icon: "fa-chart-pie",    label: "Overview" },
  { href: "/admin/teachers", icon: "fa-chalkboard-user", label: "Teachers" },
  { href: "/admin/users",    icon: "fa-users",        label: "Users" },
];

export default function AdminLayout({ children }) {
  const router   = useRouter();
  const pathname = usePathname();
  const [sideOpen, setSideOpen] = useState(false);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    if (!localStorage.getItem("adminAuth")) router.push("/admin/login");
  }, [pathname]);

  if (pathname === "/admin/login") return <>{children}</>;

  const logout = () => { localStorage.removeItem("adminAuth"); router.push("/admin/login"); };

  return (
    <div className="ud-shell">
      <style>{`
        .navbar{display:none!important}
        .footer{display:none!important}
        body{overflow:hidden}
      `}</style>

      {sideOpen && <div className="ud-overlay" onClick={() => setSideOpen(false)} />}

      <aside className={`ud-sidebar admin-sidebar ${sideOpen ? "open" : ""}`}>
        <div className="ud-sidebar-logo admin-logo">
          <i className="fa-solid fa-shield-halved" />
          <span>Admin</span>
        </div>

        <div className="ud-user-info">
          <div className="ud-avatar admin-avatar">
            <i className="fa-solid fa-user-shield" />
          </div>
          <div className="ud-user-text">
            <strong>Administrator</strong>
            <small><i className="fa-solid fa-crown" style={{color:"#fbbf24",marginRight:"4px"}} />Super Admin</small>
          </div>
        </div>

        <nav className="ud-nav">
          {adminNav.map(item => (
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
            {adminNav.find(n => n.href === pathname)?.label || "Admin"}
          </h1>
          <div className="ud-topbar-right">
            <span className="ud-topbar-user">
              <i className="fa-solid fa-shield-halved" style={{marginRight:"6px",color:"#f472b6"}} />
              Admin Panel
            </span>
          </div>
        </header>
        <main className="ud-content">{children}</main>
      </div>
    </div>
  );
}
