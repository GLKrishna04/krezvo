"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.businessId;

  const [business, setBusiness] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [form, setForm] = useState({ customerName: "", customerPhone: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];

  useEffect(() => {
    fetchBusiness();
  }, []);

  async function fetchBusiness() {
    try {
      const res = await fetch(`/api/business/${businessId}`);
      const data = await res.json();
      setBusiness(data.business);
      setServices(data.services);
    } catch (e) {
      console.error(e);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleBooking() {
    if (!selectedService) { setError("Please select a service!"); return; }
    if (!form.customerName || !form.customerPhone || !form.date || !form.time) {
      setError("All fields are required!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          businessId,
          serviceId: selectedService.id,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Booking failed!");
      }
    } catch (e) {
      setError("Server error — try again!");
    }
    setLoading(false);
  }

  if (success) return (
    <main style={{ minHeight: "100vh", background: "#111118", fontFamily: "Montserrat,sans-serif", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');`}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(29,158,117,0.15)", border: "1px solid #1D9E75", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", fontSize: "1.5rem" }}>✓</div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 400, letterSpacing: "2px", color: "#fff", marginBottom: "0.5rem" }}>Booking Confirmed!</h2>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px", marginBottom: "0.5rem" }}>{selectedService?.name} · {form.date} · {form.time}</p>
        <p style={{ fontSize: "0.75rem", color: "#1D9E75", letterSpacing: "1px" }}>We will contact you at {form.customerPhone}</p>
      </div>
    </main>
  );

  return (
    <main style={{ minHeight: "100vh", background: "#111118", fontFamily: "Montserrat,sans-serif", color: "#fff" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; border-color: #1D9E75 !important; }
        .inp { width: 100%; background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.12); border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.85rem; padding: 0.85rem 1rem; transition: border 0.3s; }
        .inp::placeholder { color: rgba(255,255,255,0.3); }
        select.inp { cursor: pointer; }
        .service-card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1rem; cursor: pointer; transition: all 0.3s; }
        .service-card:hover { border-color: rgba(29,158,117,0.5); }
        .service-card.selected { border-color: #1D9E75; background: rgba(29,158,117,0.08); }
        .btn { width: 100%; background: #1D9E75; border: none; border-radius: 8px; color: #fff; font-family: Montserrat,sans-serif; font-size: 0.8rem; font-weight: 500; letter-spacing: 2px; padding: 0.9rem; cursor: pointer; transition: background 0.3s; }
        .btn:hover { background: #0F6E56; }
        .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <div style={{ fontSize: "1.2rem", fontWeight: 300, letterSpacing: "5px" }}>
          <span style={{ color: "#1D9E75" }}>K</span><span style={{ color: "#fff" }}>REZVO</span>
        </div>
        {business && (
          <div style={{ borderLeft: "0.5px solid rgba(255,255,255,0.15)", paddingLeft: "1rem" }}>
            <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>{business.name}</p>
            <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{business.city}</p>
          </div>
        )}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>

        {/* Step 1: Select Service */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>STEP 1 — SELECT SERVICE</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {services.map((service) => (
              <div
                key={service.id}
                className={`service-card ${selectedService?.id === service.id ? "selected" : ""}`}
                onClick={() => setSelectedService(service)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{service.name}</p>
                    <p style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.4)", marginTop: "3px" }}>{service.duration} mins</p>
                  </div>
                  <p style={{ fontSize: "1rem", color: "#1D9E75", fontWeight: 500 }}>₹{service.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 2: Pick Date & Time */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>STEP 2 — PICK DATE & TIME</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <input className="inp" type="date" name="date" value={form.date} onChange={handleChange} min={new Date().toISOString().split("T")[0]} />
            <select className="inp" name="time" value={form.time} onChange={handleChange}>
              <option value="">Select time</option>
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Step 3: Your Details */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.65rem", letterSpacing: "3px", color: "rgba(255,255,255,0.4)", marginBottom: "1rem" }}>STEP 3 — YOUR DETAILS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input className="inp" type="text" name="customerName" placeholder="Your Name" value={form.customerName} onChange={handleChange} />
            <input className="inp" type="tel" name="customerPhone" placeholder="Phone Number" value={form.customerPhone} onChange={handleChange} />
          </div>
        </div>

        {/* Summary */}
        {selectedService && form.date && form.time && (
          <div style={{ background: "rgba(29,158,117,0.08)", border: "0.5px solid rgba(29,158,117,0.2)", borderRadius: "12px", padding: "1rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginBottom: "0.75rem" }}>BOOKING SUMMARY</p>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>Service</p>
              <p style={{ fontSize: "0.82rem" }}>{selectedService.name}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.7)" }}>Date & Time</p>
              <p style={{ fontSize: "0.82rem" }}>{form.date} · {form.time}</p>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "0.5px solid rgba(255,255,255,0.08)", paddingTop: "0.75rem", marginTop: "0.5rem" }}>
              <p style={{ fontSize: "0.85rem", fontWeight: 500 }}>Total</p>
              <p style={{ fontSize: "0.85rem", color: "#1D9E75", fontWeight: 500 }}>₹{selectedService.price}</p>
            </div>
          </div>
        )}

        {error && <p style={{ color: "#E24B4A", fontSize: "0.75rem", textAlign: "center", marginBottom: "1rem" }}>{error}</p>}

        <button className="btn" onClick={handleBooking} disabled={loading}>
          {loading ? "Confirming..." : "CONFIRM BOOKING"}
        </button>

      </div>
    </main>
  );
}