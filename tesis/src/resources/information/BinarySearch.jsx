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
            Búsqueda
            </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(\log n)$</Latex>
          </td>
          <td>
            <Latex>$O(\log n)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

const BinarySearch = (
  <div>
    <h1>Búsqueda Binaria</h1>
    <div>
      {complexity}
      <p>
        La búsqueda binaria, o <i>búsqueda dicotómica</i> es un algoritmo utilizado para buscar
        elementos en un arreglo de elementos ordenados.
      </p>
    </div>
    <p>
      El algoritmo realiza una búsqueda por intervalos sobre el arreglo, iniciando con un intervalo
      que cubre todo el arreglo. Si la consulta es menor al elemento medio del intervalo, se busca a
      la izquierda de dicho elemento. Si es mayor, se busca a la derecha. El algoritmo termina cuando,
      en algún intervalo el elemento medio es igual al consultado, o se realiza una búsqueda en un intervalo
      vacío.
    </p>
  </div>
)

export default BinarySearch;