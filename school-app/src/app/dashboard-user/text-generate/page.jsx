"use client";
import { useState } from "react";

const QUICK_PROMPTS = [
  { icon: "fa-atom", label: "Newton's Laws", text: "Explain Newton's three laws of motion with real-life examples." },
  { icon: "fa-dna", label: "Cell Biology", text: "Describe the structure and function of a cell in detail." },
  { icon: "fa-square-root-variable", label: "Quadratic Eq.", text: "Explain how to solve quadratic equations with examples." },
  { icon: "fa-flask", label: "Periodic Table", text: "Summarize the periodic table and its trends." },
  { icon: "fa-book-open", label: "Essay Intro", text: "Write an introduction paragraph for an essay on climate change." },
  { icon: "fa-lightbulb", label: "Study Tips", text: "Give 10 effective study tips for exam preparation." },
];

const TONES = [
  { val: "simple", label: "Simple", icon: "fa-child" },
  { val: "detailed", label: "Detailed", icon: "fa-list-ul" },
  { val: "exam", label: "Exam Style", icon: "fa-graduation-cap" },
  { val: "bullet", label: "Bullet Points", icon: "fa-circle-dot" },
];

export default function TextGenerate() {
  const [prompt, setPrompt]   = useState("");
  const [tone, setTone]       = useState("simple");
  const [result, setResult]   = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied]   = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResult("");
    setTimeout(() => {
      const toneNote = {
        simple:   "Here is a simple, easy-to-understand explanation:\n\n",
        detailed: "Here is a detailed breakdown:\n\n",
        exam:     "Exam-style answer:\n\n",
        bullet:   "Key points:\n\n• ",
      }[tone];
      setResult(
        toneNote +
        `This is a placeholder response for: "${prompt}"\n\n` +
        `Connect an AI API (OpenAI, Gemini, etc.) to get real AI-generated content based on your prompt and selected tone.`
      );
      setLoading(false);
    }, 1800);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg,#a78bfa,#f472b6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.2rem", color: "#fff", flexShrink: 0,
          }}>
            <i className="fa-solid fa-wand-sparkles" />
          </div>
          <div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", margin: 0 }}>AI Text Generator</h2>
            <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.85rem", margin: 0 }}>
              Generate study notes, explanations & more instantly
            </p>
          </div>
        </div>
      </div>

      {/* ── Quick Prompts ── */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.7rem" }}>
          <i className="fa-solid fa-bolt" style={{ marginRight: 6, color: "#f472b6" }} />Quick Prompts
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {QUICK_PROMPTS.map((q) => (
            <button key={q.label} onClick={() => { setPrompt(q.text); setCharCount(q.text.length); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.4rem 0.9rem", borderRadius: 8,
                border: "1px solid rgba(167,139,250,0.25)",
                background: prompt === q.text ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.03)",
                color: prompt === q.text ? "#a78bfa" : "rgba(255,255,255,0.65)",
                fontSize: "0.8rem", cursor: "pointer", transition: "0.2s",
                fontWeight: prompt === q.text ? 600 : 400,
              }}>
              <i className={`fa-solid ${q.icon}`} style={{ fontSize: "0.75rem" }} />
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Card ── */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 18, overflow: "hidden",
      }}>

        {/* Textarea */}
        <div style={{ padding: "1.5rem 1.5rem 0" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.7rem" }}>
            <i className="fa-solid fa-pen-to-square" style={{ marginRight: 6, color: "#38bdf8" }} />Your Prompt
          </p>
          <div style={{ position: "relative" }}>
            <textarea
              rows={5}
              placeholder="e.g. Explain photosynthesis in simple words with a diagram description..."
              value={prompt}
              onChange={(e) => { setPrompt(e.target.value); setCharCount(e.target.value.length); }}
              style={{
                width: "100%", padding: "1rem", borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                border: "1.5px solid rgba(255,255,255,0.1)",
                color: "#fff", fontSize: "0.92rem", outline: "none",
                resize: "vertical", lineHeight: 1.6,
                transition: "border-color 0.2s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => e.target.style.borderColor = "#a78bfa"}
              onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
            />
            <span style={{
              position: "absolute", bottom: 10, right: 12,
              fontSize: "0.72rem", color: "rgba(255,255,255,0.25)",
            }}>{charCount} chars</span>
          </div>
        </div>

        {/* Tone selector */}
        <div style={{ padding: "1rem 1.5rem" }}>
          <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: "0.7rem" }}>
            <i className="fa-solid fa-sliders" style={{ marginRight: 6, color: "#38bdf8" }} />Output Style
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            {TONES.map((t) => (
              <button key={t.val} onClick={() => setTone(t.val)}
                style={{
                  display: "flex", alignItems: "center", gap: "0.4rem",
                  padding: "0.5rem 1rem", borderRadius: 9,
                  border: tone === t.val ? "1.5px solid #38bdf8" : "1.5px solid rgba(255,255,255,0.1)",
                  background: tone === t.val ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.03)",
                  color: tone === t.val ? "#38bdf8" : "rgba(255,255,255,0.6)",
                  fontSize: "0.82rem", cursor: "pointer", transition: "0.2s",
                  fontWeight: tone === t.val ? 700 : 400,
                }}>
                <i className={`fa-solid ${t.icon}`} style={{ fontSize: "0.78rem" }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Generate button */}
        <div style={{ padding: "0 1.5rem 1.5rem" }}>
          <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
            style={{
              width: "100%", padding: "0.9rem",
              borderRadius: 12, border: "none",
              background: loading || !prompt.trim()
                ? "rgba(255,255,255,0.08)"
                : "linear-gradient(135deg,#a78bfa,#f472b6)",
              color: loading || !prompt.trim() ? "rgba(255,255,255,0.3)" : "#0b0f1a",
              fontWeight: 700, fontSize: "0.95rem", cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
              transition: "0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
            }}>
            {loading
              ? <><i className="fa-solid fa-circle-notch fa-spin" />Generating...</>
              : <><i className="fa-solid fa-wand-sparkles" />Generate Content</>}
          </button>
        </div>
      </div>

      {/* ── Result ── */}
      {result && (
        <div style={{
          marginTop: "1.5rem",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(167,139,250,0.2)",
          borderRadius: 18, overflow: "hidden",
        }}>
          {/* Result header */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "1rem 1.5rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(167,139,250,0.05)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <i className="fa-solid fa-file-lines" style={{ color: "#a78bfa" }} />
              <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#fff" }}>Generated Content</span>
              <span style={{
                padding: "0.15rem 0.6rem", borderRadius: 999,
                background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
                color: "#34d399", fontSize: "0.72rem", fontWeight: 600,
              }}>Ready</span>
            </div>
            <button onClick={handleCopy}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.4rem 0.9rem", borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.12)",
                background: copied ? "rgba(52,211,153,0.12)" : "rgba(255,255,255,0.05)",
                color: copied ? "#34d399" : "rgba(255,255,255,0.7)",
                fontSize: "0.8rem", cursor: "pointer", transition: "0.2s",
              }}>
              <i className={`fa-solid ${copied ? "fa-check" : "fa-copy"}`} />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          {/* Result text */}
          <div style={{ padding: "1.5rem" }}>
            <pre style={{
              whiteSpace: "pre-wrap", color: "rgba(255,255,255,0.85)",
              fontSize: "0.92rem", lineHeight: 1.8, fontFamily: "inherit", margin: 0,
            }}>{result}</pre>
          </div>

          {/* Actions */}
          <div style={{
            padding: "1rem 1.5rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex", gap: "0.7rem", flexWrap: "wrap",
          }}>
            <button onClick={() => { setResult(""); setPrompt(""); setCharCount(0); }}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1rem", borderRadius: 9,
                border: "1px solid rgba(248,113,113,0.25)",
                background: "rgba(248,113,113,0.08)",
                color: "#f87171", fontSize: "0.82rem", cursor: "pointer", transition: "0.2s",
              }}>
              <i className="fa-solid fa-trash" />Clear
            </button>
            <button onClick={handleGenerate}
              style={{
                display: "flex", alignItems: "center", gap: "0.4rem",
                padding: "0.5rem 1rem", borderRadius: 9,
                border: "1px solid rgba(56,189,248,0.25)",
                background: "rgba(56,189,248,0.08)",
                color: "#38bdf8", fontSize: "0.82rem", cursor: "pointer", transition: "0.2s",
              }}>
              <i className="fa-solid fa-rotate-right" />Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
