import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  VerifyEmail,
  ActiveMaintenance,
  HomeChat,
  PanelChat,
  HomeChat2,
} from "../pages";
import { PrivateRouter } from "./PrivateRouter";



export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/home-chat" element={<HomeChat />} /> */}
        <Route path="/api/admin/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/ActiveMaintenance" element={<ActiveMaintenance />} />
        {/*<Route path="/register" element={<Register />} />*/}
        <Route path="/admin/auth" element={<Login />} />
        <Route path="/admin/dashboard/*" element={<PrivateRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
