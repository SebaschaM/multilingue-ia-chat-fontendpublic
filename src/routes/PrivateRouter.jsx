import { useEffect, useState } from "react";
import { useNavigate, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Dashboard,
  DashboardChat,
  DashboardManagerUser,
  DashboardMetrics,
  DashboardRequests,
} from "../pages";
import DashboardNotifications from "../pages/admin/DashboardNotifications";

const InactivityWrapper = ({ children }) => {
  const navigate = useNavigate();
  const { handleLogout } = useAuth();
  const inactivityTimeout = 300000; // 5 MINUTOS DE INACTIVIDAD
  let activityTimer;

  const resetTimer = () => {
    clearTimeout(activityTimer);
    activityTimer = setTimeout(() => {
      localStorage.removeItem("userData");
      handleLogout();
      navigate("/admin/auth");
    }, inactivityTimeout);
  };

  useEffect(() => {
    const handleMouseMove = () => resetTimer();
    const handleKeyPress = () => resetTimer();

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keypress", handleKeyPress);

    resetTimer();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keypress", handleKeyPress);
      clearTimeout(activityTimer);
    };
  }, []);

  return <>{children}</>;
};

export const PrivateRouter = () => {
  return (
    <Routes>
      <Route
        path=""
        element={
          <InactivityWrapper>
            <Dashboard />
          </InactivityWrapper>
        }
      />
      <Route
        path="metrics"
        element={
          <InactivityWrapper>
            <DashboardMetrics />
          </InactivityWrapper>
        }
      />
      <Route
        path="chats"
        element={
          <InactivityWrapper>
            <DashboardChat />
          </InactivityWrapper>
        }
      />
      <Route
        path="requests"
        element={
          <InactivityWrapper>
            <DashboardRequests />
          </InactivityWrapper>
        }
      />
      <Route
        path="manager-users"
        element={
          <InactivityWrapper>
            <DashboardManagerUser />
          </InactivityWrapper>
        }
      />
      <Route
        path="notifications"
        element={
          <InactivityWrapper>
            <DashboardNotifications />
          </InactivityWrapper>
        }
      />
      <Route path="*" element={<Navigate to="/admin/dashboard/" />} />
    </Routes>
  );
};
