import React from 'react';

function SalasDisponibles({ salas, unirseASala }) {
  return (
    <div>
      <h2>Salas Disponibles</h2>
      <ul>
        {salas.map((sala) => (
          <li key={sala.id}>
            {sala.nombre} 
            <button onClick={() => unirseASala(sala.id)}>Unirse</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SalasDisponibles;
