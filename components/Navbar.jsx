import React, { useContext } from "react";
import { ThemeContext } from "./Theme/ThemeProvider";

export default function Navbar({ user, onLogout }) {
  const { toggleTheme, mode } = useContext(ThemeContext);
  return (
    <header
      style={{
        padding: 20,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        marginBottom: 24,
        borderRadius: 8,
      }}
    >
      <span style={{ fontWeight: 700, fontSize: 22, color: "#3358e4" }}>
        Admin Dashboard
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {user && (
          <span style={{ color: "#3358e4", fontWeight: 600 }}>
            {user.name} ({user.role})
          </span>
        )}
        <button
          onClick={toggleTheme}
          style={{
            background: "#3358e4",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 18px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: 16,
            boxShadow: "0 1px 4px rgba(51,88,228,0.15)",
          }}
        >
          Switch to {mode === "light" ? "Dark" : "Light"} Mode
        </button>
        {user && (
          <button
            onClick={onLogout}
            style={{
              background: "#eee",
              color: "#3358e4",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: 16,
              marginLeft: 8,
            }}
          >
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
