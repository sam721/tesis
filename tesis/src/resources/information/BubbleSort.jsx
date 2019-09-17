import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Mejor caso</th>
          <th>Peor caso</th>
          <th>Caso promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Ordenamiento
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(n^2)$</Latex>
          </td>
          <td>
            <Latex>$O(n^2)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)
const BubbleSort = (
  <div>
    <h1>Ordenamiento Burbuja</h1>
    <div>
      {complexity}
      <p>
        El ordenamiento burbuja, del inglés <i>bubble-sort</i> es un algoritmo de ordenamiento de
        arreglos. Funciona realizando todas las <i>inversiones</i> necesarias sobre el arreglo.
        Una inversión consiste en el intercambio de dos elementos del arreglo, que se encuentran en
        posiciones contrarias de acuerdo a su orden.
      </p>
    </div>

    <p>
      El algoritmo realiza las iteraciones necesarias hasta que el arreglo esté ordenado.
      La máxima cantidad de iteraciones que realizará el algoritmo será igual a la longitud del arreglo.
    </p>
    <p>
      En cada iteración, se compara cada posición con el elemento siguiente. Si están en posiciones contrarias,
      se realiza una inversión y se continúa recorriendo el arreglo hasta llegar al final
    </p>
    <p>
      Este es un algoritmo de ordenamiento poco eficiente, y suele ser utilizado con propósitos educativos.
    </p>
  </div>
);

export default BubbleSort;