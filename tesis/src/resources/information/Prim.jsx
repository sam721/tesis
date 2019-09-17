
import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
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
const Prim = (
  <div>
    <h1>Prim</h1>
    <div>
      {complexity}
      <p>
        El algoritmo de Prim (por uno de sus publicadores, Robert C. Prim) es un algoritmo utilizado
        sobre grafos con peso para obtener un árbol recubridor de costo mínimo.
      </p>
    </div>
    <p>
      <Latex>
        El árbol recubridor $T$ se inicializa como vacío. Al igual que el algoritmo de Dijkstra
        para cálculo de caminos de peso mínimo, el algoritmo de Prim explora los vecinos de cada nodo,
        con una ligera diferencia en el proceso de relajación. Al relajar una arista $(u,v,w)$, el nodo $v$
        actualiza su arista incidente de peso mínimo, en lugar de la distancia total de llegada.
      </Latex>
    </p>
    <p>
      Cada nodo es explorado en orden de prioridad con respecto al peso de su arista mínima incidente.
      Al explorar un nodo, se añade a <Latex>$T$</Latex> su menor arista incidente, con la excepción del nodo inicial (el cual
      no posee ninguna arista incidente en la exploración).
    </p>
    <p>
      Al haber explorado cada uno de los nodos de <Latex>$V$</Latex>,<Latex>$T$</Latex>contendrá un árbol recubridor de costo mínimo.
      Si el grafo de entrada es desconectado, entonces <Latex>$T$</Latex>contendrá un bosque de árboles recubridores mínimos.
      Similarmente al algoritmo de Dijkstra, para explorar cada nodo por orden de prioridad, suele usarse
      alguna estructura de datos eficiente, como las <b>colas de prioridad</b>.
    </p>
  </div>
)

export default Prim;