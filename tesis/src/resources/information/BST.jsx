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
            Inserción
            </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(\log n)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Búsqueda
            </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(\log n)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Eliminación
            </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(\log n)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
);

const BST = (
  <div>
    <h1>
      Árbol Binario de Búsqueda
    </h1>
    <div>
      {complexity}
      <p>
        Un Árbol Binario de Búsqueda es una estructura de datos
        en la cual se cumplen las siguientes propiedades:
        <ol>
          <li key='1'>
            Es un Árbol Binario
          </li>
          <li key='2'>
            Todos los nodos pertenecientes al sub-árbol izquierdo son menores
            o iguales que la raíz
          </li>
          <li key='3'>
            Todos los nodos pertenecientes al sub-árbol derecho son mayores
            que la raíz
          </li>
          <li key='4'>
            Todos los nodos del árbol son Árboles Binarios de Búsqueda
          </li>
        </ol>
      </p>
    </div>
    <p>
      Al mantener los datos de manera ordenada, los ABB son frecuentemente
      utilizados para eficientes inserciones, búsqueda y eliminaciones.

      Los ABB poseen como peor caso complejidad en tiempo lineal. Es por esto
      que existen varios tipos de ABB que procuran mantener una altura logarítmica,
      tales como los <i>AVL</i> o los <i>rojo-negro</i>
    </p>
    <h2>Operaciones</h2>
    <h3>Búsqueda</h3>
    <p>
      Los Árboles Binarios de Búsqueda permiten realizar búsqueda binaria
      sobre sus elementos. Para buscar, simplemente se compara el valor del nodo actual
      al buscado. Si el elemento buscado es menor al nodo actual, se busca recursivamente
      en el sub-árbol izquierdo, de lo contrario se busca en el sub-árbol derecho.

      Este proceso se repite hasta encontrar el elemento, o llegar a una hoja del árbol
    </p>

    <h3>Inserción</h3>
    <p>
      La inserción se lleva a cabo de la misma manera recursiva que la búsqueda.
      Al llegar a una hoja, se crea un nuevo nodo y se añade al árbol.
    </p>

    <h3>Eliminación</h3>
    <p>
      Existen tres casos a considerar en la eliminación de nodos en un ABB.
      <ol>
        <li key='1'>
          Eliminar una hoja: El caso mas sencillo, simplemente se elimina del árbol. Se sigue manteniendo
          la propiedad del ABB.
        </li>
        <li key='2'>Eliminar un nodo con un solo hijo: En este caso, el único hijo del nodo a eliminar
          lo suplantará. Llamando P y H a los nodos padre e hijo del nodo a eliminar, se convierte a H
          como el nuevo hijo de P. En el caso de que el nodo a eliminar sea la raíz, H se convierte en la nueva
          raíz del árbol
        </li>
        <li key='3'>
          <p>
            Eliminar un nodo con dos hijos: Debido a la complejidad de eliminar un nodo con
            dos hijos, este caso se puede simplificar a alguno de los casos anteriores. Para esto, se busca el nodo
          <i>sucesor</i> del nodo a eliminar, es decir, el mínimo nodo en el árbol que sea mayor que
            éste. Para encontrar el sucesor, se debe buscar el nodo mas a la izquierda del hijo derecho.
          </p>
          <p>
            Una vez encontrado el nodo sucesor <i>s</i>, se intercambian los valores y éste
            es eliminado. Es fácil demostrar que s será una hoja (caso 1) o tendrá solo un hijo (caso 2)
          </p>
          <p>
            De manera análoga, este proceso puede ser realizado buscando el nodo <i>predecesor</i>
          </p>
        </li>
      </ol>
    </p>
  </div>
)

export default BST;