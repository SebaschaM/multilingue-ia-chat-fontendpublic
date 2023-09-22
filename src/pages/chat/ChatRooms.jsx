import React, { useState } from "react";

const ChatRooms = ({ availableRooms, onRoomSelect }) => {
  return (
    <div>
      <h2>Salas de Chat Disponibles (1 a 1)</h2>
      <ul>
        {availableRooms.map((room) => (
          <li key={room.id}>
            <button onClick={() => onRoomSelect(room)}>Sala con {room.user}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatRooms;
