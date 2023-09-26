import React, { useEffect } from "react";
import { atom, useAtom } from "jotai";
import { socketAtom, userAtom } from "./store";
import io from "socket.io-client";


export const ContextSocketProvider = ({ children }) => {
  const [user, setUser] = useAtom(userAtom);
  const [socket, setSocket] = useAtom(socketAtom); // Agrega socket a los átomos que utilizas


  useEffect(() => {
    // Intenta cargar el usuario desde localStorage al iniciar la aplicación
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
    }

    if (user) {
      const SOCKET_URI = "http://localhost:5000"; // Reemplaza con la URL de tu servidor Socket.io
      const newSocket = io(SOCKET_URI, {
        reconnection: false, // Desactivar la reconexión automática
        reconnectionAttempts: 0, // Número de intentos de reconexión (0 significa ilimitado)
      });
      
      // Escucha eventos del socket aquí, por ejemplo:
      newSocket.on("connect", () => {
        console.log("Conectado al servidor de sockets");
      });

      newSocket.on("disconnect", () => {
        console.log("Desconectado del servidor de sockets");
      });
      newSocket.on("connect_error", (error) => {
        console.error("Error de conexión:", error);
      });
      

      // Actualiza el átomo socketAtom con la instancia del socket
      setSocket(newSocket);

      return () => {
        // Desconecta el socket cuando el componente se desmonte
        newSocket.disconnect();
      };
    }
  }, [user, setUser, setSocket])
  


  // Cuando el usuario cambia, actualiza los datos en localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("userData", JSON.stringify(user));
    } else {
      // Si el usuario es nulo (por ejemplo, cuando cierra sesión), elimina los datos de localStorage
      localStorage.removeItem("userData");
    }
  }, [user]);

  return <>{children}</>;
};
