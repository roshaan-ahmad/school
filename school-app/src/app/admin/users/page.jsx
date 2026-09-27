"use client";
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    setTeachers(JSON.parse(localStorage.getItem("teachers") || "[]"));
  }, []);

  const deleteUser = (id) => {
    const updated = teachers.filter(t => t.id !== id);
    setTeachers(updated);
    localStorage.setItem("teachers", JSON.stringify(updated));
  };

  const statusColor = { pending:"#fbbf24", verified:"#34d399", rejected:"#f87171" };

  return (
    <div>
      <h2 className="admin-section-title">All Users</h2>
      {teachers.length === 0 ? (
        <div className="admin-empty">No users registered yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th>Joined</th><th>Action</th></tr>
            </thead>
            <tbody>
              {teachers.map((t, i) => (
                <tr key={t.id}>
                  <td>{i + 1}</td>
                  <td>{t.name}</td>
                  <td>{t.email}</td>
                  <td><span className="ud-role-badge">{t.role}</span></td>
                  <td>
                    <span className="admin-status-badge" style={{ background: statusColor[t.status]+"22", color: statusColor[t.status] }}>
                      {t.status}
                    </span>
                  </td>
                  <td style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.8rem" }}>
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button className="admin-btn delete" onClick={() => deleteUser(t.id)}>🗑️ Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
