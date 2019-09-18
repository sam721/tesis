import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
import { Tex } from 'react-tex';
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
            <Latex>$O(\log n)$</Latex>
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
        </tr>
      </tbody>
      <tr>
        <td>
          Extraer Mínimo
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
      <tr>
        <td>
          Consultar Mínimo
          </td>
        <td>
          <Latex>$O(1)$</Latex>
        </td>
        <td>
          <Latex>$O(1)$</Latex>
        </td>
        <td>
          <Latex>$O(1)$</Latex>
        </td>
      </tr>
    </Table>
  </div>
)
const Heap = (
  <div>
    <h1>Heap</h1>
    <div>
      {complexity}
      <p>
        Un Heap (o montículo) es una estructura de datos, un árbol binario <i>casi completo</i>.
        Usualmente, suelen identificarse dos tipos de Heaps:

        <h4>Min Heap</h4>
        <p>
          Se dice que un Heap es Min Heap si se cumple que el nodo raíz es menor o
          igual a todos sus descendientes, y a su vez, éstos cumplen con esta propiedad
        </p>
        <h4>Max Heap</h4>
        <p>
          Se dice que un Heap es Max Heap si se cumple que el nodo raíz es mayor o
            igual a todos sus descendientes, y a su vez, éstos cumplen con esta propiedad
        </p>

        Para simplificar, asumiremos que el Heap será un Min Heap.
      </p>
    </div>
    <h2>Implementación</h2>
    <p>
      Los Heaps, como muchas otras estructuras tipo árbol, pueden ser implementados
      utilizando apuntadores. Sin embargo, debido a su <i>casi completitud</i>, los nodos
      pueden ser intuitivamente indexados, lo que hace posible su implementación
      por medio de simples arreglos.
    </p>
    <p>
      <Latex>
        Para un Heap con N nodos, se indexan los nodos por nivel, de izquierda a derecha.
        Esto hace que, para un nodo indexado i, sus hijos izquierdo y derechos sean los
        nodos $2i$ y $2i+1$. Por otro lado, el padre de un nodo $i$ será el nodo
      </Latex>
      <Tex texContent={"\\lfloor{\\frac{i}{2}}\\rfloor"} />.
    </p>
    <h3>
      Operaciones
    </h3>
    <h4>Inserción</h4>
    <p>
      Para insertar un nuevo nodo al Heap, se agrega un nodo en el último nivel del árbol.
      Como esto puede eliminar la propiedad de Heap, se debe subir, o <i>flotar</i> el nodo
      hasta que se vuelva a cumplir.
    </p>
    <p>
      Mientras el nuevo nodo sea menor a su padre, se intercambiarán dichos nodos.
      Dado que la altura de un Heap es logarítmica, la complejidad en tiempo de la inserción
      será de <Latex>$O(\log n)$</Latex>
    </p>
    <h4>Extracción de Mínimo</h4>
    <p>
      Eliminar la raíz del Heap sería una operación complicada, pero gracias a que el Heap
      siempre debe ser <i>casi completo</i>, se puede intercambiar  el valor de la raíz
      con el nodo mas profundo y a la derecha del árbol, y eliminar a este en su lugar.
      </p>
    <p>
      Al igual que la inserción, esta operación puede eliminar la propiedad de Heap del árbol.
      En este caso, se aplica un proceso similar a <i>flotar</i>. Se baja o <i>hunde</i> el nodo
      hasta que se cumpla la propiedad. Si el nodo es mayor que su mínimo hijo directo,
      se intercambian dichos nodos y se continúa hundiendo.
      </p>
    <p>
      El Heap, al tener altura logarítmica, también tendra complejidad <Latex>$O(\log n)$</Latex> para
      extraer el mínimo
      </p>
    <h4>Consultar Mínimo</h4>
    <p>
      Al estar el mínimo elemento contenido en la raíz del Heap, para consultarlo bastará
      simplemente con obtener el valor de la raíz. Esto tiene una complejidad constante.
    </p>
  </div>
)

export default Heap;