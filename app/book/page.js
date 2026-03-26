"use client";
import { useRouter } from "next/navigation";

export default function Book() {
  const router = useRouter();
  return (
    <main style={{ minHeight: "100vh", background: "#111118", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#fff", fontFamily: "Montserrat" }}>Redirecting...</p>
    </main>
  );
}