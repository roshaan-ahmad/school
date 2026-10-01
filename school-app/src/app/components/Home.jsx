import Link from "next/link";

const features = [
  { icon: "fa-file-pen",        color: "#38bdf8", title: "Test Generator",      desc: "Generate custom tests by class, subject, chapter, or full book with one click.", href: "/dashboard-user/test-generator", cta: "Generate Now" },
  { icon: "fa-file-lines",      color: "#a78bfa", title: "Past Papers",         desc: "Access years of past exam papers organized by class and subject.",                href: "/past-papers",                   cta: "Browse Papers" },
  { icon: "fa-user-graduate",   color: "#f472b6", title: "Student Management",  desc: "Track attendance, results, fees, and student records in real time.",              href: "/login",                         cta: "Login to Access" },
  { icon: "fa-chalkboard-user", color: "#34d399", title: "Teacher Portal",      desc: "Assign classes, upload materials, and manage schedules effortlessly.",            href: "/login",                         cta: "Teacher Login" },
  { icon: "fa-chart-bar",       color: "#fbbf24", title: "Result Management",   desc: "Publish and track exam results with detailed performance analytics.",             href: "/login",                         cta: "View Results" },
  { icon: "fa-bullhorn",        color: "#fb923c", title: "Announcements",       desc: "Stay updated with school notices, events, and important alerts.",                 href: "/login",                         cta: "View Notices" },
];

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">
          <i className="fa-solid fa-graduation-cap" style={{marginRight:"6px"}} />
          Pakistan&apos;s #1 School Platform
        </div>
        <h1>Welcome to <span>UniSoft</span> School</h1>
        <p>Manage students, generate custom tests, access past papers, and streamline your entire school in one powerful platform.</p>
        <div className="hero-actions">
          <Link href="/register" className="btn primary">
            <i className="fa-solid fa-user-plus" style={{marginRight:"8px"}} />Get Started Free
          </Link>
          <Link href="/dashboard-user/test-generator" className="btn secondary">
            <i className="fa-solid fa-file-pen" style={{marginRight:"8px"}} />Try Test Generator
          </Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>500+</span><p>Students</p></div>
          <div className="stat"><span>50+</span><p>Teachers</p></div>
          <div className="stat"><span>1000+</span><p>Past Papers</p></div>
          <div className="stat"><span>8</span><p>Classes (8-12)</p></div>
        </div>
      </section>

      <section className="features">
        {features.map((f) => (
          <div key={f.title} className="card">
            <div className="card-icon-fa" style={{background: f.color+"18", border:`1px solid ${f.color}33`}}>
              <i className={`fa-solid ${f.icon}`} style={{color: f.color}} />
            </div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
            <Link href={f.href} className="card-link">
              {f.cta} <i className="fa-solid fa-arrow-right" style={{marginLeft:"4px"}} />
            </Link>
          </div>
        ))}
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of students and teachers already using UniSoft School.</p>
        <div className="hero-actions">
          <Link href="/register" className="btn primary">
            <i className="fa-solid fa-user-plus" style={{marginRight:"8px"}} />Create Account
          </Link>
          <Link href="/contact" className="btn secondary">
            <i className="fa-solid fa-envelope" style={{marginRight:"8px"}} />Contact Us
          </Link>
        </div>
      </section>
    </div>
  );
}
