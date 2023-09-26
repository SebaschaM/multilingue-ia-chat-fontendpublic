import React, { useEffect, useState } from "react";
import "./../../style/chat.css";
import { useNavigate } from "react-router-dom";
import { socketAtom, userAtom } from "../../store/store";
import { useAtom } from "jotai";
import io from "socket.io-client";

const Chat = ({ userSelected }) => {
  console.log("usted quiere chatear con", userSelected);
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket] = useAtom(socketAtom);
  const [lastLoggedInUser, setLastLoggedInUser] = useState();
  const [salaPrivada, setSalaPrivada] = useState(null); // Agrega un estado para la sala privada

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      // Cuando el socket se conecta, realizas las suscripciones a eventos
      console.log("Socket conectado en CHAT");
    });

    // TODO: SALA PRIVADA
    socket.emit("crear_sala_privada", {
      email_usuario_1: user.email,
      email_usuario_2: userSelected.email
    });

    socket.on("sala_privada_creada", ({ sala_privada }) => {
      // Se recibe el evento de sala_privada_creada desde el servidor
      console.log(`Sala privada creada: ${sala_privada}`);
      setSalaPrivada(sala_privada);
    });

    socket.on("disconnect", () => {
      // Cuando el socket se desconecta, cancelas las suscripciones
      console.log("Socket desconectado");
      socket.off("message");
    });

    return () => {
      // Asegúrate de desconectar el socket cuando el componente se desmonte
      socket.disconnect();
    };
  }, []); // El efecto se ejecuta solo una vez

  useEffect(() => {
    if (socket) {
      socket.on("users_connected", (users) => {
        setConnectedUsers(users);
        console.log("Connected users en CHAT", users);

        // Obtener el último usuario logueado de la lista
        if (users.length > 0) {
          const lastUser = users[users.length - 1];
          console.log("Last user EN CHAT", lastUser);
          setLastLoggedInUser(lastUser);
        }
      });
    }
  }, [socket, connectedUsers]);

  const cerrarSesion = () => {
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div>
        <h2>Usuarios Conectados EN LA SALA:</h2>
        <ul>
          {connectedUsers.map((user) => (
            <li key={user.id}>
              {user.email} {user.id === lastLoggedInUser?.id && "(new)"}
            </li>
          ))}
        </ul>
      </div>

      <h3> usted quiere chatear con {userSelected.email}</h3>
      <div className="card"></div>
      <div className="chat-header">Chat</div>
      <div className="chat-window">
        {/* Mostrar el nombre de la sala privada si está definida */}
        {salaPrivada && <p>Sala Privada: {salaPrivada}</p>}
        <ul className="message-list"></ul>
      </div>
      <div className="chat-input">
        <form>
          <input
            type="text"
            className="message-input"
            placeholder="Type your message here"
          />
          <button className="send-button" type="submit">
            Send
          </button>
          <button onClick={cerrarSesion}>Cerrar sesión</button>
        </form>
      </div>
    </>
  );
};

export default Chat;
