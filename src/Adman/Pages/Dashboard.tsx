import React from "react";
import HeaderDashboard from "../Components/HeaderDashboard";
import SidebarDashboard from "../components/SidebarDashboard";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div><SidebarDashboard />
      <div style={{ display: "flex" }}>
              <HeaderDashboard />

        <main style={{ flex: 1, padding: "24px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
