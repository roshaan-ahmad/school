"use client";
import { useEffect, useState } from "react";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter]     = useState("all");
  const [editing, setEditing]   = useState(null);

  useEffect(() => {
    setTeachers(JSON.parse(localStorage.getItem("teachers") || "[]"));
  }, []);

  const save = (list) => {
    setTeachers(list);
    localStorage.setItem("teachers", JSON.stringify(list));
  };

  const updateStatus = (id, status) =>
    save(teachers.map(t => t.id === id ? { ...t, status } : t));

  const deleteTeacher = (id) =>
    save(teachers.filter(t => t.id !== id));

  const saveEdit = () => {
    save(teachers.map(t => t.id === editing.id ? editing : t));
    setEditing(null);
  };

  const filtered = filter === "all" ? teachers : teachers.filter(t => t.status === filter);

  const statusColor = { pending: "#fbbf24", verified: "#34d399", rejected: "#f87171" };
  const statusIcon  = { pending: "⏳", verified: "✅", rejected: "❌" };

  return (
    <div>
      <h2 className="admin-section-title">Teachers</h2>

      {/* Filter tabs */}
      <div className="admin-filter-tabs">
        {["all","pending","verified","rejected"].map(f => (
          <button key={f} className={`admin-filter-btn ${filter===f?"active":""}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)} ({f==="all"?teachers.length:teachers.filter(t=>t.status===f).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="admin-empty">No teachers found.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Subject</th><th>Phone</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.subject || "—"}</td>
                  <td>{t.phone || "—"}</td>
                  <td>
                    <span className="admin-status-badge" style={{ background: statusColor[t.status]+"22", color: statusColor[t.status] }}>
                      {statusIcon[t.status]} {t.status}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions">
                      {t.status !== "verified"  && <button className="admin-btn verify"  onClick={() => updateStatus(t.id,"verified")}>✅ Verify</button>}
                      {t.status !== "rejected"  && <button className="admin-btn reject"  onClick={() => updateStatus(t.id,"rejected")}>❌ Reject</button>}
                      <button className="admin-btn edit"   onClick={() => setEditing({...t})}>✏️ Edit</button>
                      <button className="admin-btn delete" onClick={() => deleteTeacher(t.id)}>🗑️ Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="admin-modal-overlay" onClick={() => setEditing(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Teacher</h3>
            {["name","email","phone","subject"].map(field => (
              <div key={field} className="input-group" style={{ marginBottom:"0.8rem" }}>
                <input
                  type="text"
                  placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={editing[field] || ""}
                  onChange={e => setEditing({ ...editing, [field]: e.target.value })}
                />
              </div>
            ))}
            <div style={{ display:"flex", gap:"0.8rem", marginTop:"1rem" }}>
              <button className="auth-btn" style={{ flex:1 }} onClick={saveEdit}>Save</button>
              <button className="btn secondary" style={{ flex:1, padding:"0.85rem", borderRadius:"10px" }} onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
