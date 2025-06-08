import React, { useState } from "react";
import axios from "axios";

export default function LoginPage({ onLogin }) {
  const [form, setForm] = useState({ name: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    password: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const [registerMode, setRegisterMode] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = (formData) => {
    if (!formData.name.trim()) return "Username is required";
    if (!formData.password.trim()) return "Password is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (registerMode) {
      setRegisterForm((prev) => ({ ...prev, [name]: value }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setRegisterSuccess("");
    setLoading(true);

    try {
      const currentForm = registerMode ? registerForm : form;
      const validationError = validateForm(currentForm);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      if (registerMode) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/register",
          registerForm
        );
        if (res.data.success) {
          setRegisterSuccess("Registration successful! Please log in.");
          setRegisterMode(false);
          setForm({ name: registerForm.name, password: "" });
          setRegisterForm({ name: "", password: "", role: "user" });
        }
      } else {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          form
        );
        if (res.data.token) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          onLogin(res.data.user);
        }
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        (registerMode ? "Registration failed" : "Login failed");
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7ff 0%, #e3e9ff 100%)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          background: "#ffffff",
          borderRadius: 20,
          boxShadow: "0 10px 25px rgba(51,88,228,0.1)",
          padding: "40px",
          transition: "all 0.3s ease",
        }}
      >
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "28px",
              color: "#1a1f36",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            {registerMode ? "Create Account" : "Welcome Back"}
          </h1>
          <p
            style={{
              color: "#6b7280",
              fontSize: "16px",
            }}
          >
            {registerMode
              ? "Sign up to get started with your account"
              : "Sign in to continue to your dashboard"}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#1a1f36",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Username
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your username"
              value={registerMode ? registerForm.name : form.name}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                fontSize: 16,
                transition: "all 0.2s",
                outline: "none",
                backgroundColor: "#f9fafb",
                color: "#1a1f36",
              }}
            />
          </div>

          <div style={{ marginBottom: registerMode ? 24 : 32 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#1a1f36",
                fontSize: "14px",
                fontWeight: 500,
              }}
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={registerMode ? registerForm.password : form.password}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                border: "2px solid #e5e7eb",
                fontSize: 16,
                transition: "all 0.2s",
                outline: "none",
                backgroundColor: "#f9fafb",
                color: "#1a1f36",
              }}
            />
          </div>

          {registerMode && (
            <div style={{ marginBottom: 32 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 8,
                  color: "#1a1f36",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                Account Type
              </label>
              <select
                name="role"
                value={registerForm.role}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: "2px solid #e5e7eb",
                  fontSize: 16,
                  transition: "all 0.2s",
                  outline: "none",
                  backgroundColor: "#f9fafb",
                  appearance: "none",
                  backgroundImage:
                    "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 1rem center",
                  backgroundSize: "1em",
                }}
              >
                <option value="user">Regular User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          {error && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: "#fef2f2",
                borderLeft: "4px solid #ef4444",
                color: "#991b1b",
                fontSize: "14px",
                marginBottom: 24,
              }}
            >
              {error}
            </div>
          )}

          {registerSuccess && !registerMode && (
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 12,
                backgroundColor: "#f0fdf4",
                borderLeft: "4px solid #22c55e",
                color: "#166534",
                fontSize: "14px",
                marginBottom: 24,
              }}
            >
              {registerSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#93c5fd" : "#3b82f6",
              color: "#ffffff",
              border: "none",
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            {loading && (
              <span
                style={{
                  width: 20,
                  height: 20,
                  border: "3px solid #ffffff",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            )}
            {registerMode ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: 32,
            textAlign: "center",
            borderTop: "1px solid #e5e7eb",
            paddingTop: 32,
          }}
        >
          <p
            style={{
              color: "#6b7280",
              fontSize: "14px",
              marginBottom: 16,
            }}
          >
            {registerMode
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <button
            onClick={() => {
              setRegisterMode(!registerMode);
              setError("");
              setRegisterSuccess("");
              if (registerMode) {
                setForm({ name: registerForm.name, password: "" });
              } else {
                setRegisterForm({ name: "", password: "", role: "user" });
              }
            }}
            style={{
              background: "transparent",
              border: "2px solid #3b82f6",
              color: "#3b82f6",
              padding: "10px 24px",
              borderRadius: 12,
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {registerMode ? "Sign In Instead" : "Create Account"}
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          input:focus, select:focus {
            border-color: #3b82f6;
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          button:hover {
            transform: translateY(-1px);
          }
          button[type="submit"]:hover {
            background: #2563eb;
          }
          button[type="submit"]:active {
            transform: translateY(1px);
          }
        `}
      </style>
    </div>
  );
}
