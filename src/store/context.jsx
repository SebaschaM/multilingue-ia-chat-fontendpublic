import React, { useEffect } from "react";
import { atom, useAtom, useSetAtom } from "jotai"; // Importa useSetAtom
import client from "socket.io-client";
import { userAtom, socketAtom } from "./store";


export const ContextSocketProvider = ({ children }) => {
  const setSocket = useSetAtom(socketAtom); // Usa useSetAtom para modificar el valor del átomo
  const [user, setUser] = useAtom(userAtom); // Usar useAtom para obtener y establecer el estado global del usuario


  useEffect(() => {
    if (user) {
      const SOCKET_URI = "http://localhost:5000";
      const newSocket = client(SOCKET_URI);

      setSocket(newSocket);

      return () => {
        // Desconectar el socket cuando el componente se desmonte
        newSocket.disconnect();
      };
    }
  }, [user]);

  return (
    <>
      {children}
    </>
  );
};
