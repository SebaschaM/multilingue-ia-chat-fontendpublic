import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { socketAtom, userAtom } from "../../store/store";
import io from "socket.io-client";
import Chat from "./Chat";



const PanelChat = () => {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [socket] = useAtom(socketAtom);
  const [user] = useAtom(userAtom);

  const [showChat, setShowChat] = useState(null);
  const [lastLoggedInUser, setLastLoggedInUser] = useState(); // Nuevo estado para el último usuario logueado

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      // Cuando el socket se conecta, realizas las suscripciones a eventos
      console.log("Socket conectado");
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
      console.log(lastLoggedInUser, "ultimo usuario logueado")
      const userData = { email: user.email, socket_id: "xd" };

      socket.emit("login", userData);
    }
  }, [user, socket]);

  
  useEffect(() => {
    if (socket) {
      socket.on("users_connected", (users) => {
        setConnectedUsers(users);
        console.log("Connected users", users);
  
        // Obtener el último usuario logueado de la lista
        if (users.length > 0) {
          const lastUser = users[users.length - 1];
          // console.log("Last user", lastUser);
          setLastLoggedInUser(lastUser);
        }
      });
    }
  }, [socket, connectedUsers]);

 

  const toggleChat = (socketId) => {
    // console.log("Toggle chat para el usuario con ID:", socketId);
  };

  // Función para manejar el clic en un nombre de usuario
  const handleUserClick = (user) => {
    // console.log(user, 'usuario seleccionado, dirigir a sala');
    setSelectedUser(user);
    toggleChat(user.socket_id);
  };

  // console.log("ultimo lloger ", lastLoggedInUser);

  // Filtrar la lista de usuarios para excluir al usuario actual
  const otherConnectedUsers = connectedUsers.filter(
    (u) => u.socket_id !== user.socket_id
  );

  return (
    <div>
      {/* Mostrar el ID del usuario */}
      {lastLoggedInUser && (
        <h4>Chat mi ID es {lastLoggedInUser.socket_id}</h4>
      )}
      <div>
        <h2>Usuarios Conectados:</h2>
        <ul>
          {otherConnectedUsers.map((user) => (
            <li key={user.id}>
              {/* Mostrar el nombre del usuario y un botón para abrir/cerrar el chat */}
              <span
                style={{ cursor: "pointer" }}
                onClick={() => handleUserClick(user)} // Manejar el clic en el nombre
              >
                {user.email}
              </span>{" "}
              {/* ... */}
            </li>
          ))}
        </ul>
      </div>

      {/* Mostrar los detalles del usuario seleccionado */}
      {selectedUser && (
        <div>
          <h2>Detalles del Usuario:</h2>
          <p>Socket: {selectedUser.socket_id}</p>
          <p>Correo Electrónico: {selectedUser.email}</p>
          <Chat userSelected={selectedUser} />
        </div>

      )
      }
      
      

      {/* Resto de la interfaz de usuario del chat */}
    </div>
  );
};

export default PanelChat;
