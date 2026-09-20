"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="contact-page">
      <div className="contact-hero">
        <h1>Get in <span>Touch</span></h1>
        <p>Have questions? We&apos;re here to help you.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact Information</h2>
          <div className="info-item">
            <span>📍</span>
            <div>
              <strong>Address</strong>
              <p>123 School Street, Lahore, Pakistan</p>
            </div>
          </div>
          <div className="info-item">
            <span>📞</span>
            <div>
              <strong>Phone</strong>
              <p>+92 300 1234567</p>
            </div>
          </div>
          <div className="info-item">
            <span>✉️</span>
            <div>
              <strong>Email</strong>
              <p>info@school.unisoftpvt.com</p>
            </div>
          </div>
          <div className="info-item">
            <span>🕐</span>
            <div>
              <strong>Hours</strong>
              <p>Mon–Sat: 8:00 AM – 4:00 PM</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send a Message</h2>
          <div className="contact-grid">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            value={form.subject}
            onChange={(e) => setForm({ ...form, subject: e.target.value })}
            required
          />
          <textarea
            placeholder="Your message..."
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
          />
          <button type="submit" className="auth-btn">Send Message</button>
        </form>
      </div>
    </div>
  );
}
