// import { useEffect, useState } from "react";
import ApiJson from "../api/api-json-config";

export const useAuth = () => {
  //TODO: PODEMOS INSTANCIAR EL ESTADO GLOBAL

  const handleLogin = async (dataLogin) => {
    const {data} = await ApiJson.post("/login", dataLogin);
    return data;
  };

  //TODO: PODEMOS MANEJARLO CON MULTIPART DATA PARA EL ENVIO DE IMAGENES
  //TODO: POR CORREGIR
  const handleRegister = async (dataRegister) => {
    const { data } = await ApiJson.post("/register", dataRegister);
    return data;
  };

  const handleVerifyEmail = async (dataVerifyEmail) => {
    const { data } = await ApiJson.post("/verify-email", dataVerifyEmail);
    return data;
  }

  return {
    handleLogin,
    handleRegister,
    handleVerifyEmail
  };
};
