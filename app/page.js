"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit() {
    if (!email || !email.includes("@")) {
      alert("Valid email enter చేయండి");
      return;
    }
    setSubmitted(true);
    setEmail("");
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111118",
      fontFamily: "'Montserrat', sans-serif",
      display: "flex",
      flexDirection: "column",
    }}>

      {/* Google Font */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #111118; }
        input::placeholder { color: rgba(255,255,255,0.3); }
        input:focus { outline: none; }
        .nav-btn:hover { background: rgba(255,255,255,0.08) !important; }
        .submit-btn:hover { background: #0F6E56 !important; }
        .feature-item { opacity: 0.4; transition: opacity 0.3s; }
        .feature-item:hover { opacity: 1; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1.5rem 3rem",
        position: "relative",
        zIndex: 1,
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          fontSize: "1.3rem",
          fontWeight: 300,
          letterSpacing: "6px",
          textTransform: "uppercase",
        }}>
          <span style={{ color: "#1D9E75" }}>K</span>
          <span style={{ color: "#ffffff" }}>REZVO</span>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <button className="nav-btn" onClick={() => router.push("/login")} style={{
            background: "transparent",
            border: "0.5px solid rgba(255,255,255,0.25)",
            color: "#fff",
            padding: "0.5rem 1.4rem",
            borderRadius: "30px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "2px",
            cursor: "pointer",
          }}>Login</button>

          <button className="nav-btn" onClick={() => router.push("/signup")} style={{
            background: "#1D9E75",
            border: "none",
            color: "#fff",
            padding: "0.5rem 1.4rem",
            borderRadius: "30px",
            fontFamily: "Montserrat, sans-serif",
            fontSize: "0.7rem",
            letterSpacing: "2px",
            cursor: "pointer",
          }}>Get Started</button>
        </div>
      </nav>

      {/* GLOW */}
      <div style={{
        position: "fixed",
        width: "700px", height: "700px",
        background: "radial-gradient(circle, rgba(29,158,117,0.07) 0%, transparent 70%)",
        borderRadius: "50%",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }} />

      {/* HERO */}
      <section style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "4rem 2rem",
        position: "relative",
        zIndex: 1,
      }}>

        {/* Badge */}
        <div style={{
          display: "inline-block",
          background: "rgba(29,158,117,0.1)",
          border: "0.5px solid rgba(29,158,117,0.35)",
          color: "#1D9E75",
          fontSize: "0.65rem",
          letterSpacing: "3px",
          padding: "0.4rem 1.2rem",
          borderRadius: "30px",
          marginBottom: "2rem",
          textTransform: "uppercase",
        }}>
          Coming Soon · Hyderabad
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: "clamp(2.5rem, 7vw, 6rem)",
          fontWeight: 300,
          letterSpacing: "10px",
          textTransform: "uppercase",
          color: "#fff",
          lineHeight: 1.1,
          marginBottom: "1.2rem",
        }}>
          <span style={{ color: "#1D9E75" }}>K</span>REZVO
        </h1>

        <p style={{
          fontSize: "0.8rem",
          fontWeight: 300,
          letterSpacing: "4px",
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase",
          marginBottom: "3.5rem",
        }}>
          Every Service, Elevated
        </p>

        {/* Email form */}
        {!submitted ? (
          <div style={{
            display: "flex",
            maxWidth: "460px",
            width: "100%",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: "50px",
            overflow: "hidden",
            background: "rgba(255,255,255,0.03)",
          }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="మీ business email enter చేయండి"
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.78rem",
                letterSpacing: "0.5px",
                padding: "1rem 1.5rem",
              }}
            />
            <button
              className="submit-btn"
              onClick={handleSubmit}
              style={{
                background: "#1D9E75",
                border: "none",
                color: "#fff",
                fontFamily: "Montserrat, sans-serif",
                fontSize: "0.68rem",
                fontWeight: 500,
                letterSpacing: "2px",
                textTransform: "uppercase",
                padding: "1rem 1.8rem",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.3s",
              }}
            >
              Notify Me
            </button>
          </div>
        ) : (
          <div style={{
            background: "rgba(29,158,117,0.1)",
            border: "0.5px solid rgba(29,158,117,0.3)",
            borderRadius: "50px",
            padding: "1rem 2rem",
            color: "#1D9E75",
            fontSize: "0.78rem",
            letterSpacing: "2px",
          }}>
            ✓ &nbsp; You are on the list — we will reach out soon!
          </div>
        )}

        {/* Features */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "2.5rem",
          marginTop: "4rem",
          flexWrap: "wrap",
        }}>
          {["Online Booking", "Smart Calendar", "Payments", "CRM", "Marketing"].map((f) => (
            <div key={f} className="feature-item" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}>
              <div style={{
                width: "5px", height: "5px",
                borderRadius: "50%",
                background: "#1D9E75",
              }} />
              <p style={{
                fontSize: "0.65rem",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.5)",
                textTransform: "uppercase",
              }}>{f}</p>
            </div>
          ))}
        </div>

      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: "center",
        padding: "1.5rem",
        fontSize: "0.6rem",
        letterSpacing: "2px",
        color: "rgba(255,255,255,0.18)",
        textTransform: "uppercase",
        position: "relative",
        zIndex: 1,
      }}>
        © 2025 Krezvo · Hyderabad, India
      </footer>

    </main>
  );
}