import { Routes, Route, Navigate } from "react-router-dom";

import {
  Dashboard,
  DashboardChat,
  DashboardMetrics,
  DashboardRequests,
} from "../pages";

export const PrivateRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="metrics" element={<DashboardMetrics />} />
      <Route path="chats" element={<DashboardChat />} />
      <Route path="requests" element={<DashboardRequests />} />

      <Route path="*" element={<Navigate to="/exe-digital/dashboard" />} />
    </Routes>
  );
};
