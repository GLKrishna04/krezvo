"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddService() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    setBusiness(JSON.parse(stored));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.price || !form.duration) {
      setError("All fields are required!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          price: parseFloat(form.price),
          duration: parseInt(form.duration),
          businessId: business.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Service added successfully!");
        setForm({ name: "", price: "", duration: "" });
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setError(data.error || "Something went wrong!");
      }
    } catch (err) {
      setError("Server error — try again!");
    }
    setLoading(false);
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111118",
      fontFamily: "'Montserrat', sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: #1D9E75 !important; }
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.85rem 1rem; transition: border 0.3s; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        .btn { width: 100%; background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 2px; padding: 0.9rem; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Logo */}
      <div onClick={() => router.push("/dashboard")} style={{
        fontSize: "1.4rem", fontWeight: 300, letterSpacing: "6px",
        marginBottom: "2.5rem", cursor: "pointer",
      }}>
        <span style={{ color: "#1D9E75" }}>K</span>
        <span style={{ color: "#fff" }}>REZVO</span>
      </div>

      {/* Card */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.1)",
        borderRadius: "16px",
        padding: "2.5rem",
        width: "100%",
        maxWidth: "440px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <span
            onClick={() => router.push("/dashboard")}
            style={{ color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: "1.2rem" }}
          >←</span>
          <div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 400, letterSpacing: "2px", color: "#fff" }}>
              Add Service
            </h2>
            <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", marginTop: "2px" }}>
              Add a new service to your business
            </p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
              SERVICE NAME
            </p>
            <input
              className="inp"
              type="text"
              name="name"
              placeholder="e.g. Haircut, Facial, Massage"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
              PRICE (₹)
            </p>
            <input
              className="inp"
              type="number"
              name="price"
              placeholder="e.g. 500"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>
              DURATION (minutes)
            </p>
            <input
              className="inp"
              type="number"
              name="duration"
              placeholder="e.g. 30, 60, 90"
              value={form.duration}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p style={{ color: "#E24B4A", fontSize: "0.75rem", textAlign: "center" }}>{error}</p>
          )}
          {success && (
            <p style={{ color: "#1D9E75", fontSize: "0.75rem", textAlign: "center" }}>{success}</p>
          )}

          <button className="btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "ADD SERVICE"}
          </button>

        </div>
      </div>
    </main>
  );
}