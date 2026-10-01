"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AllTestsPage() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedTests") || "[]");
    setTests(saved);
  }, []);

  const confirmDelete = (id) => setDeleteId(id);

  const handleDelete = () => {
    const updated = tests.filter((t) => t.id !== deleteId);
    localStorage.setItem("savedTests", JSON.stringify(updated));
    setTests(updated);
    setDeleteId(null);
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" });
  };

  const totalMarks = (paper) =>
    (paper?.mcqs?.length || 0) + (paper?.sqs?.length || 0) * 3 + (paper?.lqs?.length || 0) * 5;

  const typeColor = { random: "#38bdf8", self: "#a78bfa", ai: "#f472b6", board: "#34d399", custom: "#fb923c" };
  const typeLabel = { random: "Random", self: "Self", ai: "AI", board: "Board", custom: "Custom" };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.3rem" }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12,
              background: "linear-gradient(135deg,#38bdf8,#818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", color: "#0b0f1a", flexShrink: 0,
            }}>
              <i className="fa-solid fa-list-check" />
            </div>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0 }}>All Tests</h2>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.82rem", margin: 0 }}>
                {tests.length} test{tests.length !== 1 ? "s" : ""} saved
              </p>
            </div>
          </div>
        </div>
        <Link href="/dashboard-user/test-generator"
          style={{
            display: "flex", alignItems: "center", gap: "0.5rem",
            padding: "0.65rem 1.3rem", borderRadius: 10, border: "none",
            background: "linear-gradient(135deg,#38bdf8,#818cf8)",
            color: "#0b0f1a", fontWeight: 700, fontSize: "0.88rem",
            textDecoration: "none",
          }}>
          <i className="fa-solid fa-plus" /> New Test
        </Link>
      </div>

      {/* Empty state */}
      {tests.length === 0 && (
        <div style={{
          textAlign: "center", padding: "4rem 2rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: 18,
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
          <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>No tests yet</h3>
          <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Generate your first test paper to see it here.
          </p>
          <Link href="/dashboard-user/test-generator"
            style={{
              padding: "0.7rem 1.5rem", borderRadius: 10,
              background: "linear-gradient(135deg,#38bdf8,#818cf8)",
              color: "#0b0f1a", fontWeight: 700, fontSize: "0.9rem",
              textDecoration: "none",
            }}>
            <i className="fa-solid fa-file-pen" style={{ marginRight: 8 }} />Generate Test
          </Link>
        </div>
      )}

      {/* Tests list */}
      {tests.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {tests.map((t, idx) => {
            const cfg = t.config || {};
            const marks = totalMarks(t.paper);
            const color = typeColor[cfg.selType] || "#38bdf8";
            return (
              <div key={t.id} style={{
                display: "flex", alignItems: "center", gap: "1rem",
                padding: "1.1rem 1.4rem",
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 14,
                transition: "0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                {/* Index */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                  background: `${color}18`, border: `1px solid ${color}33`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.85rem", fontWeight: 700, color,
                }}>
                  {idx + 1}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "0.3rem" }}>
                    <span style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>
                      Class {cfg.classNo} — {cfg.subject}
                    </span>
                    <span style={{
                      padding: "0.15rem 0.55rem", borderRadius: 6,
                      background: `${color}18`, border: `1px solid ${color}33`,
                      color, fontSize: "0.72rem", fontWeight: 600,
                    }}>
                      {typeLabel[cfg.selType] || cfg.selType}
                    </span>
                    {cfg.hasChoice && (
                      <span style={{
                        padding: "0.15rem 0.55rem", borderRadius: 6,
                        background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
                        color: "#34d399", fontSize: "0.72rem", fontWeight: 600,
                      }}>With Choice</span>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                      <i className="fa-solid fa-building-columns" style={{ marginRight: 4, color: "rgba(255,255,255,0.3)" }} />
                      {cfg.board} Board
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                      <i className="fa-solid fa-star" style={{ marginRight: 4, color: "rgba(255,255,255,0.3)" }} />
                      {marks} Marks
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                      <i className="fa-regular fa-clock" style={{ marginRight: 4, color: "rgba(255,255,255,0.3)" }} />
                      {formatDate(t.createdAt)}
                    </span>
                    <span style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.45)" }}>
                      MCQ:{t.paper?.mcqs?.length || 0} · SQ:{t.paper?.sqs?.length || 0} · LQ:{t.paper?.lqs?.length || 0}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                  <Link href={`/dashboard-user/edit-exam/${t.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.45rem 0.9rem", borderRadius: 8,
                      border: "1px solid rgba(56,189,248,0.3)",
                      background: "rgba(56,189,248,0.08)",
                      color: "#38bdf8", fontSize: "0.8rem", fontWeight: 600,
                      textDecoration: "none", transition: "0.2s",
                    }}>
                    <i className="fa-solid fa-pen" /> Edit
                  </Link>
                  <button onClick={() => confirmDelete(t.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.45rem 0.9rem", borderRadius: 8,
                      border: "1px solid rgba(248,113,113,0.3)",
                      background: "rgba(248,113,113,0.08)",
                      color: "#f87171", fontSize: "0.8rem", fontWeight: 600,
                      cursor: "pointer", transition: "0.2s",
                    }}>
                    <i className="fa-solid fa-trash" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete confirm modal */}
      {deleteId && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
        }}>
          <div style={{
            background: "#0f172a", border: "1px solid rgba(248,113,113,0.25)",
            borderRadius: 18, padding: "2rem", width: "100%", maxWidth: 380, textAlign: "center",
          }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🗑️</div>
            <h3 style={{ color: "#fff", marginBottom: "0.5rem" }}>Delete this test?</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.88rem", marginBottom: "1.5rem" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
              <button onClick={() => setDeleteId(null)}
                style={{
                  padding: "0.65rem 1.4rem", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.12)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.7)", cursor: "pointer", fontWeight: 600,
                }}>Cancel</button>
              <button onClick={handleDelete}
                style={{
                  padding: "0.65rem 1.4rem", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg,#ef4444,#f87171)",
                  color: "#fff", cursor: "pointer", fontWeight: 700,
                }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
