"use client";
import { useEffect, useState } from "react";
import { syllabus, topicsData } from "../test-generator/data";

const subjectIcons = {
  Mathematics: "📐", Physics: "⚡", Chemistry: "🧪", Biology: "🧬",
  English: "📖", Urdu: "✍️", Islamiat: "☪️", Science: "🔬",
  "Computer Science": "💻",
};

const subjectColors = {
  Mathematics: "#38bdf8", Physics: "#f472b6", Chemistry: "#a78bfa",
  Biology: "#34d399", English: "#fb923c", Urdu: "#facc15",
  Islamiat: "#4ade80", Science: "#60a5fa", "Computer Science": "#e879f9",
};

const classLabels = { 8: "Matric", 9: "Matric", 10: "Matric", 11: "Inter", 12: "Inter" };

export default function SyllabusPage() {
  const [activeClass, setActiveClass]     = useState("9");
  const [activeBoard, setActiveBoard]     = useState("Punjab");
  const [activeSubject, setActiveSubject] = useState(null);
  const [search, setSearch]               = useState("");
  const [theme, setTheme]                 = useState("light");

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("syllabusTheme");
    if (savedTheme === "light" || savedTheme === "dark") setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("syllabusTheme", nextTheme);
  };

  const classes  = ["8", "9", "10", "11", "12"];
  const subjects = activeClass ? Object.keys(syllabus[activeClass] || {}) : [];
  const boards   = activeClass && activeSubject
    ? Object.keys(syllabus[activeClass]?.[activeSubject] || {})
    : ["Punjab", "Federal"];

  const chapters = activeClass && activeSubject && activeBoard
    ? syllabus[activeClass]?.[activeSubject]?.[activeBoard]?.chapters || []
    : [];

  const query = search.trim().toLowerCase();
  const filteredChapters = query
    ? chapters.filter(ch => ch.toLowerCase().includes(query) ||
        (topicsData[ch] || []).some(topic => topic.toLowerCase().includes(query)))
    : chapters;

  const color = subjectColors[activeSubject] || "#38bdf8";
  const totalTopics = chapters.reduce((acc, ch) => acc + (topicsData[ch]?.length || 0), 0);

  return (
    <main className="tg2-wrap tg2-syllabus-page" data-theme={theme}>
      <header className="tg2-syllabus-topbar">
        <div className="tg2-heading tg2-syllabus-heading">
          <span className="tg2-syllabus-hero-icon" aria-hidden="true">📚</span>
          <div>
            <span className="tg2-syllabus-eyebrow">LEARNING LIBRARY</span>
            <h1>Chapters &amp; Topics</h1>
            <p>Apni class ka complete syllabus ek jagah explore karein.</p>
          </div>
        </div>
        <button className="tg2-btn-back tg2-syllabus-theme" type="button" onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "light"}>
          <span aria-hidden="true">{theme === "dark" ? "☀️" : "🌙"}</span>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
      </header>

      <section className="tg2-card tg2-syllabus-panel">
        <div className="tg2-content">
          <label className="tg2-label"><i className="fa-solid fa-graduation-cap" /> Select class</label>
          <div className="tg2-class-grid">
          {classes.map(c => (
            <button key={c}
              className={`tg2-class-btn ${activeClass === c ? "selected" : ""}`}
              onClick={() => { setActiveClass(c); setActiveSubject(null); setSearch(""); }}
            >
              <span className="tg2-class-num">{c}</span>
              <small>{classLabels[c]}</small>
            </button>
          ))}
          </div>

          {activeClass && <>
            <label className="tg2-label"><i className="fa-solid fa-book-open" /> Select subject</label>
            <div className="tg2-options">
            {subjects.map(sub => (
              <button key={sub}
                type="button"
                className={`tg2-option ${activeSubject === sub ? "selected" : ""}`}
                style={{ "--oc": subjectColors[sub] || "#38bdf8", ...(activeSubject === sub ? { borderColor: subjectColors[sub], background: `${subjectColors[sub]}18` } : {}) }}
                onClick={() => { setActiveSubject(sub); setActiveBoard(Object.keys(syllabus[activeClass]?.[sub] || {})[0] || ""); setSearch(""); }}
              >
                <span className="tg2-option-icon" style={{ background: `${subjectColors[sub] || "#38bdf8"}20`, color: subjectColors[sub] || "#38bdf8" }}>{subjectIcons[sub] || "📘"}</span>
                <span className="tg2-option-text"><strong>{sub}</strong><small>{syllabus[activeClass]?.[sub] ? Object.values(syllabus[activeClass][sub]).reduce((sum, boardData) => sum + boardData.chapters.length, 0) : 0} chapters across boards</small></span>
                {activeSubject === sub && <i className="fa-solid fa-circle-check tg2-check" style={{ color: subjectColors[sub] }} />}
              </button>
            ))}
            </div>
          </>}

      {activeSubject && (
        <>
          <div className="tg2-syllabus-toolbar">
            <div>
              <label className="tg2-label"><i className="fa-solid fa-building-columns" /> Board / syllabus</label>
              <div className="tg2-chapter-grid tg2-syllabus-boards">
            {boards.map(b => (
              <button key={b}
                type="button"
                className={`tg2-chapter-btn ${activeBoard === b ? "selected" : ""}`}
                style={activeBoard === b ? { borderColor: color, color, background: `${color}18` } : {}}
                onClick={() => setActiveBoard(b)}
              >
                <i className="fa-solid fa-building-columns" /> {b} Board
              </button>
            ))}
              </div>
            </div>
            <div className="tg2-syllabus-stats" aria-label="Syllabus totals">
              <div className="tg2-total-bar tg2-syllabus-stat"><span><i className="fa-solid fa-book" /> Chapters</span><strong>{chapters.length}</strong></div>
              <div className="tg2-total-bar tg2-syllabus-stat"><span><i className="fa-solid fa-list-check" /> Topics</span><strong>{totalTopics}</strong></div>
            </div>
          </div>

          {chapters.length > 0 && <div className="tg2-syllabus-search-wrap">
            <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <input className="tg2-input tg2-syllabus-search" type="search"
              placeholder="Search chapters or topics..." value={search}
              onChange={e => setSearch(e.target.value)} aria-label="Search chapters or topics" />
            {search && <button className="tg2-syllabus-clear" type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}
          </div>}

          <div className="tg2-syllabus-chapters">
          {filteredChapters.length === 0 ? (
            <div className="tg2-info-box tg2-syllabus-empty">
              <div className="tg2-info-icon"><i className="fa-solid fa-magnifying-glass" /></div>
              <div><strong>No matching results</strong><p>We couldn’t find a chapter or topic matching “{search}”. Try another search.</p></div>
            </div>
          ) : (
            filteredChapters.map((ch, idx) => {
              const topics = topicsData[ch] || [];
              const chapterMatchesSearch = ch.toLowerCase().includes(query);
              const visibleTopics = query && !chapterMatchesSearch
                ? topics.filter(topic => topic.toLowerCase().includes(query))
                : topics;
              return (
                <article key={ch} className="tg2-card tg2-syllabus-chapter" style={{ "--chapter-color": color }}>
                  <div className="tg2-heading tg2-syllabus-chapter-heading">
                    <span className="tg2-syllabus-chapter-number">{String(idx + 1).padStart(2, "0")}</span>
                    <div className="tg2-syllabus-chapter-title"><h2>{ch}</h2><p>{visibleTopics.length} {visibleTopics.length === 1 ? "topic" : "topics"}</p></div>
                    <span className="tg2-syllabus-topic-count">{visibleTopics.length} / {topics.length}</span>
                  </div>
                  {visibleTopics.length > 0 ? (
                    <div className="tg2-chapter-grid tg2-syllabus-topic-grid">
                      {visibleTopics.map((topic, topicIndex) => (
                        <span key={`${ch}-${topic}`} className="tg2-chapter-btn tg2-syllabus-topic">
                          <span>{String(topicIndex + 1).padStart(2, "0")}</span>{topic}
                        </span>
                      ))}
                    </div>
                  ) : <p className="tg2-syllabus-no-topics">No topics are listed for this chapter yet.</p>}
                </article>
              );
            })
          )}
          </div>
        </>
      )}

      {!activeSubject && activeClass && (
        <div className="tg2-info-box tg2-syllabus-empty">
          <div className="tg2-info-icon"><i className="fa-solid fa-arrow-up" /></div>
          <div><strong>Choose a subject to get started</strong><p>Select a subject above to explore its board-wise chapters and topics.</p></div>
        </div>
      )}
        </div>
      </section>
    </main>
  );
}
