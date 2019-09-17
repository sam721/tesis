import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th />
          <th>Peor caso</th>
          <th>Caso promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Matriz de adyacencia
            </td>
          <td>
            <Latex>$O(|V^2|)$</Latex>
          </td>
          <td>
            <Latex>$O(|V^2|)$</Latex>
          </td>
        </tr>
      </tbody>
      <tr>
        <td>
          Lista de adyacencia
          </td>
        <td>
          <Latex>$O(|V|+|E|)$</Latex>
        </td>
        <td>
          <Latex>$O(|V|+|E|)$</Latex>
        </td>
      </tr>
    </Table>
  </div>
)
const DFS = (
  <div>
    <h1>DFS</h1>
    <div>
      {complexity}
      <p>El algoritmo DFS (Depth-First Search, Búsqueda en Profundidad) es un algoritmo
        de búsqueda sobre grafos. A partir de un nodo inicial, se explora cada vecino
        recursivamente hasta lo mas profundo del espacio de búsqueda. Una vez alcanzado
        el nivel mas profundo (un nodo sin vecinos a los cuales visitar), se realiza
        <i>vuelta atrás</i>, continuando la exploración de los vecinos del nodo anteriormente
        visitado.
      </p>
    </div>
    <p>
      Debido a su naturaleza recursiva, el algoritmo DFS es implementado usando funciones
      recursivas, aunque existen variantes iterativas en las que se utilizan estructuras de datos
      tipo pila. De hecho, las versiones recursivas hacen uso de la pila del sistema.
    </p>
  </div>
);

export default DFS;