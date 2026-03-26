"use client";
import { useRouter, usePathname } from "next/navigation";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: "▦" },
  { label: "Bookings", path: "/bookings", icon: "📅" },
  { label: "Services", path: "/services/add", icon: "✂" },
  { label: "Staff", path: "/staff", icon: "👥" },
  { label: "Reviews", path: "/reviews", icon: "⭐" },
  { label: "Profile", path: "/profile", icon: "⚙" },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("krezvo_business");
    router.push("/");
  }

  return (
    <aside style={{
      width: "240px",
      minHeight: "100vh",
      background: "#0d0d14",
      borderRight: "0.5px solid rgba(255,255,255,0.08)",
      display: "flex",
      flexDirection: "column",
      fontFamily: "Montserrat, sans-serif",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 0.75rem 1.5rem; cursor: pointer; transition: all 0.2s; border-radius: 0; font-size: 0.82rem; letter-spacing: 1px; color: rgba(255,255,255,0.45); }
        .menu-item:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.8); }
        .menu-item.active { background: rgba(29,158,117,0.1); color: #1D9E75; border-right: 2px solid #1D9E75; }
        .menu-icon { font-size: 14px; width: 20px; text-align: center; }
      `}</style>

      {/* Logo */}
      <div
        onClick={() => router.push("/dashboard")}
        style={{
          padding: "1.5rem",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
          cursor: "pointer",
          fontSize: "1.1rem",
          fontWeight: 300,
          letterSpacing: "5px",
        }}
      >
        <span style={{ color: "#1D9E75" }}>K</span>
        <span style={{ color: "#fff" }}>REZVO</span>
      </div>

      {/* Menu Items */}
      <nav style={{ flex: 1, paddingTop: "1rem" }}>
        {menuItems.map((item) => (
          <div
            key={item.path}
            className={`menu-item ${pathname === item.path ? "active" : ""}`}
            onClick={() => router.push(item.path)}
          >
            <span className="menu-icon">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.08)", padding: "1rem" }}>
        <div
          className="menu-item"
          onClick={logout}
          style={{ color: "#E24B4A", borderRadius: "8px" }}
        >
          <span className="menu-icon">⏻</span>
          <span>Logout</span>
        </div>
      </div>

    </aside>
  );
}