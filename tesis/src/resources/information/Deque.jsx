import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
const complexity = (
  <div className='complexity'>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th />
          <th>Mejor caso</th>
          <th>Peor caso</th>
          <th>Caso promedio</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            Insertar frente o final
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
        <tr>
          <td>
            Eliminar frente o final
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
        <tr>
          <td>
            Buscar
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
        </tr>
        <tr>
          <td>
            Insertar o eliminar (aleatorio)
          </td>
          <td>
            <Latex>$O(1)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
          <td>
            <Latex>$O(n)$</Latex>
          </td>
        </tr>
      </tbody>
    </Table>
  </div>
)

const Deque = (
  <div>
    <h1>Listas Doblemente Enlazadas</h1>
    <div>
      {complexity}
      <p>
        Las listas doblemente enlazadas (del inglés <i>Double-Ended Queue</i>, o también <i>deque</i>) son un tipo de lista enlazada, 
        en la cual cada elemento posee dos apuntadores, uno hacia el elemento anterior y otro
        al siguiente. Esta propiedad provee diversas ventajas sobre las listas simples, al costo 
        del doble de memoria debido a los apuntadores hacia los anteriores.
      </p>
    </div>
    <p>
      Manteniendo dos apuntadores al primer y último elemento, provee inserciones 
      y extracciones de ambos extremos en tiempo constante. 
    </p>
    <p>
      Si se desea eliminar un elemento, al tener una referencia al elemento anterior, la eliminación 
      pasa a tener un tiempo constante. Sin embargo, la búsqueda y acceso sigue teniendo un caso promedio 
      de complejidad lineal.
    </p>
    <p>
      Existen diversas implementaciones de listas doblemente enlazadas que permiten acceso aleatorio a elementos 
      en tiempo constante, manteniendo apuntadores hacia diversos bloques de elementos pertenecientes a la lista.
    </p>
  </div>
)

export default Deque;