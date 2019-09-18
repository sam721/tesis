
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
            <Latex>$O(|V^3|)$</Latex>
          </td>
          <td>
            <Latex>$O(|V^3|)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Lista de adyacencia
              </td>
          <td>
            <Latex>$O(|E||V|)$</Latex>
          </td>
          <td>
            <Latex>$O(|E||V|)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

const BellmanFord = (
  <div>
    <h1>Bellman-Ford</h1>
    <div>
      {complexity}
      <p>
        <Latex>
          El algoritmo Bellman-Ford (por sus publicadores, Richard Bellman y Lester Ford Jr.
            es un algoritmo utilizado sobre grafos con pesos no negativos, el cual calcula el costo mínimo
            para llegar desde un nodo inicial hasta los demás vertices del grafo (o algún nodo en específico).
        </Latex>
      </p>
    </div>
    <p>
      <Latex>
        A pesar de ser más lento que el algoritmo de Dijkstra, Bellman-Ford puede manejar aristas con
        pesos negativos, y a su vez puede detectar ciclos de costo negativo sobre el grafo.
      </Latex>
    </p>
    <p>
      <Latex>
        El algoritmo primero inicializa el costo de llegada hacia todos los nodos como infinito,
        excepto el nodo inicial, cuyo costo de llegada es naturalmente 0. Luego, por cada arista
        $(u,v,w)$ se actualiza el costo de llegada a $v$, basándose en el costo parcial de llegada
        a $u$. Este proceso es repetido $|V|-1$ veces, basándose en el hecho de que la longitud de un camino
        entre cada par de nodos es a lo sumo $|V|-1$
      </Latex>
    </p>
    <h2>Ciclos negativos</h2>
    <p>
      <Latex>
        Como último paso, se realiza el proceso de relajación. Si alguna de las distancias es relajada,
        se dice que se ha encontrado un ciclo negativo en el grafo. Todo ciclo negativo alcanzable desde
        un nodo hace que no exista camino mínimo hacia diferentes nodos en el grafo.
      </Latex>
    </p>
  </div>
);

export default BellmanFord;