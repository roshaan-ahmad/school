"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../../logo.jpeg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Image src={logo} alt="School Logo" className="logo-image" />
          <Link href="/"><span>UniSoft</span> School</Link>
        </div>

        <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <li><Link href="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          <li><Link href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link></li>
          <li><Link href="/past-papers" onClick={() => setMenuOpen(false)}>Past Papers</Link></li>
          <li><Link href="/dashboard-user/test-generator" onClick={() => setMenuOpen(false)}>Test Generator</Link></li>
          {user && <li><Link href="/dashboard-user" onClick={() => setMenuOpen(false)}>Dashboard</Link></li>}
        </ul>

        <div className="nav-actions">
          {user ? (
            <>
              <Link href="/dashboard-user" className="login-btn">{user.name || "Dashboard"}</Link>
              <button onClick={logout} className="admission-btn" style={{ border: "none", cursor: "pointer" }}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-btn">Login</Link>
              <Link href="/register" className="admission-btn">Register</Link>
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
          <span className={menuOpen ? "open" : ""} />
        </button>
      </div>
    </nav>
  );
}
