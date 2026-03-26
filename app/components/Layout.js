"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Scissors, Users, Star, User, Bell, LogOut, Settings, ChevronDown, Sun, Moon } from "lucide-react";

const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16}/> },
  { label: "Bookings", path: "/bookings", icon: <CalendarDays size={16}/> },
  { label: "Services", path: "/services/add", icon: <Scissors size={16}/> },
  { label: "Staff", path: "/staff", icon: <Users size={16}/> },
  { label: "Reviews", path: "/reviews", icon: <Star size={16}/> },
  { label: "Profile", path: "/profile", icon: <User size={16}/> },
];

const mockNotifications = [
  { id: 1, message: "New booking from Rahul", time: "2 mins ago", read: false },
  { id: 2, message: "Review received — 5 stars!", time: "1 hour ago", read: false },
  { id: 3, message: "Service added successfully", time: "3 hours ago", read: true },
  { id: 4, message: "New booking from Priya", time: "Yesterday", read: true },
];

export default function Layout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [business, setBusiness] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [theme, setTheme] = useState("dark");
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("krezvo_theme") || "dark";
    setTheme(saved);
    document.body.className = saved;
    document.body.style.background = saved === "dark" ? "#111118" : "#f0f0f0";
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("krezvo_business");
    if (!stored) { router.push("/login"); return; }
    setBusiness(JSON.parse(stored));
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("krezvo_theme", next);
    document.body.className = next;
    document.body.style.background = next === "dark" ? "#111118" : "#f0f0f0";
  }

  function logout() {
    localStorage.removeItem("krezvo_business");
    router.push("/");
  }

  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  const d = theme === "dark";

  if (!business) return (
    <div style={{ minHeight: "100vh", background: d ? "#111118" : "#f0f0f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#1D9E75", fontFamily: "Montserrat", letterSpacing: "3px", fontSize: "0.8rem" }}>Loading...</p>
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: d ? "#111118" : "#f0f0f0", fontFamily: "Montserrat, sans-serif", color: d ? "#fff" : "#111118" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .menu-item { display: flex; align-items: center; gap: 12px; padding: 0.7rem 1.5rem; cursor: pointer; transition: all 0.2s; font-size: 0.8rem; letter-spacing: 1px; white-space: nowrap; color: ${d ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.5)"}; }
        .menu-item:hover { background: ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}; color: ${d ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.85)"}; }
        .menu-item.active { background: rgba(29,158,117,0.1); color: #1D9E75; border-right: 2px solid #1D9E75; }
        .icon-btn { background: transparent; border: 0.5px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}; border-radius: 8px; color: ${d ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"}; cursor: pointer; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; position: relative; }
        .icon-btn:hover { background: ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; color: ${d ? "#fff" : "#000"}; }
        .dropdown { position: absolute; top: calc(100% + 8px); right: 0; background: ${d ? "#1a1a26" : "#ffffff"}; border: 0.5px solid ${d ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"}; border-radius: 12px; min-width: 200px; overflow: hidden; z-index: 1000; box-shadow: 0 8px 24px rgba(0,0,0,0.15); }
        .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 0.75rem 1rem; cursor: pointer; font-size: 0.8rem; color: ${d ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)"}; transition: background 0.2s; }
        .dropdown-item:hover { background: ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}; color: ${d ? "#fff" : "#000"}; }
        .notif-item { padding: 0.85rem 1rem; border-bottom: 0.5px solid ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; cursor: pointer; transition: background 0.2s; }
        .notif-item:hover { background: ${d ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; }
        .badge { position: absolute; top: -4px; right: -4px; background: #E24B4A; color: #fff; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: 500; }
        .avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(29,158,117,0.2); border: 1px solid rgba(29,158,117,0.4); display: flex; align-items: center; justify-content: center; font-size: 0.85rem; font-weight: 500; color: #1D9E75; cursor: pointer; }
        .profile-btn { display: flex; align-items: center; gap: 8px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.2s; }
        .profile-btn:hover { background: ${d ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; }
      `}</style>

      {/* FULL WIDTH NAVBAR */}
      <nav style={{
        height: "56px",
        background: d ? "#0d0d14" : "#ffffff",
        borderBottom: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
      }}>
        {/* Logo */}
        <div onClick={() => router.push("/dashboard")} style={{ fontSize: "1.1rem", fontWeight: 300, letterSpacing: "6px", cursor: "pointer" }}>
          <span style={{ color: "#1D9E75" }}>K</span>
          <span style={{ color: d ? "#fff" : "#111118" }}>REZVO</span>
        </div>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: "relative" }}>
            <button className="icon-btn" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
              <Bell size={16}/>
              {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>
            {showNotifications && (
              <div className="dropdown" style={{ width: "300px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 1rem", borderBottom: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 500, letterSpacing: "1px", color: d ? "#fff" : "#111118" }}>NOTIFICATIONS</p>
                  <span onClick={markAllRead} style={{ fontSize: "0.68rem", color: "#1D9E75", cursor: "pointer" }}>Mark all read</span>
                </div>
                {notifications.map((notif) => (
                  <div key={notif.id} className="notif-item">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      {!notif.read
                        ? <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#1D9E75", marginTop: "6px", flexShrink: 0 }}/>
                        : <div style={{ width: "6px", flexShrink: 0 }}/>
                      }
                      <div>
                        <p style={{ fontSize: "0.78rem", color: notif.read ? (d ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") : (d ? "#fff" : "#111118") }}>{notif.message}</p>
                        <p style={{ fontSize: "0.65rem", color: d ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)", marginTop: "3px" }}>{notif.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} style={{ position: "relative" }}>
            <div className="profile-btn" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
              <div className="avatar">{business.name?.charAt(0).toUpperCase()}</div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "0.78rem", fontWeight: 500, color: d ? "#fff" : "#111118", lineHeight: 1.2 }}>{business.name}</p>
                <p style={{ fontSize: "0.62rem", color: "#1D9E75", letterSpacing: "0.5px" }}>Business Owner</p>
              </div>
              <ChevronDown size={14} style={{ color: d ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}/>
            </div>

            {showProfile && (
              <div className="dropdown">
                <div style={{ padding: "1rem", borderBottom: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div className="avatar" style={{ cursor: "default" }}>{business.name?.charAt(0).toUpperCase()}</div>
                    <div>
                      <p style={{ fontSize: "0.82rem", fontWeight: 500, color: d ? "#fff" : "#111118" }}>{business.name}</p>
                      <p style={{ fontSize: "0.68rem", color: "#1D9E75", marginTop: "2px", letterSpacing: "1px" }}>Business Owner</p>
                    </div>
                  </div>
                </div>
                <div className="dropdown-item" onClick={() => { router.push("/profile"); setShowProfile(false); }}>
                  <User size={14}/> Profile
                </div>
                <div className="dropdown-item" onClick={() => { router.push("/settings"); setShowProfile(false); }}>
                  <Settings size={14}/> Settings
                </div>
                <div className="dropdown-item" onClick={() => { toggleTheme(); setShowProfile(false); }}>
                  {d ? <Sun size={14}/> : <Moon size={14}/>}
                  {d ? "Light Mode" : "Dark Mode"}
                </div>
                <div style={{ borderTop: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                  <div className="dropdown-item" onClick={logout} style={{ color: "#E24B4A" }}>
                    <LogOut size={14}/> Logout
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* SIDEBAR */}
      <aside style={{
        width: "220px",
        background: d ? "#0d0d14" : "#ffffff",
        borderRight: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`,
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0, top: "56px", bottom: 0,
        zIndex: 50,
      }}>
        <nav style={{ flex: 1, paddingTop: "0.75rem" }}>
          {menuItems.map((item) => (
            <div
              key={item.path}
              className={`menu-item ${pathname === item.path ? "active" : ""}`}
              onClick={() => router.push(item.path)}
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ borderTop: `0.5px solid ${d ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.1)"}`, padding: "0.75rem 0" }}>
          <div className="menu-item" onClick={logout} style={{ color: "#E24B4A" }}>
            <LogOut size={16}/>
            <span>Logout</span>
          </div>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <div style={{
        marginLeft: "220px",
        marginTop: "56px",
        flex: 1,
        padding: "2rem",
        minHeight: "calc(100vh - 56px)",
      }}>
        {children}
      </div>

    </div>
  );
}