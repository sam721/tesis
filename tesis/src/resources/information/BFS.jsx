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
);

const BFS = (
  <div>
    <h1>BFS</h1>
    <div>
      {complexity}
      <p>
        El algoritmo BFS (Breadth-First Search, Búsqueda en Anchura) es un algoritmo
        de búsqueda sobre grafos. A partir de un nodo inicial, cada uno de los vecinos
        son explorados, aumentando así el nivel de profundidad de la búsqueda.
      </p>
    </div>
    <p>
      Cada uno de los nodos son explorados por orden de profundidad (o expansión).
      Debido a este orden de exploración, el algoritmo es comúnmente implementado
      utilizando algún tipo de estructura de datos especial. Las colas, al ser tipo
      FIFO (First In, First Out - Primero en Entrar, Primero en Salir) son una natural
      elección para la implementación del algoritmo BFS
    </p>
  </div>
);

export default BFS;