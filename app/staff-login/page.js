"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function StaffLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin() {
    if (!form.email || !form.password) { setError("All fields required!"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("krezvo_staff", JSON.stringify(data.staff));
        router.push("/staff-dashboard");
      } else {
        setError(data.error || "Login failed!");
      }
    } catch (e) { setError("Server error!"); }
    setLoading(false);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#111118", fontFamily: "Montserrat,sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: #1D9E75 !important; }
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.85rem 1rem; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        .btn { width: 100%; background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 2px; padding: 0.9rem; cursor: pointer; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      <div style={{ fontSize: "1.4rem", fontWeight: 300, letterSpacing: "6px", marginBottom: "0.5rem" }}>
        <span style={{ color: "#1D9E75" }}>K</span><span style={{ color: "#fff" }}>REZVO</span>
      </div>
      <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: "2.5rem" }}>STAFF PORTAL</p>

      <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "2.5rem", width: "100%", maxWidth: "420px" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 400, letterSpacing: "2px", color: "#fff", marginBottom: "0.4rem", textAlign: "center" }}>Staff Login</h2>
        <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", textAlign: "center", marginBottom: "2rem" }}>Access your schedule and bookings</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input className="inp" type="email" placeholder="Your Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleLogin()}/>
          <input className="inp" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === "Enter" && handleLogin()}/>
          {error && <p style={{ color: "#E24B4A", fontSize: "0.75rem", textAlign: "center" }}>{error}</p>}
          <button className="btn" onClick={handleLogin} disabled={loading}>{loading ? "Logging in..." : "LOGIN"}</button>
        </div>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
          Business owner? <span onClick={() => router.push("/login")} style={{ color: "#1D9E75", cursor: "pointer" }}>Login here</span>
        </p>
      </div>
    </main>
  );
}