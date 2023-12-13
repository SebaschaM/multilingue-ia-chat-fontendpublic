import { Routes, Route, Navigate } from "react-router-dom";

import {
  Dashboard,
  DashboardChat,
  DashboardManagerUser,
  DashboardMetrics,
  DashboardRequests,
} from "../pages";
import DashboardNotifications from "../pages/admin/DashboardNotifications";

export const PrivateRouter = () => {
  return (
    <Routes>
      <Route path="" element={<Dashboard />} />
      <Route path="metrics" element={<DashboardMetrics />} />
      <Route path="chats" element={<DashboardChat />} />
      <Route path="requests" element={<DashboardRequests />} />
      <Route path="manager-users" element={<DashboardManagerUser />} />
      <Route path="notifications" element={<DashboardNotifications />} />

      <Route path="*" element={<Navigate to="/admin/dashboard/" />} />
    </Routes>
  );
};
