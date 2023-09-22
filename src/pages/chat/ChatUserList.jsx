import React from "react";

const ChatUserList = ({ users, onUserSelect }) => {
  return (
    <div>
      <h2>Lista de Amigos</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name}{" "}
            <button onClick={() => onUserSelect(user)}>Enviar Mensaje</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatUserList;
