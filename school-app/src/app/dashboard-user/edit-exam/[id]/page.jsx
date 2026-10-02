"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getCurrentUserEmail, readLocalTests, saveTestToMongo, syncTestsWithMongo, writeLocalTests } from "../../../lib/saved-tests";

const SECTION_META = {
  mcqs: { label: "MCQs",            icon: "fa-circle-dot",   color: "#38bdf8",  marks: 1 },
  sqs:  { label: "Short Questions", icon: "fa-pen-to-square", color: "#a78bfa", marks: 3 },
  lqs:  { label: "Long Questions",  icon: "fa-file-lines",    color: "#f472b6", marks: 5 },
};

export default function EditExamPage() {
  const router = useRouter();
  const { id } = useParams();

  const [test, setTest]       = useState(null);
  const [paper, setPaper]     = useState(null);
  const [editing, setEditing] = useState(null); // { section, index }
  const [editVal, setEditVal] = useState("");
  const [saved, setSaved]     = useState(false);
  const [saveError, setSaveError] = useState("");
  const [adding, setAdding]   = useState(null); // section key
  const [addVal, setAddVal]   = useState("");

  useEffect(() => {
    let cancelled = false;
    const showTest = (all) => {
      const found = all.find((item) => item.id === id);
      if (!found) return false;
      setTest(found);
      setPaper(JSON.parse(JSON.stringify(found.paper)));
      return true;
    };

    const localTests = readLocalTests();
    const foundLocally = showTest(localTests);
    const email = getCurrentUserEmail();
    if (!email) {
      if (!foundLocally) router.push("/dashboard-user/all-tests");
      return () => { cancelled = true; };
    }

    syncTestsWithMongo(email)
      .then((all) => {
        if (!cancelled && !showTest(all)) router.push("/dashboard-user/all-tests");
      })
      .catch((error) => {
        console.error("Could not load test from MongoDB:", error);
        if (!cancelled && !foundLocally) router.push("/dashboard-user/all-tests");
      });

    return () => { cancelled = true; };
  }, [id]);

  if (!test || !paper) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
      <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: "2rem", color: "#38bdf8" }} />
    </div>
  );

  const cfg = test.config || {};
  const totalMarks = paper.mcqs.length + paper.sqs.length * 3 + paper.lqs.length * 5;

  // ── Edit question ──
  const startEdit = (section, index) => {
    setEditing({ section, index });
    setEditVal(paper[section][index].q);
  };

  const saveEdit = () => {
    const updated = { ...paper };
    updated[editing.section] = [...updated[editing.section]];
    updated[editing.section][editing.index] = { ...updated[editing.section][editing.index], q: editVal.trim() };
    setPaper(updated);
    setEditing(null);
    setEditVal("");
  };

  // ── Delete question ──
  const deleteQ = (section, index) => {
    const updated = { ...paper };
    updated[section] = updated[section].filter((_, i) => i !== index);
    setPaper(updated);
  };

  // ── Add question ──
  const startAdd = (section) => { setAdding(section); setAddVal(""); };

  const saveAdd = () => {
    if (!addVal.trim()) return;
    const updated = { ...paper };
    const newQ = adding === "mcqs"
      ? { q: addVal.trim(), options: ["Option A", "Option B", "Option C", "Option D"] }
      : { q: addVal.trim() };
    updated[adding] = [...updated[adding], newQ];
    setPaper(updated);
    setAdding(null);
    setAddVal("");
  };

  // ── Save to localStorage ──
  const handleSave = async () => {
    const updatedTest = { ...test, paper };
    const all = readLocalTests();
    writeLocalTests(all.map((item) => item.id === id ? updatedTest : item));
    setSaveError("");
    try {
      await saveTestToMongo(getCurrentUserEmail(), updatedTest);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (error) {
      console.error("Could not save edited test to MongoDB:", error);
      writeLocalTests(readLocalTests().map((item) => item.id === id ? { ...updatedTest, syncPending: true } : item));
      setSaved(false);
      setSaveError("Changes are on this device, but MongoDB sync failed.");
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <button onClick={() => router.push("/dashboard-user/all-tests")}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              background: "none", border: "none", color: "rgba(255,255,255,0.5)",
              cursor: "pointer", fontSize: "0.82rem", marginBottom: "0.6rem", padding: 0,
            }}>
            <i className="fa-solid fa-arrow-left" /> Back to All Tests
          </button>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: "0 0 0.3rem" }}>
            Edit Exam
          </h2>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {[
              `Class ${cfg.classNo}`, cfg.subject, `${cfg.board} Board`, `${totalMarks} Marks`,
              `MCQ:${paper.mcqs.length}`, `SQ:${paper.sqs.length}`, `LQ:${paper.lqs.length}`,
            ].map((tag) => (
              <span key={tag} style={{
                padding: "0.2rem 0.6rem", borderRadius: 7,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.6)", fontSize: "0.75rem",
              }}>{tag}</span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "0.7rem", flexWrap: "wrap" }}>
          <button onClick={() => window.print()}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.65rem 1.2rem", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.05)",
              color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 600, fontSize: "0.85rem",
            }}>
            <i className="fa-solid fa-print" /> Print
          </button>
          <button onClick={handleSave}
            style={{
              display: "flex", alignItems: "center", gap: "0.4rem",
              padding: "0.65rem 1.4rem", borderRadius: 10, border: "none",
              background: saved ? "linear-gradient(135deg,#34d399,#059669)" : "linear-gradient(135deg,#38bdf8,#818cf8)",
              color: "#0b0f1a", cursor: "pointer", fontWeight: 700, fontSize: "0.88rem",
              transition: "0.3s",
            }}>
            <i className={`fa-solid ${saved ? "fa-check" : "fa-floppy-disk"}`} />
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {saveError && <p role="alert" style={{ color: "#fbbf24", fontSize: "0.82rem", margin: "-0.7rem 0 1rem" }}>{saveError}</p>}

      {/* Sections */}
      {(["mcqs", "sqs", "lqs"]).map((sec) => {
        const meta = SECTION_META[sec];
        const questions = paper[sec];
        return (
          <div key={sec} style={{
            marginBottom: "1.5rem",
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {/* Section header */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1rem 1.4rem",
              background: `${meta.color}08`,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${meta.color}18`, border: `1px solid ${meta.color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: meta.color, fontSize: "0.9rem",
                }}>
                  <i className={`fa-solid ${meta.icon}`} />
                </div>
                <div>
                  <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>{meta.label}</span>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem", marginLeft: "0.6rem" }}>
                    {questions.length} questions · {questions.length * meta.marks} marks
                  </span>
                </div>
              </div>
              <button onClick={() => startAdd(sec)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.4rem 0.9rem", borderRadius: 8,
                  border: `1px solid ${meta.color}33`,
                  background: `${meta.color}10`,
                  color: meta.color, fontSize: "0.78rem", fontWeight: 600,
                  cursor: "pointer",
                }}>
                <i className="fa-solid fa-plus" /> Add
              </button>
            </div>

            {/* Questions */}
            <div style={{ padding: "0.5rem 0" }}>
              {questions.length === 0 && (
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.85rem", padding: "1rem 1.4rem", margin: 0 }}>
                  No questions. Click Add to insert one.
                </p>
              )}
              {questions.map((q, i) => (
                <div key={i}>
                  {editing?.section === sec && editing?.index === i ? (
                    /* Edit mode */
                    <div style={{ padding: "0.8rem 1.4rem", background: "rgba(56,189,248,0.04)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <textarea
                        rows={3}
                        value={editVal}
                        onChange={(e) => setEditVal(e.target.value)}
                        style={{
                          width: "100%", padding: "0.75rem", borderRadius: 10,
                          background: "rgba(255,255,255,0.06)",
                          border: "1.5px solid #38bdf8",
                          color: "#fff", fontSize: "0.88rem", outline: "none",
                          resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
                        }}
                      />
                      <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
                        <button onClick={saveEdit}
                          style={{
                            padding: "0.45rem 1rem", borderRadius: 8, border: "none",
                            background: "linear-gradient(135deg,#38bdf8,#818cf8)",
                            color: "#0b0f1a", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                          }}>
                          <i className="fa-solid fa-check" style={{ marginRight: 5 }} />Save
                        </button>
                        <button onClick={() => setEditing(null)}
                          style={{
                            padding: "0.45rem 1rem", borderRadius: 8,
                            border: "1px solid rgba(255,255,255,0.12)",
                            background: "rgba(255,255,255,0.05)",
                            color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", cursor: "pointer",
                          }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View mode */
                    <div style={{
                      display: "flex", alignItems: "flex-start", gap: "0.8rem",
                      padding: "0.85rem 1.4rem",
                      borderBottom: i < questions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <span style={{
                        minWidth: 26, height: 26, borderRadius: 7,
                        background: `${meta.color}15`, color: meta.color,
                        fontSize: "0.72rem", fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0, marginTop: 2,
                      }}>
                        {i + 1}
                      </span>
                      <p style={{ flex: 1, color: "rgba(255,255,255,0.85)", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
                        {q.q}
                        {sec === "mcqs" && q.options && (
                          <span style={{ display: "block", marginTop: "0.4rem", color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
                            {q.options.map((o, j) => `${String.fromCharCode(65+j)}. ${o}`).join("  ·  ")}
                          </span>
                        )}
                      </p>
                      <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                        <button onClick={() => startEdit(sec, i)}
                          style={{
                            width: 30, height: 30, borderRadius: 7,
                            border: "1px solid rgba(56,189,248,0.25)",
                            background: "rgba(56,189,248,0.08)",
                            color: "#38bdf8", cursor: "pointer", fontSize: "0.75rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          <i className="fa-solid fa-pen" />
                        </button>
                        <button onClick={() => deleteQ(sec, i)}
                          style={{
                            width: 30, height: 30, borderRadius: 7,
                            border: "1px solid rgba(248,113,113,0.25)",
                            background: "rgba(248,113,113,0.08)",
                            color: "#f87171", cursor: "pointer", fontSize: "0.75rem",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>
                          <i className="fa-solid fa-trash" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Add new question inline */}
              {adding === sec && (
                <div style={{ padding: "0.8rem 1.4rem", background: `${meta.color}05`, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <p style={{ color: meta.color, fontSize: "0.78rem", fontWeight: 700, marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    <i className="fa-solid fa-plus" style={{ marginRight: 5 }} />New {meta.label.slice(0, -1)}
                  </p>
                  <textarea
                    rows={3}
                    placeholder={`Type the question here...`}
                    value={addVal}
                    onChange={(e) => setAddVal(e.target.value)}
                    style={{
                      width: "100%", padding: "0.75rem", borderRadius: 10,
                      background: "rgba(255,255,255,0.06)",
                      border: `1.5px solid ${meta.color}`,
                      color: "#fff", fontSize: "0.88rem", outline: "none",
                      resize: "vertical", fontFamily: "inherit", lineHeight: 1.6,
                    }}
                  />
                  <div style={{ display: "flex", gap: "0.6rem", marginTop: "0.6rem" }}>
                    <button onClick={saveAdd}
                      style={{
                        padding: "0.45rem 1rem", borderRadius: 8, border: "none",
                        background: `linear-gradient(135deg,${meta.color},#818cf8)`,
                        color: "#0b0f1a", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer",
                      }}>
                      <i className="fa-solid fa-plus" style={{ marginRight: 5 }} />Add Question
                    </button>
                    <button onClick={() => setAdding(null)}
                      style={{
                        padding: "0.45rem 1rem", borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.12)",
                        background: "rgba(255,255,255,0.05)",
                        color: "rgba(255,255,255,0.7)", fontSize: "0.82rem", cursor: "pointer",
                      }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.8rem", paddingTop: "0.5rem" }}>
        <button onClick={() => router.push("/dashboard-user/all-tests")}
          style={{
            padding: "0.7rem 1.4rem", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 600,
          }}>
          Cancel
        </button>
        <button onClick={handleSave}
          style={{
            padding: "0.7rem 1.8rem", borderRadius: 10, border: "none",
            background: saved ? "linear-gradient(135deg,#34d399,#059669)" : "linear-gradient(135deg,#38bdf8,#818cf8)",
            color: "#0b0f1a", cursor: "pointer", fontWeight: 700, transition: "0.3s",
          }}>
          <i className={`fa-solid ${saved ? "fa-check" : "fa-floppy-disk"}`} style={{ marginRight: 7 }} />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
