"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import logo from "../../logo.jpeg";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser]         = useState(null);
  const router = useRouter();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => { localStorage.removeItem("user"); setUser(null); router.push("/"); };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Image src={logo} alt="Logo" className="logo-image" />
          <Link href="/"><span>UniSoft</span> School</Link>
        </div>

        <ul className={`nav-links ${menuOpen ? "mobile-open" : ""}`}>
          <li><Link href="/" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-house" /> Home</Link></li>
          <li><Link href="/contact" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-envelope" /> Contact</Link></li>
          <li><Link href="/past-papers" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-file-lines" /> Past Papers</Link></li>
          <li><Link href="/syllabus" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-book-open" /> Syllabus</Link></li>
          <li><Link href="/dashboard-user/test-generator" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-file-pen" /> Test Generator</Link></li>
          {user && <li><Link href="/dashboard-user" onClick={()=>setMenuOpen(false)}><i className="fa-solid fa-gauge" /> Dashboard</Link></li>}
        </ul>

        <div className="nav-actions">
          {user ? (
            <>
              <Link href="/dashboard-user" className="login-btn">
                <i className="fa-regular fa-user" style={{marginRight:"6px"}} />{user.name || "Dashboard"}
              </Link>
              <button onClick={logout} className="admission-btn" style={{border:"none",cursor:"pointer"}}>
                <i className="fa-solid fa-right-from-bracket" style={{marginRight:"6px"}} />Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="login-btn"><i className="fa-solid fa-right-to-bracket" style={{marginRight:"6px"}} />Login</Link>
              <Link href="/register" className="admission-btn"><i className="fa-solid fa-user-plus" style={{marginRight:"6px"}} />Register</Link>
            </>
          )}
        </div>

        <button className="nav-hamburger" onClick={()=>setMenuOpen(!menuOpen)}>
          <i className={`fa-solid ${menuOpen?"fa-xmark":"fa-bars"}`} />
        </button>
      </div>
    </nav>
  );
}
