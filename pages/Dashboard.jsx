import React from "react";
import Chart from "../components/Charts/Chart";
import DataTable from "../components/Tables/DataTable";

export default function Dashboard() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 32,
        padding: 0,
        minHeight: "calc(100vh - 120px)",
        background: "linear-gradient(120deg, #f6f8fa 60%, #e3eafc 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(51,88,228,0.07)",
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#3358e4",
          margin: 0,
          padding: "16px 0 0 0",
          letterSpacing: 1.2,
        }}
      >
        Dashboard Overview
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            flex: "1 1 350px",
            minWidth: 320,
            maxWidth: 600,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(51,88,228,0.08)",
            padding: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h2
            style={{
              color: "#8884d8",
              fontWeight: 600,
              marginBottom: 16,
              fontSize: 20,
            }}
          >
            User Growth
          </h2>
          <Chart />
        </div>
        <div
          style={{
            flex: "2 1 500px",
            minWidth: 350,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 8px rgba(51,88,228,0.08)",
            padding: 24,
          }}
        >
          <h2
            style={{
              color: "#3358e4",
              fontWeight: 600,
              marginBottom: 16,
              fontSize: 20,
            }}
          >
            User Table
          </h2>
          <DataTable />
        </div>
      </div>
    </div>
  );
}
