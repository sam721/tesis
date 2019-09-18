import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Operación</th>
          <th>Mejor caso</th>
          <th>Peor caso</th>
          <th>Caso promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Encolar
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
            Desencolar
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
)

const Queue = (
  <div>
    <h1>Cola</h1>
    <div>
      {complexity}
      <p>
      Las colas (del inglés <i>queue</i>) son estructuras de datos utilizadas
      para almacenar y extraer elementos siguiendo el principio <b>FIFO</b> (<i>First-In, First-Out</i>, primero
      en entrar, primero en salir).
      </p>
    </div>
    <p>
      La cola es una estructura simple, ampliamente utilizada en variados algoritmos. 
      Por ejemplo, el algoritmo de BFS (Búsqueda en Anchura) hace uso de una cola para mantener los 
      nodos aún no explorados, esperando a ser extraídos para su exploración de acuerdo al orden 
      en que deben ser analizados.
    </p>
    <p>
      Debido a que debe mantenerse el orden de los elementos, pero solo se necesita tener acceso al primero,
      las colas suelen ser implementadas con listas simplemente enlazadas, manteniendo un apuntador extra
      hacia el último elemento de la lista, para así realizar inserciones de complejidad constante.
    </p>
  </div>
)

export default Queue;