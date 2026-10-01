"use client";
import { useEffect, useState } from "react";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [filter, setFilter]     = useState("all");
  const [editing, setEditing]   = useState(null);

  useEffect(() => { setTeachers(JSON.parse(localStorage.getItem("teachers") || "[]")); }, []);

  const save = (list) => { setTeachers(list); localStorage.setItem("teachers", JSON.stringify(list)); };
  const updateStatus  = (id, status) => save(teachers.map(t => t.id===id ? {...t,status} : t));
  const deleteTeacher = (id) => save(teachers.filter(t => t.id!==id));
  const saveEdit = () => { save(teachers.map(t => t.id===editing.id ? editing : t)); setEditing(null); };

  const filtered = filter==="all" ? teachers : teachers.filter(t=>t.status===filter);

  const statusMeta = {
    pending:  { color:"#fbbf24", icon:"fa-clock" },
    verified: { color:"#34d399", icon:"fa-circle-check" },
    rejected: { color:"#f87171", icon:"fa-circle-xmark" },
  };

  const filterCounts = { all:teachers.length, pending:teachers.filter(t=>t.status==="pending").length, verified:teachers.filter(t=>t.status==="verified").length, rejected:teachers.filter(t=>t.status==="rejected").length };

  return (
    <div>
      <h2 className="admin-section-title">
        <i className="fa-solid fa-chalkboard-user" style={{marginRight:"10px",color:"#f472b6"}} />Teachers
      </h2>

      <div className="admin-filter-tabs">
        {["all","pending","verified","rejected"].map(f => (
          <button key={f} className={`admin-filter-btn ${filter===f?"active":""}`} onClick={()=>setFilter(f)}>
            {f!=="all" && <i className={`fa-solid ${statusMeta[f]?.icon}`} style={{marginRight:"5px",color:statusMeta[f]?.color}} />}
            {f.charAt(0).toUpperCase()+f.slice(1)} <span className="admin-filter-count">{filterCounts[f]}</span>
          </button>
        ))}
      </div>

      {filtered.length===0 ? (
        <div className="admin-empty">
          <i className="fa-solid fa-inbox" style={{fontSize:"2rem",marginBottom:"0.8rem",display:"block"}} />
          No teachers found.
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr>
              <th><i className="fa-solid fa-user" style={{marginRight:"6px"}} />Name</th>
              <th><i className="fa-solid fa-envelope" style={{marginRight:"6px"}} />Email</th>
              <th><i className="fa-solid fa-book" style={{marginRight:"6px"}} />Subject</th>
              <th><i className="fa-solid fa-phone" style={{marginRight:"6px"}} />Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map(t => {
                const sm = statusMeta[t.status] || statusMeta.pending;
                return (
                  <tr key={t.id}>
                    <td><strong>{t.name}</strong></td>
                    <td>{t.email}</td>
                    <td>{t.subject||"—"}</td>
                    <td>{t.phone||"—"}</td>
                    <td>
                      <span className="admin-status-badge" style={{background:sm.color+"22",color:sm.color}}>
                        <i className={`fa-solid ${sm.icon}`} style={{marginRight:"5px"}} />{t.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        {t.status!=="verified" && <button className="admin-btn verify" onClick={()=>updateStatus(t.id,"verified")}><i className="fa-solid fa-check" /> Verify</button>}
                        {t.status!=="rejected" && <button className="admin-btn reject" onClick={()=>updateStatus(t.id,"rejected")}><i className="fa-solid fa-ban" /> Reject</button>}
                        <button className="admin-btn edit" onClick={()=>setEditing({...t})}><i className="fa-solid fa-pen" /> Edit</button>
                        <button className="admin-btn delete" onClick={()=>deleteTeacher(t.id)}><i className="fa-solid fa-trash" /> Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="admin-modal-overlay" onClick={()=>setEditing(null)}>
          <div className="admin-modal" onClick={e=>e.stopPropagation()}>
            <h3><i className="fa-solid fa-pen-to-square" style={{marginRight:"8px",color:"#38bdf8"}} />Edit Teacher</h3>
            {["name","email","phone","subject"].map(field=>(
              <div key={field} className="input-group" style={{marginBottom:"0.8rem"}}>
                <input type="text" placeholder={field.charAt(0).toUpperCase()+field.slice(1)}
                  value={editing[field]||""} onChange={e=>setEditing({...editing,[field]:e.target.value})} />
              </div>
            ))}
            <div style={{display:"flex",gap:"0.8rem",marginTop:"1rem"}}>
              <button className="auth-btn" style={{flex:1}} onClick={saveEdit}><i className="fa-solid fa-floppy-disk" style={{marginRight:"6px"}} />Save</button>
              <button className="btn secondary" style={{flex:1,padding:"0.85rem",borderRadius:"10px"}} onClick={()=>setEditing(null)}><i className="fa-solid fa-xmark" style={{marginRight:"6px"}} />Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
