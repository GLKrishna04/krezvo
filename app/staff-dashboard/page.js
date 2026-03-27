"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Clock, User, LogOut, CheckCircle } from "lucide-react";

export default function StaffDashboard() {
  const router = useRouter();
  const [staff, setStaff] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_staff");
    if (!stored) { router.push("/staff-login"); return; }
    const s = JSON.parse(stored);
    setStaff(s);
    fetchBookings(s.businessId);
  }, []);

  async function fetchBookings(businessId) {
    try {
      const res = await fetch(`/api/dashboard?businessId=${businessId}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("krezvo_staff");
    router.push("/staff-login");
  }

  const todayBookings = bookings.filter(b => b.date === new Date().toISOString().split("T")[0]);

  if (!staff) return null;

  return (
    <main style={{ minHeight: "100vh", background: "#111118", fontFamily: "Montserrat,sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .stat-card { background: rgba(29,158,117,0.08); border: 0.5px solid rgba(29,158,117,0.2); border-radius: 12px; padding: 1.5rem; }
        .booking-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 0.5px solid rgba(255,255,255,0.06); }
        .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.75rem; padding: 0.6rem 1.2rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ height: "56px", background: "#0d0d14", borderBottom: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 300, letterSpacing: "6px" }}>
          <span style={{ color: "#1D9E75" }}>K</span><span style={{ color: "#fff" }}>REZVO</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 500, color: "#1D9E75" }}>
              {staff.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 500 }}>{staff.name}</p>
              <p style={{ fontSize: "0.62rem", color: "#1D9E75", letterSpacing: "0.5px" }}>{staff.role}</p>
            </div>
          </div>
          <button className="btn-outline" onClick={logout}><LogOut size={14}/> Logout</button>
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>

        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Welcome, {staff.name}!</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>Your schedule and bookings</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>TODAY</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{todayBookings.length}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>TOTAL</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{bookings.length}</p>
          </div>
          <div className="stat-card">
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.5rem" }}>CONFIRMED</p>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{bookings.filter(b => b.status === "confirmed").length}</p>
          </div>
        </div>

        {/* Today's bookings */}
        <div className="card" style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>TODAY'S BOOKINGS</h2>
          {todayBookings.length === 0 ? (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>No bookings today.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {todayBookings.map((b) => (
                <div key={b.id} className="booking-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <User size={14} style={{ color: "rgba(255,255,255,0.4)" }}/>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{b.customerName}</p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{b.service?.name}</p>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "rgba(255,255,255,0.4)" }}>
                      <Clock size={12}/> {b.time}
                    </span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#1D9E75" }}>
                      <CheckCircle size={12}/> {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All bookings */}
        <div className="card">
          <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>ALL BOOKINGS</h2>
          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
          ) : bookings.length === 0 ? (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>No bookings yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {bookings.map((b) => (
                <div key={b.id} className="booking-row">
                  <div>
                    <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{b.customerName}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{b.service?.name} · {b.date} · {b.time}</p>
                  </div>
                  <p style={{ fontSize: "0.85rem", color: "#1D9E75" }}>₹{b.service?.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </main>
  );
}