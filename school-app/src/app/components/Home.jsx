import Link from "next/link";

export default function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-badge">🎓 Pakistan&apos;s #1 School Platform</div>
        <h1>
          Welcome to <span>UniSoft</span> School
        </h1>
        <p>
          Manage students, generate custom tests, access past papers, and
          streamline your entire school in one powerful platform.
        </p>
        <div className="hero-actions">
          <Link href="/register" className="btn primary">Get Started Free</Link>
          <Link href="/test-generator" className="btn secondary">Try Test Generator</Link>
        </div>
        <div className="hero-stats">
          <div className="stat"><span>500+</span><p>Students</p></div>
          <div className="stat"><span>50+</span><p>Teachers</p></div>
          <div className="stat"><span>1000+</span><p>Past Papers</p></div>
          <div className="stat"><span>4</span><p>Classes (9-12)</p></div>
        </div>
      </section>

      <section className="features">
        <div className="card">
          <div className="card-icon">📝</div>
          <h3>Test Generator</h3>
          <p>Generate custom tests by class, subject, chapter, or full book with one click.</p>
          <Link href="/test-generator" className="card-link">Generate Now →</Link>
        </div>
        <div className="card">
          <div className="card-icon">📄</div>
          <h3>Past Papers</h3>
          <p>Access years of past exam papers organized by class and subject.</p>
          <Link href="/past-papers" className="card-link">Browse Papers →</Link>
        </div>
        <div className="card">
          <div className="card-icon">👨‍🎓</div>
          <h3>Student Management</h3>
          <p>Track attendance, results, fees, and student records in real time.</p>
          <Link href="/login" className="card-link">Login to Access →</Link>
        </div>
        <div className="card">
          <div className="card-icon">👩‍🏫</div>
          <h3>Teacher Portal</h3>
          <p>Assign classes, upload materials, and manage schedules effortlessly.</p>
          <Link href="/login" className="card-link">Teacher Login →</Link>
        </div>
        <div className="card">
          <div className="card-icon">📊</div>
          <h3>Result Management</h3>
          <p>Publish and track exam results with detailed performance analytics.</p>
          <Link href="/login" className="card-link">View Results →</Link>
        </div>
        <div className="card">
          <div className="card-icon">📢</div>
          <h3>Announcements</h3>
          <p>Stay updated with school notices, events, and important alerts.</p>
          <Link href="/login" className="card-link">View Notices →</Link>
        </div>
      </section>

      <section className="cta-section">
        <h2>Ready to get started?</h2>
        <p>Join thousands of students and teachers already using UniSoft School.</p>
        <div className="hero-actions">
          <Link href="/register" className="btn primary">Create Account</Link>
          <Link href="/contact" className="btn secondary">Contact Us</Link>
        </div>
      </section>
    </div>
  );
}
