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
            Búsqueda de caminos
            </td>
          <td>
            <Latex>$O(|E|log|V|+V^2|)$</Latex>
          </td>
          <td>
            <Latex>$O(|E|log|V|+|V^2|)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Conjuntos disjuntos
            </td>
          <td>
            <Latex>$O(|E|log|V|)$</Latex>
          </td>
          <td>
            <Latex>$O(|E|log|V|)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)
const Kruskal = (
  <div>
    <h1>Kruskal</h1>
    <div>
      {complexity}
      <p>
        El algoritmo de Kruskal (por su publicador, Joseph Kruskal) es un algoritmo utilizado
        sobre grafos con peso para obtener un árbol recubridor de costo mínimo.
      </p>
    </div>
    <p>
      El árbol recubridor <Latex>$T$</Latex> se inicializa como vacío. Las aristas del grafo son procesadas
      por orden de peso. Aquellas cuyo costo es menor son procesadas primero.
    </p>
    <p>
      <Latex>
        Una arista $(u,v,w)$ es añadida si no existe algún camino de $u$ a $v$
        en $T$. De existir algún camino, añadir dicha arista generaría la formación de un ciclo,
        y por ende $T$ dejaría de ser un árbol
  
        Si el grafo de entrada es desconectado, el algoritmo obtiene un bosque de árboles recubridores
        de costo mínimo
      </Latex>
    </p>
    <h2>Detección de ciclo en T</h2>
    <p>
      El paso mas complejo del algoritmo es verificar la existencia de algún camino en <Latex>$T$</Latex>.
      Sin embargo, solo hace falta verificar la existencia de caminos en <Latex>$T$</Latex>, no el camino en sí.
      Es por esto que, en lugar de encontrar caminos, basta con verificar que ambos nodos se encuentren
      en la misma componente conexa de <Latex>$T$</Latex>. Esto suele realizarse por medio de alguna estructura de datos,
      usualmente siendo usados los <b>conjuntos disjuntos</b>, debido a su eficiencia en tiempo.
    </p>
  </div>
)

export default Kruskal;