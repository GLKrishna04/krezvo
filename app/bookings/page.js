"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Search, Filter, Calendar, Clock, User, Scissors, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function Bookings() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    const b = JSON.parse(stored);
    setBusiness(b);
    fetchBookings(b.id);
  }, []);

  useEffect(() => {
    let result = bookings;
    if (search) {
      result = result.filter(b =>
        b.customerName.toLowerCase().includes(search.toLowerCase()) ||
        b.customerPhone.includes(search) ||
        b.service?.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      result = result.filter(b => b.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, bookings]);

  async function fetchBookings(id) {
    try {
      const res = await fetch(`/api/dashboard?businessId=${id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
      setFiltered(data.bookings || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  function getStatusColor(status) {
    if (status === "confirmed") return "#1D9E75";
    if (status === "cancelled") return "#E24B4A";
    return "#EF9F27";
  }

  function getStatusIcon(status) {
    if (status === "confirmed") return <CheckCircle size={14}/>;
    if (status === "cancelled") return <XCircle size={14}/>;
    return <AlertCircle size={14}/>;
  }

  if (!business) return null;

  return (
    <Layout>
      <style>{`
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .search-inp { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.82rem; padding: 0.65rem 1rem 0.65rem 2.5rem; width: 100%; transition: border 0.2s; }
        .search-inp:focus { outline: none; border-color: #1D9E75; }
        .search-inp::placeholder { color: rgba(255,255,255,0.3); }
        .filter-btn { background: transparent; border: 0.5px solid rgba(255,255,255,0.1); border-radius: 8px; color: rgba(255,255,255,0.5); font-family: Montserrat,sans-serif; font-size: 0.75rem; letter-spacing: 1px; padding: 0.65rem 1rem; cursor: pointer; transition: all 0.2s; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .filter-btn.active { background: rgba(29,158,117,0.1); border-color: #1D9E75; color: #1D9E75; }
        .booking-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.25rem; background: rgba(255,255,255,0.02); border-radius: 10px; border: 0.5px solid rgba(255,255,255,0.06); transition: all 0.2s; cursor: pointer; }
        .booking-row:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); }
      `}</style>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Bookings</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
            {filtered.length} of {bookings.length} bookings
          </p>
        </div>
      </div>

          {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        {[
          { label: "Total", value: bookings.length, color: "#fff" },
          { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, color: "#1D9E75" },
          { label: "Pending", value: bookings.filter(b => b.status === "pending").length, color: "#EF9F27" },
          { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, color: "#E24B4A" },
        ].map((stat) => (
          <div key={stat.label} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "1rem" }}>
<p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(128,128,128,0.8)", marginBottom: "0.4rem" }}>{stat.label.toUpperCase()}</p>
            <p style={{ fontSize: "1.6rem", fontWeight: 500, color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>

        {/* Search */}
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <Search size={14} style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.3)" }}/>
          <input
            className="search-inp"
            type="text"
            placeholder="Search by name, phone or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Status filters */}
        <div style={{ display: "flex", gap: "0.5rem" }}>
          {["all", "confirmed", "pending", "cancelled"].map((s) => (
            <button
              key={s}
              className={`filter-btn ${statusFilter === s ? "active" : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

    

      {/* Bookings list */}
      <div className="card">
        <h2 style={{ fontSize: "0.8rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>
          ALL BOOKINGS
        </h2>

        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem 0" }}>
            <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.3)", letterSpacing: "1px" }}>No bookings found.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {filtered.map((booking) => (
              <div key={booking.id} className="booking-row">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  {/* Avatar */}
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "rgba(29,158,117,0.1)", border: "0.5px solid rgba(29,158,117,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", color: "#1D9E75", fontWeight: 500, flexShrink: 0 }}>
                    {booking.customerName?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                      <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{booking.customerName}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                        <Scissors size={11}/> {booking.service?.name}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                        <Calendar size={11}/> {booking.date}
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.7rem", color: "rgba(255,255,255,0.4)" }}>
                        <Clock size={11}/> {booking.time}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "#1D9E75" }}>₹{booking.service?.price}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: getStatusColor(booking.status), fontSize: "0.72rem", letterSpacing: "0.5px" }}>
                    {getStatusIcon(booking.status)}
                    {booking.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}