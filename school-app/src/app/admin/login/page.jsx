"use client";
import { useState } from "react";

const ADMIN_EMAIL    = "admin@unisoft.com";
const ADMIN_PASSWORD = "admin@123";

export default function AdminLoginPage() {
  const [form, setForm]   = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [show, setShow]   = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.email===ADMIN_EMAIL && form.password===ADMIN_PASSWORD) {
      localStorage.setItem("adminAuth","true");
      window.location.href = "/admin";
    } else {
      setError("Invalid admin credentials.");
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <div className="admin-login-icon">
          <i className="fa-solid fa-shield-halved" />
        </div>
        <h1><span>Admin</span> Panel</h1>
        <p>Restricted access — authorized personnel only</p>

        <form onSubmit={handleSubmit} className="auth-form" style={{marginTop:"1.8rem"}}>
          <div className="input-group input-icon-group">
            <i className="fa-solid fa-envelope input-icon" />
            <input type="email" placeholder="Admin Email" value={form.email}
              onChange={e=>setForm({...form,email:e.target.value})} required />
          </div>
          <div className="input-group input-icon-group">
            <i className="fa-solid fa-lock input-icon" />
            <input type={show?"text":"password"} placeholder="Admin Password" value={form.password}
              onChange={e=>setForm({...form,password:e.target.value})} required />
            <button type="button" className="input-eye" onClick={()=>setShow(!show)}>
              <i className={`fa-solid ${show?"fa-eye-slash":"fa-eye"}`} />
            </button>
          </div>
          {error && <p className="auth-error"><i className="fa-solid fa-triangle-exclamation" style={{marginRight:"6px"}} />{error}</p>}
          <button type="submit" className="auth-btn">
            <i className="fa-solid fa-right-to-bracket" style={{marginRight:"8px"}} />Access Admin Panel
          </button>
        </form>
      </div>
    </div>
  );
}
