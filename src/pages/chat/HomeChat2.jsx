import React, { useEffect, useState } from "react";
import "./../../style/chat.css";
import { useAtom } from "jotai";
import { socketAtom, userAtom } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ChatUserList from "./ChatUserList";

const HomeChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [user, setUser] = useAtom(userAtom);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const socket = useAtom(socketAtom)[0];
  const [salaCreada, setSalaCreada] = useState("");

  const createIdFake = (email) => {
    if (email == "jore0@autonoma.edu.pe") return "5601353";
    else return "987612538";
  };
  useEffect(() => {
    const uuid = createIdFake(user.email);
    if (socket && user) {
      const data = {
        email: user.email,
        uuid: uuid,
      };
      console.log(data, "data enviada");
      socket.emit("login", data);
      socket.on("users_connected", (users) => {
        setConnectedUsers(users);
        console.log("Connected users", users);
        if (connectedUsers.length > 1) {
          const uuidUsuario1 = createIdFake(user.email);
          const data = {
            uuid_usuario_1: uuidUsuario1,
            email_usuario_1: user.email,
          };
  
          // Envía la solicitud al backend
          socket.emit("crear_sala_privada", data);
          console.log("Ingresó?")
          socket.on("sala_privada_creada", (data) => {
            console.log("Sala privada creada", data);
            setSalaCreada(data.sala_privada);
            console.log("Sala creada", data.sala_privada);
          });
        }
      });
    }
  }, [socket, user]);

  useEffect(() => {
    // Escucha eventos de "message" del socket y agrega el mensaje al estado "messages"
    if (socket) {
      socket.on("message", (messageData) => {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      });
    }

    // Limpia los oyentes cuando el componente se desmonta
    return () => {
      if (socket) {
        socket.off("message");
      }
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() !== "") {
      enviarMensajeASala();
      setMessage("");
    }
  };

  // const sendMessage = () => {
  //   if (message && socket) {
  //     const personEmail = user.email;
  //     socket.emit("message", { message, personEmail });
  //   }
  // };

  const enviarMensajeASala = () => {
    // Verificar si el socket y el usuario están disponibles
    if (socket && user) {
      // Crear un objeto con la información del mensaje y la sala
      const mensajeData = {
        message: message, // El mensaje que se enviará
        usuario: user.email, // O puedes tomar el nombre de la persona de algún otro lugar
        salaCreada: salaCreada, // Debes proporcionar el nombre de la sala privada
      };
      console.log("mensaje emitido al backend",mensajeData);

      // Emitir el mensaje a la sala específica en el backend
      socket.emit("mensaje_privado", mensajeData);
      
      //unois segundos para que responda el backend
      setTimeout(() => {
        socket.on("mensaje_privado", (data) => {
          console.log("mensaje recuperado del backend",data);
        });
      }, 50000);

      // Agregar el mensaje al estado de mensajes locales si es necesario
      // Esto dependerá de tu implementación específica
      setMessages((prevMessages) => [...prevMessages, mensajeData]);
    }
  };
  useEffect(() => {
    
  },[enviarMensajeASala]);

  const handleInputChange = (e) => {
    console.log("Input change", e.target.value)
    setMessage(e.target.value);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/");
  };

  //TODO: AQUI FUNCIONANDO PERO FALTA LISTAR EN LOS MENSAJES
  // const escucharMensajeDeSala = (salaPrivada) => {
  //   // Verificar si el socket está disponible
  //   if (socket) {
  //     // Escuchar eventos de "mensaje_privado" en la sala específica
  //     socket.on("mensaje_privado", (data) => {
  //       console.log(data, "mensaje recuperado del backend");
  //       if (data.sala_privada === salaPrivada) {
  //         // Agregar el mensaje al estado de mensajes locales si es necesario
  //         // Esto dependerá de tu implementación específica
  //         setMessages((prevMessages) => [...prevMessages, data]);
  //       }
  //     });
  //   }
  // };
  
  
  // useEffect(() => {
  //   // Llamar a la función para escuchar mensajes en la sala creada
  //   if (salaCreada) {
  //     escucharMensajeDeSala(salaCreada, (data) => {
  //       console.log("Mensaje recibido en sala", salaCreada, ":", data);
  //     });
  //   }
  // }, [salaCreada]);

  return (
    <>
    <h1>CHAT 2</h1>
    {connectedUsers.length > 1 ? (
      <>
        <div className="chat-header">Chat</div>
        <p> mi correo es {user.email}</p>
        <div className="chat-window">
          <ul className="message-list">
            {messages.map((messageData, index) => (
              <li key={index}>
                <p>
                  <strong>{messageData.usuario}: </strong>
                  {messageData.mensaje}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="chat-input">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="message-input"
              placeholder="Type your message here"
              value={message}
              onChange={handleInputChange}
            />
            <button className="send-button" type="submit">
              Send
            </button>
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </form>
          {/* <button onSubmit={enviarMensajeASalaPrivada}>Enviar a sala privada</button> */}
        </div>
      </>
    ) : <p> espera al otro usuario</p>}
  </>
  
  );
};

export default HomeChat;
