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
            Insertar
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
            Eliminar
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
      </tbody>
    </Table>
  </div>
)

const LinkedList = (
  <div>
    <h1>Lista Enlazada</h1>
    <div>
      {complexity}
      <p>
        Las listas enlazadas son estructuras de datos en las cuales se almacenan
        elementos de manera secuencial. La principal ventaja de las listas enlazadas sobre
        los arreglos es que sus elementos no son almacenados en memoria de manera contigua,
        teniendo cada uno un <i>apuntador</i> al siguiente elemento.
      </p>
    </div>
    <p>
      A diferencia de los arreglos, si una lista enlazada es modificada, no es necesario
      reorganizar en memoria la estructura completa, bastando cambiar los apuntadores necesarios.
    </p>
    <p>
      Sin embargo, las listas enlazadas poseen una principal desventaja con respecto al acceso,
      eliminación e inserción de elementos en posiciones aleatorias, la cual es que, en la mayoría
      de los casos, será necesario recorrer gran parte de la lista, hasta llegar a la posición deseada.
    </p>
    <h2>Uso y variaciones de las listas enlazadas</h2>
    <p>
      En realidad, las listas enlazadas son un <i>tipo</i> de estructura de datos, teniendo múltiples
      variaciones con diferentes propósitos. Las listas enlazadas que solo mantienen referencia al
      siguiente elemento son denominadas <i>listas simplemente enlazadas</i>
    </p>
    <p>
      Por medio de listas enlazadas, pueden implementarse estructuras mas avanzadas, como lo son
      las <b>pilas</b>  y las <b>colas</b>. Además, si se modifica la estructura de cada elemento,
      permitiendo tener un apuntador extra hacia el elemento anterior, se pueden implementar
      inserciones y extracciones tanto de inicio y final en tiempo constante. Dichas listas son
      llamadas <i>doblemente enlazadas</i>
    </p>
  </div>
)

export default LinkedList;