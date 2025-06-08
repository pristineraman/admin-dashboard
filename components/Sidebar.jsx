import React from "react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/calendar", label: "Calendar" },
  { to: "/kanban", label: "Reports" },
  { to: "/users", label: "Users" },
  { to: "/analytics", label: "Analytics" },
  { to: "/activity-logs", label: "Activity Logs" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  return (
    <nav
      style={{
        width: 220,
        background: "linear-gradient(135deg, #4f8cff 0%, #3358e4 100%)",
        color: "#fff",
        height: "100vh",
        padding: 24,
        boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
      }}
    >
      <h2 style={{ fontWeight: 700, letterSpacing: 2, marginBottom: 32 }}>
        Admin
      </h2>
      <ul style={{ listStyle: "none", padding: 0, fontSize: 18 }}>
        {navItems.map((item) =>
          (item.to === "/users" || item.to === "/activity-logs") &&
          user?.role !== "admin" ? null : (
            <li key={item.to} style={{ margin: "18px 0" }}>
              <Link
                to={item.to}
                style={{
                  color: location.pathname === item.to ? "#ffd700" : "#fff",
                  fontWeight: location.pathname === item.to ? 700 : 400,
                  padding: "6px 12px",
                  borderRadius: 6,
                  background:
                    location.pathname === item.to
                      ? "rgba(255,255,255,0.08)"
                      : "none",
                  display: "block",
                  transition: "background 0.2s",
                }}
              >
                {item.label}
              </Link>
            </li>
          )
        )}
      </ul>
      {user && (
        <button
          onClick={onLogout}
          style={{
            marginTop: 40,
            width: "100%",
            padding: 12,
            background: "#fff",
            color: "#3358e4",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(51,88,228,0.10)",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}
