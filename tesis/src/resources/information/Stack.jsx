import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th />
          <th>Mejor caso</th>
          <th>Peor caso</th>
          <th>Caso promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Apilar
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Desapilar
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

const Stack = (
  <div>
    <h1>Pila</h1>
    <div>
      {complexity}
      <p>
      Las colas (del inglés <i>queue</i>) son estructuras de datos utilizadas
      para almacenar y extraer elementos siguiendo el principio <b>LIFO</b> (<i>Last-In, First-Out</i>, último
      en entrar, primero en salir).
      </p>
    </div>
    <div>
      <p>
        Al igual que las colas, la pila es una estructura simple utilizada en la implementación de 
        diversos algoritmos. Por ejemplo, las pilas pueden ser utilizadas en una versión iterativa de 
        DFS (Búsqueda en Profundidad). Otro ejemplo en el que una pila puede ser utilizada es en la 
        evaluación de operaciones aritméticas en notación <i>pos-fija</i>
      </p>
      <p>
        Las pilas pueden ser implementadas como listas enlazadas simples, siempre insertando 
        y extrayendo el frente de la lista, sin necesidad de ningún otro apuntador extra
      </p>
    </div>
  </div>
)

export default Stack;
