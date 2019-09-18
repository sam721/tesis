import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
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
        <tr>
          <td>
            Lista de adyacencia
            </td>
          <td>
            <Latex>$O(|E|+|V|log|V|)$</Latex>
          </td>
          <td>
            <Latex>$O(|E|+|V|log|V|)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)
const Dijkstra = (
  <div>
    <h1>Dijkstra</h1>
    <div>
      {complexity}
      <p>El algoritmo de Dijkstra (por su publicador, Edsger Dijkstra) es un algoritmo
        utilizado sobre grafos con pesos no negativos, el cual calcula el costo mínimo para llegar desde un
        nodo inicial hasta los demás vertices del grafo (o algún nodo en específico).
      </p>
    </div>
    <p>
      Similar al algoritmo BFS, se realiza una exploración hacia los vecinos de cada nodo.
      Sin embargo, al examinar una arista <Latex>$(u,v,w)$</Latex>, se realiza una actualización del costo para
      llegar hasta el nodo <Latex>$v$</Latex>, habiendo obtenido el costo mínimo para llegar a <Latex>$u$</Latex>.
      Este proceso es conocido como <b>relajación</b>
    </p>
    <p>
      En el algoritmo de Dijkstra, los nodos son explorados en orden de prioridad, siendo los nodos
      mas prioritarios aquellos cuyo costo de llegada sea el menor posible. Diferentes estructuras
      suelen ser utilizadas para esto, siendo una de las mas eficientes la <b>cola de prioridad</b>,
      las cuales son usualmente implementadas con <b>Heaps</b>
    </p>
    <h2>Pesos negativos y ciclos negativos</h2>
    <p>Debido a la naturaleza <i>greedy</i> del algoritmo, el proceso de relajación siempre
    es aplicado asumiendo que se ha calculado el costo mínimo de llegada desde el punto inicial
    de una arista. Por esto, si existen aristas con peso negativo en el grafo, el proceso de relajación
    puede fallar, ignorando por completo caminos de menor costo, o cayendo en <b>ciclos negativos</b></p>.

  </div>
);

export default Dijkstra;