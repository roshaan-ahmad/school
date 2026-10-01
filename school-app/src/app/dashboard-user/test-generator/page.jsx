"use client";
import { useState } from "react";
import { syllabus, SELECTION_TYPES, SELECTION_CATEGORIES, MARK_OPTIONS, marksConfig, generatePaper, topicsData } from "../../test-generator/data";

const subjectFA = {
  Mathematics:        { icon: "fa-square-root-variable", color: "#38bdf8" },
  Physics:            { icon: "fa-atom",                 color: "#a78bfa" },
  Chemistry:          { icon: "fa-flask",                color: "#34d399" },
  Biology:            { icon: "fa-dna",                  color: "#f472b6" },
  English:            { icon: "fa-book-open",            color: "#fbbf24" },
  Urdu:               { icon: "fa-pen-nib",              color: "#fb923c" },
  Islamiat:           { icon: "fa-star-and-crescent",    color: "#4ade80" },
  Science:            { icon: "fa-microscope",           color: "#22d3ee" },
  "Computer Science": { icon: "fa-laptop-code",          color: "#818cf8" },
};

const selTypeFA = {
  random: { icon: "fa-shuffle",          color: "#38bdf8" },
  self:   { icon: "fa-hand-pointer",     color: "#a78bfa" },
  ai:     { icon: "fa-microchip",        color: "#34d399" },
  board:  { icon: "fa-building-columns", color: "#fbbf24" },
  custom: { icon: "fa-sliders",          color: "#f472b6" },
};

const categoryFA = {
  exercise:   { icon: "fa-book",        color: "#38bdf8" },
  content:    { icon: "fa-layer-group", color: "#a78bfa" },
  pastpapers: { icon: "fa-file-lines",  color: "#fbbf24" },
  important:  { icon: "fa-star",        color: "#f472b6" },
};

const STEPS = [
  { label: "Class & Subject", icon: "fa-graduation-cap" },
  { label: "Selection Type",  icon: "fa-list-check" },
  { label: "Configure",       icon: "fa-sliders" },
];

function OptionBtn({ faIcon, color, label, desc, selected, onClick }) {
  return (
    <button className={`tg2-option ${selected ? "selected" : ""}`} onClick={onClick} type="button"
      style={selected ? { "--oc": color, borderColor: color, background: color + "18" } : { "--oc": color }}>
      <div className="tg2-option-icon" style={{ background: color + "18", border: `1px solid ${color}33` }}>
        <i className={`fa-solid ${faIcon}`} style={{ color }} />
      </div>
      <div className="tg2-option-text">
        <strong>{label}</strong>
        {desc && <small>{desc}</small>}
      </div>
      {selected && <i className="fa-solid fa-circle-check tg2-check" style={{ color }} />}
    </button>
  );
}

function TestPaper({ paper, onReset }) {
  const { mcqs, sqs, lqs, meta } = paper;
  const total = mcqs.length + sqs.length * 3 + lqs.length * 5;
  return (
    <div className="tg2-result">
      <div className="tg2-result-header">
        <div className="tg2-result-info">
          <div className="tg2-result-badge"><i className="fa-solid fa-circle-check" /> Paper Ready</div>
          <h2>Test Paper Generated</h2>
          <div className="tg2-result-meta">
            <span><i className="fa-solid fa-graduation-cap" /> Class {meta.classNo}</span>
            <span><i className="fa-solid fa-book" /> {meta.subject}</span>
            <span><i className="fa-solid fa-building-columns" /> {meta.board} Board</span>
            <span><i className="fa-solid fa-bullseye" /> {total} Marks</span>
            {meta.hasChoice && <span className="tg2-choice-tag"><i className="fa-solid fa-check-double" /> With Choice</span>}
          </div>
        </div>
        <div className="tg2-result-actions">
          <button onClick={() => window.print()} className="tg2-btn-print"><i className="fa-solid fa-print" /> Print Paper</button>
          <button onClick={onReset} className="tg2-btn-new"><i className="fa-solid fa-rotate-left" /> New Test</button>
        </div>
      </div>
      <div className="test-paper">
        <div className="test-paper-header">
          <h3>UniSoft School — Exam Paper</h3>
          <div className="test-meta">
            <span>Class: {meta.classNo}</span>
            <span>Subject: {meta.subject}</span>
            <span>Total Marks: {total}</span>
            <span>Time: {total} mins</span>
          </div>
        </div>
        {mcqs.length > 0 && (
          <div className="test-section">
            <h4>Section A — Multiple Choice Questions <span>({mcqs.length} × 1 = {mcqs.length} marks)</span></h4>
            {mcqs.map((q, i) => (
              <div key={i} className="test-question">
                <p><strong>Q{i + 1}.</strong> {q.q}</p>
                <div className="mcq-options">{q.options.map((o, j) => <span key={j}>{String.fromCharCode(65 + j)}. {o}</span>)}</div>
              </div>
            ))}
          </div>
        )}
        {sqs.length > 0 && (
          <div className="test-section">
            <h4>Section B — Short Questions <span>({sqs.length} × 3 = {sqs.length * 3} marks)</span>{meta.hasChoice && <em> — Attempt any {Math.ceil(sqs.length * 0.6)}</em>}</h4>
            {sqs.map((q, i) => <div key={i} className="test-question"><p><strong>Q{mcqs.length + i + 1}.</strong> {q.q}</p></div>)}
          </div>
        )}
        {lqs.length > 0 && (
          <div className="test-section">
            <h4>Section C — Long Questions <span>({lqs.length} × 5 = {lqs.length * 5} marks)</span>{meta.hasChoice && <em> — Attempt any {Math.ceil(lqs.length * 0.6)}</em>}</h4>
            {lqs.map((q, i) => <div key={i} className="test-question"><p><strong>Q{mcqs.length + sqs.length + i + 1}.</strong> {q.q}</p></div>)}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardTestGenerator() {
  const [step, setStep]       = useState(1);
  const [paper, setPaper]     = useState(null);
  const [classNo, setClassNo] = useState("");
  const [subject, setSubject] = useState("");
  const [board, setBoard]     = useState("");
  const [selType, setSelType] = useState("");
  const [selMode, setSelMode] = useState("");
  const [category, setCategory]   = useState("");
  const [selChapters, setSelChapters] = useState([]);
  const [selTopics, setSelTopics]     = useState([]);
  const [hasChoice, setHasChoice]     = useState(null);
  const [totalMarks, setTotalMarks]   = useState("");
  const [customCounts, setCustomCounts] = useState({ mcq: 10, sq: 5, lq: 2 });

  const chapters = classNo && subject && board ? syllabus[classNo]?.[subject]?.[board]?.chapters || [] : [];
  const subjects  = classNo ? Object.keys(syllabus[classNo] || {}) : [];
  const boards    = classNo && subject ? Object.keys(syllabus[classNo]?.[subject] || {}) : [];

  const reset = () => {
    setStep(1); setPaper(null); setClassNo(""); setSubject(""); setBoard("");
    setSelType(""); setSelMode(""); setCategory(""); setSelChapters([]);
    setSelTopics([]); setHasChoice(null); setTotalMarks(""); setCustomCounts({ mcq: 10, sq: 5, lq: 2 });
  };

  const toggleChapter = (ch) => setSelChapters(p => p.includes(ch) ? p.filter(c => c !== ch) : [...p, ch]);
  const toggleTopic   = (t)  => setSelTopics(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);
  const selectAllTopics = (ch) => {
    const chTopics = topicsData[ch] || [];
    const allSel = chTopics.every(t => selTopics.includes(t));
    if (allSel) setSelTopics(p => p.filter(t => !chTopics.includes(t)));
    else setSelTopics(p => [...new Set([...p, ...chTopics])]);
  };

  const canStep1 = classNo && subject && board;
  const canStep2 = !!selType;
  const canStep3 = () => {
    if (selType === "custom" || selType === "ai" || selType === "board") return true;
    return hasChoice !== null && totalMarks && category;
  };

  const handleGenerate = () => {
    const result = generatePaper({
      classNo, subject, board, selectionType: selType,
      selectionMode: selMode, chapters: selChapters,
      topics: selTopics.join(", "), category, hasChoice,
      totalMarks: Number(totalMarks), customCounts,
    });
    setPaper(result);
  };

  if (paper) return <TestPaper paper={paper} onReset={reset} />;

  return (
    <div className="tg2-wrap">

      {/* Progress */}
      <div className="tg2-steps">
        {STEPS.map((s, i) => (
          <div key={i} className={`tg2-step ${step === i + 1 ? "active" : step > i + 1 ? "done" : ""}`}>
            <div className="tg2-step-circle">
              {step > i + 1 ? <i className="fa-solid fa-check" /> : <i className={`fa-solid ${s.icon}`} />}
            </div>
            <span>{s.label}</span>
            {i < STEPS.length - 1 && <div className={`tg2-step-line ${step > i + 1 ? "done" : ""}`} />}
          </div>
        ))}
      </div>

      <div className="tg2-card">

        {/* STEP 1 */}
        {step === 1 && (
          <div className="tg2-content">
            <div className="tg2-heading">
              <i className="fa-solid fa-graduation-cap" />
              <div><h2>Select Class, Subject & Board</h2><p>Choose your class, subject and board to get started</p></div>
            </div>
            <label className="tg2-label"><i className="fa-solid fa-layer-group" /> Class</label>
            <div className="tg2-class-grid">
              {["8","9","10","11","12"].map(c => (
                <button key={c} type="button"
                  className={`tg2-class-btn ${classNo === c ? "selected" : ""}`}
                  onClick={() => { setClassNo(c); setSubject(""); setBoard(""); }}>
                  <span className="tg2-class-num">{c}</span>
                  <small>{c <= "10" ? "Matric" : "Inter"}</small>
                </button>
              ))}
            </div>
            {classNo && (<>
              <label className="tg2-label"><i className="fa-solid fa-book" /> Subject</label>
              <div className="tg2-options">
                {subjects.map(s => {
                  const sf = subjectFA[s] || { icon: "fa-book-open", color: "#38bdf8" };
                  return <OptionBtn key={s} faIcon={sf.icon} color={sf.color} label={s} selected={subject === s} onClick={() => { setSubject(s); setBoard(""); }} />;
                })}
              </div>
            </>)}
            {subject && (<>
              <label className="tg2-label"><i className="fa-solid fa-building-columns" /> Board / Syllabus</label>
              <div className="tg2-options">
                {boards.map(b => (
                  <OptionBtn key={b} faIcon="fa-building-columns" color="#fbbf24"
                    label={`${b} Board`} desc={`${syllabus[classNo][subject][b].chapters.length} chapters`}
                    selected={board === b} onClick={() => setBoard(b)} />
                ))}
              </div>
            </>)}
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="tg2-content">
            <div className="tg2-heading">
              <i className="fa-solid fa-list-check" />
              <div><h2>Selection Type</h2><p>Choose how questions should be selected for your paper</p></div>
            </div>
            <div className="tg2-options">
              {SELECTION_TYPES.map(t => {
                const sf = selTypeFA[t.val] || { icon: "fa-circle", color: "#38bdf8" };
                return <OptionBtn key={t.val} faIcon={sf.icon} color={sf.color} label={t.label} desc={t.desc} selected={selType === t.val} onClick={() => setSelType(t.val)} />;
              })}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="tg2-content">
            <div className="tg2-heading">
              <i className="fa-solid fa-sliders" />
              <div><h2>Configure Paper</h2><p>Set the details for your test paper</p></div>
            </div>

            {/* AI / Board */}
            {(selType === "ai" || selType === "board") && (
              <div className="tg2-info-box">
                <div className="tg2-info-icon">
                  <i className={`fa-solid ${selType === "ai" ? "fa-microchip" : "fa-building-columns"}`} />
                </div>
                <div>
                  <strong>{selType === "ai" ? "AI Auto-Generation" : "Board Pattern (FLP)"}</strong>
                  <p>{selType === "ai" ? "AI will intelligently select the most relevant questions based on your class and subject." : "Paper will follow the official board First Language Paper format with standard marks distribution."}</p>
                </div>
              </div>
            )}

            {/* Self / Random */}
            {(selType === "self" || selType === "random") && (<>
              <label className="tg2-label"><i className="fa-solid fa-list" /> Selection Mode</label>
              <div className="tg2-options">
                <OptionBtn faIcon="fa-book-open" color="#38bdf8" label="Chapter Wise" desc="Pick specific chapters" selected={selMode === "chapterwise"} onClick={() => setSelMode("chapterwise")} />
                <OptionBtn faIcon="fa-tags" color="#a78bfa" label="Topic Wise" desc="Browse and select topics per chapter" selected={selMode === "topicwise"} onClick={() => setSelMode("topicwise")} />
              </div>

              {/* Chapter Wise */}
              {selMode === "chapterwise" && (<>
                <label className="tg2-label">
                  <i className="fa-solid fa-list-ol" /> Select Chapters
                  <span className="tg2-label-hint"> — {selChapters.length} selected</span>
                </label>
                <div className="tg2-chapter-grid">
                  {chapters.map(ch => (
                    <button key={ch} type="button"
                      className={`tg2-chapter-btn ${selChapters.includes(ch) ? "selected" : ""}`}
                      onClick={() => toggleChapter(ch)}>
                      {selChapters.includes(ch)
                        ? <i className="fa-solid fa-check" style={{ marginRight: "6px", fontSize: "0.7rem" }} />
                        : <i className="fa-regular fa-circle" style={{ marginRight: "6px", fontSize: "0.7rem", opacity: 0.4 }} />}
                      {ch}
                    </button>
                  ))}
                </div>
              </>)}

              {/* Topic Wise — chapter grouped */}
              {selMode === "topicwise" && (<>
                <label className="tg2-label">
                  <i className="fa-solid fa-tags" /> Topics by Chapter
                  <span className="tg2-label-hint"> — {selTopics.length} selected</span>
                </label>
                <div className="tg2-topic-sections">
                  {chapters.map(ch => {
                    const chTopics = topicsData[ch] || [];
                    if (chTopics.length === 0) return null;
                    const allSel   = chTopics.every(t => selTopics.includes(t));
                    const someSel  = chTopics.some(t => selTopics.includes(t));
                    const selCount = chTopics.filter(t => selTopics.includes(t)).length;
                    return (
                      <div key={ch} className="tg2-topic-chapter">
                        <div className="tg2-topic-chapter-header">
                          <span className="tg2-topic-chapter-name">
                            <i className="fa-solid fa-book-open" /> {ch}
                          </span>
                          <div className="tg2-topic-chapter-actions">
                            <span className="tg2-topic-count">{selCount}/{chTopics.length}</span>
                            <button type="button"
                              className={`tg2-select-all-btn ${allSel ? "active" : someSel ? "partial" : ""}`}
                              onClick={() => selectAllTopics(ch)}>
                              {allSel
                                ? <><i className="fa-solid fa-xmark" /> Deselect All</>
                                : <><i className="fa-solid fa-check-double" /> Select All</>}
                            </button>
                          </div>
                        </div>
                        <div className="tg2-topic-grid">
                          {chTopics.map(t => (
                            <button key={t} type="button"
                              className={`tg2-topic-btn ${selTopics.includes(t) ? "selected" : ""}`}
                              onClick={() => toggleTopic(t)}>
                              <i className={selTopics.includes(t) ? "fa-solid fa-circle-check" : "fa-regular fa-circle"} />
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>)}

              <label className="tg2-label" style={{ marginTop: "1.8rem" }}>
                <i className="fa-solid fa-filter" /> Selection Category
              </label>
              <div className="tg2-options">
                {SELECTION_CATEGORIES.map(c => {
                  const cf = categoryFA[c.val] || { icon: "fa-circle", color: "#38bdf8" };
                  return <OptionBtn key={c.val} faIcon={cf.icon} color={cf.color} label={c.label} desc={c.desc} selected={category === c.val} onClick={() => setCategory(c.val)} />;
                })}
              </div>

              <label className="tg2-label" style={{ marginTop: "1.8rem" }}>
                <i className="fa-solid fa-file-contract" /> Paper Type
              </label>
              <div className="tg2-options">
                <OptionBtn faIcon="fa-check-double" color="#34d399" label="With Choice" desc="Students attempt selected questions" selected={hasChoice === true} onClick={() => setHasChoice(true)} />
                <OptionBtn faIcon="fa-list-check" color="#f472b6" label="No Choice" desc="All questions are compulsory" selected={hasChoice === false} onClick={() => setHasChoice(false)} />
              </div>

              {hasChoice !== null && (<>
                <label className="tg2-label" style={{ marginTop: "1.8rem" }}>
                  <i className="fa-solid fa-bullseye" /> Total Marks
                </label>
                <div className="tg2-marks-grid">
                  {MARK_OPTIONS.map(m => (
                    <button key={m} type="button"
                      className={`tg2-marks-btn ${totalMarks === String(m) ? "selected" : ""}`}
                      onClick={() => setTotalMarks(String(m))}>
                      <strong>{m}</strong>
                      <small>Marks</small>
                      <div className="tg2-marks-breakdown">
                        <span><i className="fa-solid fa-circle-dot" /> {marksConfig[m].mcq} MCQ</span>
                        <span><i className="fa-solid fa-pen" /> {marksConfig[m].sq} SQ</span>
                        <span><i className="fa-solid fa-file-pen" /> {marksConfig[m].lq} LQ</span>
                      </div>
                    </button>
                  ))}
                </div>
              </>)}
            </>)}

            {/* Custom */}
            {selType === "custom" && (<>
              <p className="tg2-sub">Manually set the number of each question type.</p>
              <div className="tg2-custom-grid">
                {[
                  { key: "mcq", label: "MCQs",           icon: "fa-circle-dot", color: "#38bdf8", marks: "1 mark each" },
                  { key: "sq",  label: "Short Questions", icon: "fa-pen",        color: "#a78bfa", marks: "3 marks each" },
                  { key: "lq",  label: "Long Questions",  icon: "fa-file-pen",   color: "#f472b6", marks: "5 marks each" },
                ].map(({ key, label, icon, color, marks }) => (
                  <div key={key} className="tg2-custom-item">
                    <div className="tg2-custom-left">
                      <div className="tg2-custom-icon" style={{ background: color + "18" }}>
                        <i className={`fa-solid ${icon}`} style={{ color }} />
                      </div>
                      <div><strong>{label}</strong><small>{marks}</small></div>
                    </div>
                    <div className="tg2-counter">
                      <button type="button" onClick={() => setCustomCounts(p => ({ ...p, [key]: Math.max(0, p[key] - 1) }))}><i className="fa-solid fa-minus" /></button>
                      <span>{customCounts[key]}</span>
                      <button type="button" onClick={() => setCustomCounts(p => ({ ...p, [key]: p[key] + 1 }))}><i className="fa-solid fa-plus" /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="tg2-total-bar">
                <span><i className="fa-solid fa-calculator" /> Total Marks</span>
                <strong>{customCounts.mcq + customCounts.sq * 3 + customCounts.lq * 5}</strong>
              </div>
            </>)}
          </div>
        )}

        {/* Nav */}
        <div className="tg2-nav">
          {step > 1 && (
            <button className="tg2-btn-back" onClick={() => setStep(step - 1)}>
              <i className="fa-solid fa-arrow-left" /> Back
            </button>
          )}
          <div style={{ flex: 1 }} />
          {step < 3
            ? <button className="tg2-btn-next" disabled={step === 1 ? !canStep1 : !canStep2} onClick={() => setStep(step + 1)}>Next <i className="fa-solid fa-arrow-right" /></button>
            : <button className="tg2-btn-generate" disabled={!canStep3()} onClick={handleGenerate}><i className="fa-solid fa-bolt" /> Generate Test</button>
          }
        </div>
      </div>
    </div>
  );
}
