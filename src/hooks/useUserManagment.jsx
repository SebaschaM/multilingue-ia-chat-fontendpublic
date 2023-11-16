// import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import ApiJson from "../api/api-json-config";
import { userAtom } from "../store/store";

export const useUserManagment = () => {
  const handleGetUsers = async () => {
    try {
      const { data } = await ApiJson.get("/admin/user/get-users");
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteUsers = async (deleteUserById) => {
    try {
      const { data } = await ApiJson.delete("/admin/user/delete-user", {
        data: { user_id: deleteUserById },
        headers: {
          "Content-Type": "application/json",
        },
      });
      return { success: true, data };
    } catch (error) {
      console.log(error);
    }
  };

  const handleUserById = async (id) => {
    try {
      const response = await ApiJson.get(`/admin/user/get-user/${id}`, {});
      return response.data; // Devuelve los datos de la respuesta
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateUsers = async (newUserData) => {
    try {
      const { data } = await ApiJson.put(
        "/admin/user/update-user",
        newUserData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleUserById,
    handleGetUsers,
    handleUpdateUsers,
    handleDeleteUsers,
  };
};
