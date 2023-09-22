import React, { useEffect, useState } from "react";
import "./../../style/chat.css";
import { useAtom } from "jotai";
import { socketAtom, userAtom } from "../../store/store";
import { useNavigate } from "react-router-dom";
import ChatUserList from "./ChatUserList";

const HomeChat = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [user] = useAtom(userAtom);
  const [socket] = useAtom(socketAtom);
  const socketId = socket.id;
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
    setMessage("");
  };

  const sendMessage = () => {
    if (socket && message) {
      socket.emit("message", { message, socketId });
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    // Escucha los mensajes enviados por otros usuarios.
    socket.on("message", (message) => {
      // Actualiza el estado del componente para mostrar el nuevo mensaje.
      setMessages([...messages, message]);
    });
  }, [socket, messages]);

  return (
    <>
      <div className="card">
        <div className="card">
          {user ? (
            <p>Bienvenido {user.email} mi id es  {socketId}</p>
          ) : (
            <p>No has iniciado sesión.</p>
          )}
        </div>
        <div className="chat-header">Chat</div>
        <div className="chat-window">
          <ul className="message-list">
            {messages.map((message) => (
              <li key={message.socketId}>{message.message}</li>
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
          </form>
        </div>
      </div>
  
    </>
  );
};

export default HomeChat;