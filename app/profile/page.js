"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Save, Copy, CheckCircle } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", city: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    const b = JSON.parse(stored);
    setBusiness(b);
    setForm({ name: b.name || "", phone: b.phone || "", city: b.city || "" });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name) { setError("Business name is required!"); return; }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, businessId: business.id }),
      });
      const data = await res.json();
      if (res.ok) {
        const updated = { ...business, ...form };
        localStorage.setItem("krezvo_business", JSON.stringify(updated));
        setBusiness(updated);
        setSuccess("Profile updated successfully!");
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (e) { setError("Server error!"); }
    setLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/book/${business.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!business) return null;

  return (
    <Layout>
      <style>{`
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.85rem 1rem; transition: border 0.3s; }
        .inp:focus { outline: none; border-color: #1D9E75; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        .inp:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn { background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.78rem; font-weight: 500; letter-spacing: 1px; padding: 0.75rem 1.5rem; cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 6px; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
      `}</style>

      <div style={{ maxWidth: "600px" }}>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Profile</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>Manage your business information</p>
        </div>

        {/* Avatar + Info */}
        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem", fontWeight: 500, color: "#1D9E75" }}>
            {business.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>{business.name}</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>{business.email}</p>
          </div>
        </div>

        {/* Form */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>BUSINESS DETAILS</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>BUSINESS NAME</p>
              <input className="inp" type="text" name="name" value={form.name} onChange={handleChange} placeholder="Business name"/>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>EMAIL</p>
              <input className="inp" type="email" value={business.email} disabled/>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>PHONE</p>
              <input className="inp" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone number"/>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>CITY</p>
              <input className="inp" type="text" name="city" value={form.city} onChange={handleChange} placeholder="City"/>
            </div>

            {error && <p style={{ color: "#E24B4A", fontSize: "0.75rem" }}>{error}</p>}
            {success && <p style={{ color: "#1D9E75", fontSize: "0.75rem" }}>{success}</p>}

            <button className="btn" onClick={handleSubmit} disabled={loading}>
              <Save size={14}/> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Booking Link */}
        <div style={{ background: "rgba(29,158,117,0.06)", border: "0.5px solid rgba(29,158,117,0.2)", borderRadius: "12px", padding: "1.25rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>YOUR BOOKING LINK</p>
          <p style={{ fontSize: "0.8rem", color: "#1D9E75", wordBreak: "break-all", marginBottom: "0.75rem" }}>
            {typeof window !== "undefined" ? `${window.location.origin}/book/${business.id}` : ""}
          </p>
          <button className="btn" onClick={copyLink}>
            {copied ? <CheckCircle size={14}/> : <Copy size={14}/>}
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>

      </div>
    </Layout>
  );
}