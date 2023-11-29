import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Verify_Email,
  AboutMe_Register,
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
        <Route path="/verify-email" element={<Verify_Email />} />
        <Route path="/aboutme-register" element={<AboutMe_Register />} />
        <Route path="/panel-chat" element={<PanelChat />} />
        {/*<Route path="/register" element={<Register />} /> */}
        <Route path="/admin/auth" element={<Login />} />
        <Route path="/admin/dashboard/*" element={<PrivateRouter />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
