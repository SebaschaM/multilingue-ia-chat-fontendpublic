import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  Verify_Email,
  AboutMe_Register,
} from "../pages";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/verify-email" element={<Verify_Email />} />
        <Route path="/aboutme-register" element={<AboutMe_Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
