"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/app/components/Layout";
import { Star } from "lucide-react";

export default function Reviews() {
  const router = useRouter();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    const b = JSON.parse(stored);
    setBusiness(b);
    fetchReviews(b.id);
  }, []);

  async function fetchReviews(id) {
    try {
      const res = await fetch(`/api/reviews?businessId=${id}`);
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (!business) return null;

  return (
    <Layout>
      <style>{`
        .card { background: rgba(255,255,255,0.03); border: 0.5px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 1.5rem; }
        .review-card { background: rgba(255,255,255,0.02); border: 0.5px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 1.25rem; transition: all 0.2s; }
        .review-card:hover { background: rgba(255,255,255,0.04); }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.3rem", fontWeight: 400, letterSpacing: "2px", marginBottom: "0.3rem" }}>Reviews</h1>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>{reviews.length} reviews</p>
      </div>

      {/* Stats */}
      {reviews.length > 0 && (
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2rem", background: "rgba(29,158,117,0.08)", border: "0.5px solid rgba(29,158,117,0.2)", borderRadius: "12px", padding: "1.5rem", alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: "3rem", fontWeight: 500, color: "#1D9E75", lineHeight: 1 }}>{avgRating}</p>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)", marginTop: "4px" }}>AVG RATING</p>
          </div>
          <div style={{ display: "flex", gap: "4px" }}>
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={20} fill={s <= Math.round(avgRating) ? "#1D9E75" : "none"} stroke="#1D9E75"/>
            ))}
          </div>
          <div>
            <p style={{ fontSize: "1.5rem", fontWeight: 500 }}>{reviews.length}</p>
            <p style={{ fontSize: "0.65rem", letterSpacing: "2px", color: "rgba(255,255,255,0.4)" }}>TOTAL REVIEWS</p>
          </div>
        </div>
      )}

      {/* Reviews list */}
      <div className="card">
        <h2 style={{ fontSize: "0.78rem", fontWeight: 500, letterSpacing: "2px", marginBottom: "1.25rem", color: "rgba(255,255,255,0.6)" }}>ALL REVIEWS</h2>
        {loading ? (
          <p style={{ textAlign: "center", padding: "2rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>Loading...</p>
        ) : reviews.length === 0 ? (
          <p style={{ textAlign: "center", padding: "3rem 0", fontSize: "0.8rem", color: "rgba(255,255,255,0.3)" }}>No reviews yet.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                  <div>
                    <p style={{ fontSize: "0.88rem", fontWeight: 500 }}>{review.customerName}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "2px" }}>
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={14} fill={s <= review.rating ? "#1D9E75" : "none"} stroke="#1D9E75"/>
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}