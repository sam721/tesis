import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th></th>
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
            <Latex>$O(n\log n)$</Latex>
          </td>
          <td>
            <Latex>$O(n\log n)$</Latex>
          </td>
          <td>
            <Latex>$O(n\log n)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)

const MergeSort = (
  <div>
    <h1>Ordenamiento por mezcla</h1>
    <div>
      {complexity}
      <p>
        El ordenamiento por mezcla (del inglés <i>merge-sort</i>), es un algoritmo utilizado para
        ordenar arreglos. Es un algoritmo <i>divide y vencerás</i>.
      </p>
    </div>
    <p>
      El algoritmo consiste en la división recursiva del arreglo en mitades. El caso base de la recursión
      es un arreglo de longitud 1, el cual lógicamente ya se encuentra ordenado.
    </p>
    <p>
      La <i>conquista</i> del algoritmo viene dada por la función de mezcla. Una vez que dos mitades se
      encuentran ordenadas, se convierte en una tarea trivial obtener un arreglo con los elementos ordenados
      de ambas mitades.
    </p>
    <p>
      En cada paso de la mezcla, se añade al arreglo el elemento mas pequeño de ambas mitades. Gracias a la división
      recursiva, se puede notar fácilmente que este elemento estará al principio de alguno de los dos arreglos.
    </p>
    <p>
      El algoritmo concluye al realizar la mezcla del arreglo completo. A diferencia del <i>ordenamiento burbuja</i>,
      el ordenamiento por mezcla es muy eficiente, teniendo una complejidad <i>poli-logarítmica</i>. A lo sumo
      existirán <Latex>$O(\log n)$</Latex> níveles de recursión, y en cada uno se analizarán a lo sumo el arreglo completo,
      resultando en una complejidad total de <Latex>$O(n\log n)$</Latex>
    </p>
    <h2>Desventaja del ordenamiento por mezcla</h2>
    <p>
      Aunque el ordenamiento por mezcla tiene un muy buen peor caso, la complejidad se mantiene igual
      tanto para el mejor y caso promedio.
    </p>
    <p>
      En cada nivel de la recursión, se debe utilizar un arreglo auxiliar. Existen variadas mejoras al algoritmo
      cuyo objetivo es el de reducir la complejidad en memoria. Creando arreglos auxiliares en cada nivel de la recursión,
      se tiene <Latex>$O(n\log n)$</Latex> de memoria. Teniendo un arreglo auxiliar general para cada nivel, se reduce
      la memoria auxiliar a <Latex>$O(n)$</Latex>.
    </p>
  </div>
)

export default MergeSort;