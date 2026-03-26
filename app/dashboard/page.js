"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) {
      router.push("/login");
      return;
    }
    const b = JSON.parse(stored);
    setBusiness(b);
    fetchData(b.id);
  }, []);

  async function fetchData(id) {
    try {
      const res = await fetch(`/api/dashboard?businessId=${id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setServices(data.services || []);
    } catch (e) {
      console.error(e);
    }
  }

  function logout() {
    localStorage.removeItem("krezvo_business");
    router.push("/");
  }

  if (!business) return (
    <div style={{ minHeight: "100vh", background: "#111118", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#1D9E75", fontFamily: "Montserrat", letterSpacing: "3px", fontSize: "0.8rem" }}>Loading...</p>
    </div>
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "#111118",
      fontFamily: "'Montserrat', sans-serif",
      color: "#fff",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #111118; }
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .stat-card { background: rgba(29,158,117,0.08); border: 0.5px solid rgba(29,158,117,0.2); border-radius: 12px; padding: 1.5rem; }
        .btn { background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.75rem; font-weight: 500; letter-spacing: 1px; padding: 0.6rem 1.2rem; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #0F6E56; }
        .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.75rem; letter-spacing: 1px; padding: 0.6rem 1.2rem; cursor: pointer; }
        .btn-outline:hover { background: rgba(255,255,255,0.05); }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "1.2rem 2.5rem",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 300, letterSpacing: "5px" }}>
          <span style={{ color: "#1D9E75" }}>K</span>
          <span style={{ color: "#fff" }}>REZVO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", letterSpacing: "1px" }}>
            {business.name}
          </p>
          <button className="btn-outline" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "2rem 2.5rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.4rem" }}>
            Welcome back, {business.name}!
          </h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
            {business.city || "Hyderabad"} · {business.email}
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>TOTAL BOOKINGS</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{bookings.length}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>SERVICES</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{services.length}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>TODAY</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>
              {bookings.filter(b => b.date === new Date().toISOString().split("T")[0]).length}
            </p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>REVENUE</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>
              ₹{bookings.reduce((acc, b) => acc + (b.service?.price || 0), 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <button className="btn" onClick={() => router.push("/services/add")}>+ Add Service</button>
          <button className="btn" onClick={() => router.push("/book")}>+ New Booking</button>
          <button className="btn-outline" onClick={() => router.push(`/book/${business.id}`)}>View Booking Page</button>
        </div>

        {/* Recent Bookings */}
        <div className="card">
          <h2 style={{ fontSize: "0.85rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.5rem", color: "rgba(255,255,255,0.8)" }}>
            RECENT BOOKINGS
          </h2>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "3rem 0" }}>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>
                No bookings yet — share your booking link!
              </p>
              <button
                className="btn"
                style={{ marginTop: "1rem" }}
                onClick={() => router.push("/book")}
              >
                Create First Booking
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "rgba(255,255,255,0.02)",
                  borderRadius: "8px",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                }}>
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{booking.customerName}</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                      {booking.service?.name} · {booking.date} · {booking.time}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.85rem", color: "#1D9E75" }}>₹{booking.service?.price}</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "2px", letterSpacing: "1px" }}>
                      {booking.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}