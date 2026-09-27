"use client";
import { useState } from "react";

export default function TextGenerate() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(`Generated content for: "${prompt}"\n\nThis is a placeholder response. Connect an AI API (OpenAI, Gemini, etc.) to get real AI-generated text based on your prompt.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="ud-textgen">
      <h2>Text Generate</h2>
      <p className="tg-sub">Enter a prompt and let AI generate content for you.</p>
      <div className="ud-textgen-box">
        <textarea
          className="tg-input"
          rows={4}
          placeholder="e.g. Write a summary of Newton's Laws of Motion..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button className="auth-btn" onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "🤖 Generate"}
        </button>
      </div>
      {result && (
        <div className="ud-textgen-result">
          <h4>Generated Text</h4>
          <pre>{result}</pre>
        </div>
      )}
    </div>
  );
}
