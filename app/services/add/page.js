"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Plus, Trash2, Clock, IndianRupee } from "lucide-react";

export default function Services() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", duration: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    const b = JSON.parse(stored);
    setBusiness(b);
    fetchServices(b.id);
  }, []);

  async function fetchServices(id) {
    try {
      const res = await fetch(`/api/services?businessId=${id}`);
      const data = await res.json();
      setServices(data.services || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleAdd() {
    if (!form.name || !form.price || !form.duration) { setError("All fields are required!"); return; }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, price: parseFloat(form.price), duration: parseInt(form.duration), businessId: business.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setServices([...services, data.service]);
        setForm({ name: "", price: "", duration: "" });
        setShowForm(false);
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (e) { setError("Server error!"); }
    setSaving(false);
  }

  if (!business) return null;

  return (
    <Layout>
      <style>{`
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.75rem 1rem; transition: border 0.2s; }
        .inp:focus { outline: none; border-color: #1D9E75; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        .btn { background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 1px; padding: 0.65rem 1.2rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.15); border-radius: 8px; color: rgba(255,255,255,0.6); font-family: Montserrat,sans-serif; font-size: 0.78rem; padding: 0.65rem 1.2rem; cursor: pointer; }
        .service-card { background: rgba(255,255,255,0.02); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; transition: all 0.2s; }
        .service-card:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Services</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>{services.length} services</p>
        </div>
        <button className="btn" onClick={() => setShowForm(!showForm)}>
          <Plus size={15}/> Add Service
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>NEW SERVICE</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
            <input className="inp" type="text" placeholder="Service Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/>
            <input className="inp" type="number" placeholder="Price (₹) *" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}/>
            <input className="inp" type="number" placeholder="Duration (mins) *" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}/>
          </div>
          {error && <p style={{ color: "#E24B4A", fontSize: "0.75rem", marginBottom: "0.75rem" }}>{error}</p>}
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button className="btn" onClick={handleAdd} disabled={saving}>{saving ? "Adding..." : "Add Service"}</button>
            <button className="btn-outline" onClick={() => { setShowForm(false); setError(""); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Services List */}
      <div className="card">
        <h2 style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>ALL SERVICES</h2>
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
        ) : services.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", marginBottom: "1rem" }}>No services yet.</p>
            <button className="btn" style={{ margin: "0 auto", justifyContent: "center" }} onClick={() => setShowForm(true)}>
              <Plus size={14}/> Add First Service
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 500, marginBottom: "4px" }}>{service.name}</p>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                      <Clock size={11}/> {service.duration} mins
                    </span>
                  </div>
                </div>
                <p style={{ fontSize: "1rem", fontWeight: 500, color: "#1D9E75" }}>₹{service.price}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}