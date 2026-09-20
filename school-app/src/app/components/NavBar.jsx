import Link from "next/link";
import Image from "next/image"
import logo from "../../logo.jpeg"

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">
          <Image src={logo} alt="School Logo" className="logo-image" />
          <Link href="/">
            <span>UniSoft</span> School
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li><Link href="/past-papers">Past Papers</Link></li>
          <li><Link href="/test-generator">Test Generator</Link></li>
        </ul>

        <div className="nav-actions">
          <Link href="/login" className="login-btn">Login</Link>
          <Link href="/register" className="admission-btn">Register</Link>
        </div>
      </div>
    </nav>
  );
}

