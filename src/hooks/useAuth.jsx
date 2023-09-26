// import { useEffect, useState } from "react";
import ApiJson from "../api/api-json-config";

export const useAuth = () => {
  //TODO: PODEMOS INSTANCIAR EL ESTADO GLOBAL

  const handleLogin = async (dataLogin) => {
    try {
      const { data } = await ApiJson.post("/login", dataLogin);
      return data;
    } catch (error) {
      return { error: error.response.data.error, success: false };
    }
  };

  //TODO: PODEMOS MANEJARLO CON MULTIPART DATA PARA EL ENVIO DE IMAGENES
  //TODO: POR CORREGIR
  const handleRegister = async (dataRegister) => {
    const { data } = await ApiJson.post("/register", dataRegister);
    return data;
  };

  const handleVerifyEmail = async (dataVerifyEmail) => {
    try {
      const { data } = await ApiJson.post("/verify-email-exists", {
        email: dataVerifyEmail,
      });
      return data;
    } catch (error) {
      return { success: false, message: error.response.data.error };
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleVerifyEmail,
  };
};
