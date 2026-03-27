"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Users, Building2, CalendarDays, IndianRupee, LogOut, Shield } from "lucide-react";

export default function AdminDashboard() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_admin");
    if (!stored) { router.push("/admin"); return; }
    setAdmin(JSON.parse(stored));
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await fetch("/api/admin/dashboard");
      const data = await res.json();
      setStats(data.stats);
      setBusinesses(data.businesses || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function logout() {
    localStorage.removeItem("krezvo_admin");
    router.push("/admin");
  }

  if (!admin) return null;

  return (
    <main style={{ minHeight: "100vh", background: "#111118", fontFamily: "Montserrat,sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .stat-card { background: rgba(29,158,117,0.08); border: 0.5px solid rgba(29,158,117,0.2); border-radius: 12px; padding: 1.5rem; }
        .btn-outline { background: transparent; border: 0.5px solid rgba(255,255,255,0.2); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.75rem; letter-spacing: 1px; padding: 0.6rem 1.2rem; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .btn-outline:hover { background: rgba(255,255,255,0.05); }
        .biz-row { display: flex; justify-content: space-between; align-items: center; padding: 0.85rem 1rem; background: rgba(255,255,255,0.02); border-radius: 8px; border: 0.5px solid rgba(255,255,255,0.06); transition: all 0.2s; }
        .biz-row:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      {/* Navbar */}
      <nav style={{ height: "56px", background: "#0d0d14", borderBottom: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ fontSize: "1.1rem", fontWeight: 300, letterSpacing: "6px" }}>
            <span style={{ color: "#1D9E75" }}>K</span><span style={{ color: "#fff" }}>REZVO</span>
          </div>
          <span style={{ background: "rgba(29,158,117,0.15)", border: "0.5px solid rgba(29,158,117,0.3)", color: "#1D9E75", fontSize: "0.6rem", letterSpacing: "2px", padding: "3px 10px", borderRadius: "20px" }}>ADMIN</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(29,158,117,0.2)", border: "1px solid rgba(29,158,117,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={14} style={{ color: "#1D9E75" }}/>
            </div>
            <div>
              <p style={{ fontSize: "0.78rem", fontWeight: 500 }}>{admin.name}</p>
              <p style={{ fontSize: "0.62rem", color: "#1D9E75" }}>Super Admin</p>
            </div>
          </div>
          <button className="btn-outline" onClick={logout}><LogOut size={14}/> Logout</button>
        </div>
      </nav>

      <div style={{ padding: "2rem" }}>

        {/* Welcome */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Admin Dashboard</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>Platform overview</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <Building2 size={16} style={{ color: "#1D9E75" }}/>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>BUSINESSES</p>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{stats?.totalBusinesses || 0}</p>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <CalendarDays size={16} style={{ color: "#1D9E75" }}/>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>BOOKINGS</p>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{stats?.totalBookings || 0}</p>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <Users size={16} style={{ color: "#1D9E75" }}/>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>STAFF</p>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>{stats?.totalStaff || 0}</p>
          </div>
          <div className="stat-card">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
              <IndianRupee size={16} style={{ color: "#1D9E75" }}/>
              <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>REVENUE</p>
            </div>
            <p style={{ fontSize: "2rem", fontWeight: 500, color: "#1D9E75" }}>₹{stats?.totalRevenue?.toLocaleString() || 0}</p>
          </div>
        </div>

        {/* Businesses List */}
        <div className="card">
          <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>ALL BUSINESSES</h2>
          {loading ? (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
          ) : businesses.length === 0 ? (
            <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>No businesses yet.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {businesses.map((biz) => (
                <div key={biz.id} className="biz-row">
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(29,158,117,0.1)", border: "0.5px solid rgba(29,158,117,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 500, color: "#1D9E75" }}>
                      {biz.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{biz.name}</p>
                      <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{biz.email} · {biz.city || "N/A"}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.75rem", color: "#1D9E75" }}>{biz._count?.bookings || 0} bookings</p>
                    <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{new Date(biz.createdAt).toLocaleDateString()}</p>
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