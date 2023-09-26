import React, { useEffect, useState } from "react";
import "./../../style/chat.css";
import { useAtom } from "jotai";
import { socketAtom, userAtom } from "../../store/store";
import { useNavigate } from "react-router-dom";

const HomeChat = () => {
  const navigate = useNavigate();
  const [user, setUser] = useAtom(userAtom);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = useAtom(socketAtom)[0];

  //TODO: LOGIN:
  const handleLogin = () => {
    // Supongamos que tienes un objeto de usuario en tu estado global 'user'
    const userData = { username: user.email };
    socket.emit("login", userData);
    socket.emit("creacion_de_sala_privada", {
      username: user.email,
      room_name: "room",
    });
    socket.on("private_room_created", (data) => {
      console.log("response:", data);
    });
    socket.emit("asociacion_de_usuarios_a_la_sala_privada", {
      username: user.email,
      room_name: "room",
    });
    socket.on("user_joined_private_room", (data) => {
      console.log("response:", data);
    });
  };

  useEffect(() => {
    handleLogin(); // Llamada al inicio de sesión cuando se carga el componente

    // Escuchar eventos de mensajes entrantes desde el servidor
    // socket.on("message", (messageData) => {
    // setMessages([ ...messages, messageData]);
    // });

    // Limpieza al desmontar el componente
  }, []);

  useEffect(() => {

    socket.on("message", (messageData) => {
    console.log("escuchando mensaje del servidor:", messageData);
    setMessages([ ...messages, messageData]);
    });
  }, [messages]);

  const handleMessage = (msg) => {
    if (socket.connected) {
      // Supongamos que cada mensaje tiene un formato con un campo 'message'.
      // Si tu estructura de mensaje es diferente, ajústala aquí.
      const messageData = {
        username: user.email,
        room_name: "room", // Supongo que quieres enviar el mensaje a la sala 'room'
        message: msg,
      };

      socket.emit("envio_de_mensajes", messageData);
      console.log("enviando mensaje al servidor:", messageData);
      socket.on("message", (messageData) => {
        console.log("escuchando mensaje del servidor:", messageData);
        setMessages([ ...messages, messageData]);
    // });

        // setMessages([messageData, ...messages]);
      });

      // Limpiar el campo de entrada después de enviar el mensaje
      setMessage("");
    } else {
      // Manejar el caso en que el socket no esté conectado
      console.error("Socket is not connected");
      // Puedes mostrar un mensaje de error al usuario o intentar la conexión nuevamente.
    }
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    handleMessage(message); // Llama a handleMessage para enviar el mensaje
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const cerrarSesion = () => {
    localStorage.removeItem("userData");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <h1>chat 1</h1>
      <>
        <div className="chat-header">Chat</div>
        <p> mi correo es {user.email}</p>
        <div className="chat-window">
          <ul className="message-list">
            {messages.map((messageData, index) => (
              <li key={index}>
                <p>
                  <strong>{messageData.username}: </strong>
                  {messageData.message}
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
    </>
  );
};

export default HomeChat;
