"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Users, Plus, Trash2, Phone, Mail, Shield } from "lucide-react";

export default function Staff() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState({ name: "", email: "", phone: "", role: "staff", password: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    const b = JSON.parse(stored);
    setBusiness(b);
    fetchStaff(b.id);
  }, []);

  async function fetchStaff(id) {
    try {
      const res = await fetch(`/api/staff?businessId=${id}`);
      const data = await res.json();
      setStaff(data.staff || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleAdd() {
    if (!form.name) { setError("Name is required!"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, businessId: business.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setStaff([...staff, data.staff]);
        setForm({ name: "", email: "", phone: "", role: "staff" });
        setShowForm(false);
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (e) { setError("Server error!"); }
    setSaving(false);
  }

  async function handleDelete(id) {
    if (!confirm("Delete this staff member?")) return;
    try {
      const res = await fetch(`/api/staff?id=${id}`, { method: "DELETE" });
      if (res.ok) setStaff(staff.filter(s => s.id !== id));
    } catch (e) { console.error(e); }
  }

  if (!business) return null;

  return (
    <Layout>
      <style>{`
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.75rem 1rem; transition: border 0.2s; }
        .inp:focus { outline: none; border-color: #1D9E75; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        select.inp { cursor: pointer; }
        .btn { background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 1px; padding: 0.65rem 1.2rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.15); border-radius: 8px; color: rgba(255,255,255,0.6); font-family: Montserrat,sans-serif; font-size: 0.78rem; padding: 0.65rem 1.2rem; cursor: pointer; transition: all 0.2s; }
        .btn-outline:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .btn-danger { background: transparent; border: none; color: rgba(226,75,74,0.6); cursor: pointer; padding: 6px; border-radius: 6px; transition: all 0.2s; display: flex; align-items: center; }
        .btn-danger:hover { background: rgba(226,75,74,0.1); color: #E24B4A; }
        .staff-card { background: rgba(255,255,255,0.02); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s; }
        .staff-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.14); }
        .role-badge { font-size: 0.65rem; letter-spacing: 1.5px; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; font-weight: 500; }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Staff</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
            {staff.length} team members
          </p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={15}/> Add Staff
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.7)" }}>NEW STAFF MEMBER</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <input className="inp" type="text" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
            <input className="inp" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}/>
            <input className="inp" type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}/>
            <input className="inp" type="password" placeholder="Set Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}/>
            <select className="inp" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="receptionist">Receptionist</option>
            </select>
          </div>
          {error && <p style={{ color: "#E24B4A", fontSize: "0.75rem", marginBottom: "0.75rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn" onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Member"}</button>
            <button className="btn-outline" onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div className="card">
        <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>TEAM MEMBERS</h2>
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
        ) : staff.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <Users size={32} style={{ color: "rgba(255,255,255,0.15)", marginBottom: "1rem" }}/>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>No staff members yet.</p>
            <button className="btn" style={{ margin: "1rem auto 0", justifyContent: "center" }} onClick={() => setShowForm(true)}>
              <Plus size={14}/> Add First Member
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {staff.map((member) => (
              <div key={member.id} className="staff-card">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Avatar */}
                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "rgba(29,158,117,0.12)", border: "0.5px solid rgba(29,158,117,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: 500, color: "#1D9E75", flexShrink: 0 }}>
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <p style={{ fontSize: "0.88rem", fontWeight: 500 }}>{member.name}</p>
                      <span className="role-badge" style={{
                        background: member.role === "manager" ? "rgba(239,159,39,0.12)" : "rgba(29,158,117,0.1)",
                        color: member.role === "manager" ? "#EF9F27" : "#1D9E75",
                        border: `0.5px solid ${member.role === "manager" ? "rgba(239,159,39,0.25)" : "rgba(29,158,117,0.2)"}`,
                      }}>
                        {member.role}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      {member.email && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                          <Mail size={11}/> {member.email}
                        </span>
                      )}
                      {member.phone && (
                        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                          <Phone size={11}/> {member.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button className="btn-danger" onClick={() => handleDelete(member.id)}>
                  <Trash2 size={15}/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}