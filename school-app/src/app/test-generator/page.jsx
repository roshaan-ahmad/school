"use client";
import { useState } from "react";
import { syllabus, SELECTION_TYPES, SELECTION_CATEGORIES, MARK_OPTIONS, marksConfig, generatePaper } from "./data";

const STEPS = ["Class & Subject", "Selection Type", "Configure", "Generate"];

const subjectIcons = { Mathematics: "📐", Physics: "⚡", Chemistry: "🧪", Biology: "🧬", English: "📖", Urdu: "✍️", Islamiat: "☪️", Science: "🔬", "Computer Science": "💻" };

// ─── Reusable option button ───────────────────────────────────────────────────
function OptionBtn({ icon, label, desc, selected, onClick }) {
  return (
    <button className={`tg-option ${selected ? "selected" : ""}`} onClick={onClick} type="button">
      <span className="tg-option-icon">{icon}</span>
      <strong>{label}</strong>
      {desc && <small>{desc}</small>}
    </button>
  );
}

// ─── Printed paper view ───────────────────────────────────────────────────────
function TestPaper({ paper, onReset }) {
  const { mcqs, sqs, lqs, meta } = paper;
  const totalActual = mcqs.length + sqs.length * 3 + lqs.length * 5;

  return (
    <div className="tg-page">
      <div className="tg-result-header">
        <div>
          <h2>✅ Test Paper Generated</h2>
          <p>Class {meta.classNo} · {meta.subject} · {meta.board} Board · {totalActual} Marks</p>
        </div>
        <div className="tg-result-actions">
          <button onClick={() => window.print()} className="btn primary">🖨️ Print</button>
          <button onClick={onReset} className="btn secondary">New Test</button>
        </div>
      </div>

      <div className="test-paper">
        <div className="test-paper-header">
          <h3>UniSoft School — Exam Paper</h3>
          <div className="test-meta">
            <span>Class: {meta.classNo}</span>
            <span>Subject: {meta.subject}</span>
            <span>Total Marks: {totalActual}</span>
            <span>Time: {totalActual} mins</span>
            {meta.hasChoice && <span className="choice-badge">With Choice</span>}
          </div>
        </div>

        {mcqs.length > 0 && (
          <div className="test-section">
            <h4>Section A — MCQs <span>({mcqs.length} × 1 = {mcqs.length} marks)</span></h4>
            {mcqs.map((q, i) => (
              <div key={i} className="test-question">
                <p><strong>Q{i + 1}.</strong> {q.q}</p>
                <div className="mcq-options">
                  {q.options.map((o, j) => <span key={j}>{String.fromCharCode(65 + j)}. {o}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {sqs.length > 0 && (
          <div className="test-section">
            <h4>Section B — Short Questions <span>({sqs.length} × 3 = {sqs.length * 3} marks)</span>
              {meta.hasChoice && <em> (Attempt any {Math.ceil(sqs.length * 0.6)})</em>}
            </h4>
            {sqs.map((q, i) => (
              <div key={i} className="test-question">
                <p><strong>Q{mcqs.length + i + 1}.</strong> {q.q}</p>
              </div>
            ))}
          </div>
        )}

        {lqs.length > 0 && (
          <div className="test-section">
            <h4>Section C — Long Questions <span>({lqs.length} × 5 = {lqs.length * 5} marks)</span>
              {meta.hasChoice && <em> (Attempt any {Math.ceil(lqs.length * 0.6)})</em>}
            </h4>
            {lqs.map((q, i) => (
              <div key={i} className="test-question">
                <p><strong>Q{mcqs.length + sqs.length + i + 1}.</strong> {q.q}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function TestGeneratorPage() {
  const [step, setStep] = useState(1);
  const [paper, setPaper] = useState(null);

  // Step 1
  const [classNo, setClassNo]   = useState("");
  const [subject, setSubject]   = useState("");
  const [board, setBoard]       = useState("");

  // Step 2
  const [selType, setSelType]   = useState("");   // random | self | ai | board | custom

  // Step 3 — self / random
  const [selMode, setSelMode]   = useState("");   // chapterwise | topicwise
  const [category, setCategory] = useState("");   // exercise | content | pastpapers | important
  const [selChapters, setSelChapters] = useState([]);
  const [topics, setTopics]     = useState("");

  // Step 3 — marks
  const [hasChoice, setHasChoice] = useState(null); // true | false
  const [totalMarks, setTotalMarks] = useState("");

  // Step 3 — custom
  const [customCounts, setCustomCounts] = useState({ mcq: 10, sq: 5, lq: 2 });

  const chapters = classNo && subject && board ? syllabus[classNo]?.[subject]?.[board]?.chapters || [] : [];
  const subjects  = classNo ? Object.keys(syllabus[classNo] || {}) : [];
  const boards    = classNo && subject ? Object.keys(syllabus[classNo]?.[subject] || {}) : [];

  const reset = () => {
    setStep(1); setPaper(null);
    setClassNo(""); setSubject(""); setBoard(""); setSelType("");
    setSelMode(""); setCategory(""); setSelChapters([]); setTopics("");
    setHasChoice(null); setTotalMarks(""); setCustomCounts({ mcq: 10, sq: 5, lq: 2 });
  };

  const toggleChapter = (ch) =>
    setSelChapters((prev) => prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]);

  const canStep1 = classNo && subject && board;
  const canStep2 = !!selType;
  const canStep3 = () => {
    if (selType === "custom") return customCounts.mcq >= 0 && customCounts.sq >= 0 && customCounts.lq >= 0;
    if (selType === "ai" || selType === "board") return true;
    if (selType === "random" || selType === "self") {
      const needsMarks = hasChoice !== null && totalMarks;
      const needsCategory = !!category;
      return needsMarks && needsCategory;
    }
    return false;
  };

  const handleGenerate = () => {
    const result = generatePaper({
      classNo, subject, board, selectionType: selType,
      selectionMode: selMode, chapters: selChapters, topics,
      category, hasChoice, totalMarks: Number(totalMarks),
      customCounts,
    });
    setPaper(result);
  };

  if (paper) return <TestPaper paper={paper} onReset={reset} />;

  return (
    <div className="tg-page">
      <div className="tg-hero">
        <h1>Exam <span>Elevator</span></h1>
        <p>Build the perfect test paper in minutes</p>
      </div>

      {/* Progress bar */}
      <div className="tg-steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`tg-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
            <div className="tg-step-num">{step > i + 1 ? "✓" : i + 1}</div>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <div className="tg-card">

        {/* ── STEP 1: Class / Subject / Board ── */}
        {step === 1 && (
          <div className="tg-step-content">
            <h2>Select Class, Subject & Board</h2>

            <label className="tg-label">Class</label>
            <div className="tg-options">
              {["8", "9", "10", "11", "12"].map((c) => (
                <OptionBtn key={c} icon="🎓" label={`Class ${c}`}
                  desc={c <= 10 ? "Matric" : "Intermediate"}
                  selected={classNo === c}
                  onClick={() => { setClassNo(c); setSubject(""); setBoard(""); }} />
              ))}
            </div>

            {classNo && (
              <>
                <label className="tg-label">Subject</label>
                <div className="tg-options">
                  {subjects.map((s) => (
                    <OptionBtn key={s} icon={subjectIcons[s] || "📘"} label={s}
                      selected={subject === s}
                      onClick={() => { setSubject(s); setBoard(""); }} />
                  ))}
                </div>
              </>
            )}

            {subject && (
              <>
                <label className="tg-label">Board / Syllabus</label>
                <div className="tg-options">
                  {boards.map((b) => (
                    <OptionBtn key={b} icon="🏫" label={`${b} Board`}
                      desc={`${syllabus[classNo][subject][b].chapters.length} chapters`}
                      selected={board === b}
                      onClick={() => setBoard(b)} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── STEP 2: Selection Type ── */}
        {step === 2 && (
          <div className="tg-step-content">
            <h2>Selection Type</h2>
            <p className="tg-sub">How should questions be selected?</p>
            <div className="tg-options">
              {SELECTION_TYPES.map((t) => (
                <OptionBtn key={t.val} icon={t.icon} label={t.label} desc={t.desc}
                  selected={selType === t.val}
                  onClick={() => setSelType(t.val)} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 3: Configure based on selType ── */}
        {step === 3 && (
          <div className="tg-step-content">
            <h2>Configure Paper</h2>

            {/* AI / Board Pattern — no extra config needed */}
            {(selType === "ai" || selType === "board") && (
              <div className="tg-info-box">
                <span>{selType === "ai" ? "🤖" : "🏫"}</span>
                <div>
                  <strong>{selType === "ai" ? "AI will auto-generate" : "Board Pattern (FLP)"}</strong>
                  <p>{selType === "ai"
                    ? "Our AI will select the most relevant questions based on your class and subject."
                    : "Paper will follow the official board First Language Paper format with standard marks distribution."}</p>
                </div>
              </div>
            )}

            {/* Self / Random — full config */}
            {(selType === "self" || selType === "random") && (
              <>
                <label className="tg-label">Selection Mode</label>
                <div className="tg-options">
                  <OptionBtn icon="📑" label="Chapter Wise" desc="Select by chapters"
                    selected={selMode === "chapterwise"} onClick={() => setSelMode("chapterwise")} />
                  <OptionBtn icon="🔖" label="Topic Wise" desc="Select by topics"
                    selected={selMode === "topicwise"} onClick={() => setSelMode("topicwise")} />
                </div>

                {selMode === "chapterwise" && (
                  <>
                    <label className="tg-label">Select Chapters <small>(click to toggle)</small></label>
                    <div className="tg-chapter-grid">
                      {chapters.map((ch) => (
                        <button key={ch} type="button"
                          className={`tg-chapter-btn ${selChapters.includes(ch) ? "selected" : ""}`}
                          onClick={() => toggleChapter(ch)}>
                          {ch}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {selMode === "topicwise" && (
                  <>
                    <label className="tg-label">Enter Topics <small>(comma separated)</small></label>
                    <input className="tg-input" placeholder="e.g. Kinematics, Newton's Laws, Gravitation"
                      value={topics} onChange={(e) => setTopics(e.target.value)} />
                  </>
                )}

                <label className="tg-label" style={{ marginTop: "1.5rem" }}>Selection Category</label>
                <div className="tg-options">
                  {SELECTION_CATEGORIES.map((c) => (
                    <OptionBtn key={c.val} icon={c.icon} label={c.label} desc={c.desc}
                      selected={category === c.val} onClick={() => setCategory(c.val)} />
                  ))}
                </div>

                <label className="tg-label" style={{ marginTop: "1.5rem" }}>Paper Type</label>
                <div className="tg-options">
                  <OptionBtn icon="✅" label="Paper with Choice" desc="Students attempt selected questions"
                    selected={hasChoice === true} onClick={() => setHasChoice(true)} />
                  <OptionBtn icon="📋" label="Paper with No Choice" desc="All questions are compulsory"
                    selected={hasChoice === false} onClick={() => setHasChoice(false)} />
                </div>

                {hasChoice !== null && (
                  <>
                    <label className="tg-label" style={{ marginTop: "1.5rem" }}>Total Marks</label>
                    <div className="tg-options">
                      {MARK_OPTIONS.map((m) => (
                        <OptionBtn key={m} icon="🎯" label={`${m} Marks`}
                          desc={`MCQ:${marksConfig[m].mcq} SQ:${marksConfig[m].sq} LQ:${marksConfig[m].lq}`}
                          selected={totalMarks === String(m)}
                          onClick={() => setTotalMarks(String(m))} />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Custom Generation */}
            {selType === "custom" && (
              <>
                <p className="tg-sub">Manually set the number of each question type.</p>
                <div className="tg-custom-grid">
                  {[
                    { key: "mcq", label: "MCQs", icon: "🔘", marks: "1 mark each" },
                    { key: "sq",  label: "Short Questions (S/Qs)", icon: "✏️", marks: "3 marks each" },
                    { key: "lq",  label: "Long Questions (L/Qs)",  icon: "📝", marks: "5 marks each" },
                  ].map(({ key, label, icon, marks }) => (
                    <div key={key} className="tg-custom-item">
                      <div className="tg-custom-label">
                        <span>{icon}</span>
                        <div><strong>{label}</strong><small>{marks}</small></div>
                      </div>
                      <div className="tg-counter">
                        <button type="button" onClick={() => setCustomCounts((p) => ({ ...p, [key]: Math.max(0, p[key] - 1) }))}>−</button>
                        <span>{customCounts[key]}</span>
                        <button type="button" onClick={() => setCustomCounts((p) => ({ ...p, [key]: p[key] + 1 }))}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="tg-custom-total">
                  Total Marks: <strong>{customCounts.mcq * 1 + customCounts.sq * 3 + customCounts.lq * 5}</strong>
                </div>
              </>
            )}
          </div>
        )}

        {/* ── NAV BUTTONS ── */}
        <div className="tg-nav">
          {step > 1 && <button className="btn secondary" onClick={() => setStep(step - 1)}>← Back</button>}
          {step < 3
            ? <button className="btn primary" disabled={step === 1 ? !canStep1 : !canStep2} onClick={() => setStep(step + 1)}>Next →</button>
            : <button className="btn primary" disabled={!canStep3()} onClick={handleGenerate}>🚀 Generate Test</button>
          }
        </div>
      </div>
    </div>
  );
}
