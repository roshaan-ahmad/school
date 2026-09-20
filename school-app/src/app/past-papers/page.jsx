"use client";
import { useState } from "react";

const papers = [
  { class: "9", subject: "Mathematics", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "9", subject: "Physics", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "9", subject: "Chemistry", year: 2022, board: "Punjab Board", type: "Annual" },
  { class: "10", subject: "Mathematics", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "10", subject: "Biology", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "10", subject: "English", year: 2022, board: "Federal Board", type: "Supplementary" },
  { class: "11", subject: "Physics", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "11", subject: "Chemistry", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "11", subject: "Mathematics", year: 2022, board: "Federal Board", type: "Annual" },
  { class: "12", subject: "Physics", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "12", subject: "Chemistry", year: 2023, board: "Punjab Board", type: "Annual" },
  { class: "12", subject: "Biology", year: 2022, board: "Federal Board", type: "Supplementary" },
];

export default function PastPapersPage() {
  const [filters, setFilters] = useState({ class: "", subject: "", year: "" });

  const filtered = papers.filter((p) =>
    (!filters.class || p.class === filters.class) &&
    (!filters.subject || p.subject === filters.subject) &&
    (!filters.year || p.year === Number(filters.year))
  );

  const subjects = [...new Set(papers.map((p) => p.subject))];

  return (
    <div className="pp-page">
      <div className="pp-hero">
        <h1>Past <span>Papers</span></h1>
        <p>Access previous exam papers by class, subject, and year</p>
      </div>

      <div className="pp-filters">
        <select value={filters.class} onChange={(e) => setFilters({ ...filters, class: e.target.value })}>
          <option value="">All Classes</option>
          {["9", "10", "11", "12"].map((c) => <option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={filters.subject} onChange={(e) => setFilters({ ...filters, subject: e.target.value })}>
          <option value="">All Subjects</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filters.year} onChange={(e) => setFilters({ ...filters, year: e.target.value })}>
          <option value="">All Years</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
        </select>
        <button className="btn primary" onClick={() => setFilters({ class: "", subject: "", year: "" })}>
          Clear Filters
        </button>
      </div>

      <div className="pp-grid">
        {filtered.length === 0 ? (
          <p className="pp-empty">No papers found for selected filters.</p>
        ) : (
          filtered.map((p, i) => (
            <div key={i} className="pp-card">
              <div className="pp-card-top">
                <span className="pp-class">Class {p.class}</span>
                <span className="pp-type">{p.type}</span>
              </div>
              <h3>{p.subject}</h3>
              <p>{p.board} — {p.year}</p>
              <button className="pp-download">📥 Download PDF</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
