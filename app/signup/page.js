"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", email: "", password: "", phone: "", city: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    if (!form.name || !form.email || !form.password) {
      setError("Name, Email, Password తప్పనిసరి!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/login");
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
        .btn-primary { width: 100%; background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 2px; padding: 0.9rem; cursor: pointer; transition: background 0.3s; }
        .btn-primary:hover { background: #0F6E56; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Logo */}
      <div onClick={() => router.push("/")} style={{
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
        <h2 style={{
          fontSize: "1.1rem", fontWeight: 400, letterSpacing: "2px",
          color: "#fff", marginBottom: "0.5rem", textAlign: "center",
        }}>
          Business Signup
        </h2>
        <p style={{
          fontSize: "0.72rem", color: "rgba(255,255,255,0.4)",
          letterSpacing: "1px", textAlign: "center", marginBottom: "2rem",
        }}>
          మీ business account create చేయండి
        </p>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

          <input
            className="inp"
            type="text"
            name="name"
            placeholder="Business Name *"
            value={form.name}
            onChange={handleChange}
          />
          <input
            className="inp"
            type="email"
            name="email"
            placeholder="Email Address *"
            value={form.email}
            onChange={handleChange}
          />
          <input
            className="inp"
            type="password"
            name="password"
            placeholder="Password *"
            value={form.password}
            onChange={handleChange}
          />
          <input
            className="inp"
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
          />
          <input
            className="inp"
            type="text"
            name="city"
            placeholder="City (e.g. Hyderabad)"
            value={form.city}
            onChange={handleChange}
          />

          {error && (
            <p style={{
              color: "#E24B4A", fontSize: "0.75rem",
              letterSpacing: "0.5px", textAlign: "center",
            }}>{error}</p>
          )}

          <button
            className="btn-primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Creating..." : "CREATE ACCOUNT"}
          </button>

        </div>

        <p style={{
          textAlign: "center", marginTop: "1.5rem",
          fontSize: "0.75rem", color: "rgba(255,255,255,0.4)",
        }}>
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            style={{ color: "#1D9E75", cursor: "pointer" }}
          >
            Login
          </span>
        </p>
      </div>
    </main>
  );
}