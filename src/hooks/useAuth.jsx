// import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import ApiJson from "../api/api-json-config";
import { userAtom } from "../store/store";

export const useAuth = () => {
  const [user, setUserAtom] = useAtom(userAtom);

  const handleLogin = async (dataLogin) => {
    try {
      const { data } = await ApiJson.post("/admin/auth/login", dataLogin);
      const { jwt_token, user } = data;
      setUserAtom({
        jwt_token,
        user,
      });
      localStorage.setItem("userData", JSON.stringify({ jwt_token, user }));
      return data;
    } catch (error) {
      return {
        error: error.response.data.error,
        success: false,
        intents: error.response.data.intents,
      };
    }
  };

  //TODO: PODEMOS MANEJARLO CON MULTIPART DATA PARA EL ENVIO DE IMAGENES
  //TODO: POR CORREGIR
  const handleRegister = async (dataRegister) => {
    const { data } = await ApiJson.post("/admin/auth/register", dataRegister);
    return data;
  };

  const handleCheckEmailExists = async (dataVerifyEmail) => {
    console.log(dataVerifyEmail);
    try {
      const { data } = await ApiJson.post("/admin/auth/verify-email-exists", {
        email: dataVerifyEmail,
      });
      console.log(data);
      return data;
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setUserAtom(null);
  };

  const handleVerifyMaintenance = async () => {
    try {
      const data = {
        id: 12345,
        message_notification: "El sistema está en mantenimiento",
        date_start: "2023-10-12T18:29:51.000Z",
        date_end: "2023-10-13T18:29:51.000Z",
        status: "activee",
      };
      // const { data } = await ApiJson.post("/verify-maintenance", {});
      return data;
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleCheckEmailExists,
    handleLogout,
    setUserAtom,
    user,
    handleVerifyMaintenance,
  };
};
