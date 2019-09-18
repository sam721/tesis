import React from 'react';
import { Table } from 'react-bootstrap';
import Latex from 'react-latex';
import { Tex } from 'react-tex';
const bfTex = 'factor(nodo)=altura(der)-altura(izq) \\in \\{-1,0,1\\}';
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
            <Latex>$O(\log n)$</Latex>
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

const AVL = (
  <div>
    <h1>Árbol AVL</h1>
    <div>
      {complexity}
      <p>
        El árbol AVL (por sus publicadores, Adelson-Velskii y Landis) es un árbol binario de búsqueda
        balanceado, lo que le permite mantener una altura logarítmica con respecto a la cantidad 
        de elementos almacenados, lo que significa que poseen un peor caso de complejidad
        logarítmica en sus operaciones de inserción, eliminación y búsqueda.
      </p>
    </div>
    <p>
      El árbol AVL se mantiene balanceado <i>por altura</i>. Para cada nodo, 
      la diferencia absoluta de altura entre ambos sub-árboles hijos es a lo sumo 1.
    </p>
    <p>
      Se conoce como <i>factor de balance</i> a la diferencia existente entre altura de hijo derecho
      e izquierdo. Para que un árbol binario de búsqueda sea AVL, se debe cumplir que:
    </p>
    <Tex texContent={bfTex}/>
    <h2>Operaciones</h2>
    <p>
      Los árboles AVL permite las mismas operaciones que las de un árbol binario de búsqueda simple.
      Sin embargo, como las modificaciones potencialmente desbalancearán el árbol, los nodos 
      involucrados en la operación (incluidos desde la raíz hasta el nodo en cuestión) deben ser balanceados
      por medio de <i>rotaciones</i>
    </p>
    <h3>Balancear</h3>
    <p>Un nodo se encuentra desbalanceado si su factor de balance es <i>-2</i> o <i>2</i>.</p>
    <p>Para rebalancear se realizan rotaciones, los cuales no son mas que modificaciones 
      en las que se mantiene el orden de los elementos
    </p>
    <p>Existen dos casos a considerar cuando se balancea un árbol A, los cuales se dividen en dos casos:</p>
    <ul>
      <li key='1'>
        <p><b>Caso 1</b>: El sub-árbol derecho es el mas alto (el factor del árbol es 2) </p>
        <p>Siendo D el sub-árbol derecho, se consideran dos casos:</p>
        <ul>
          <li key='1.1'>
            <p><b>Caso 1.1</b>: El sub-árbol derecho de D es mas alto (el factor de D es 1 o 0)</p>
            <p>En este caso se realiza una rotación izquierda en A</p>
          </li>
          <li key='1.2'>
            <p><b>Caso 1.2</b>: El sub-árbol izquierdo de D es mas alto (el factor de D es -1)</p>
            <p>En este caso se realizará una <i>doble rotación</i>, primero se rotará D hacia la derecha y luego
            se rotará A hacia la izquierda</p>
          </li>
        </ul>
      </li>
      <li key='2'>
        <p><b>Caso 2</b>: El sub-árbol izquierdo de A es el mas alto (el factor de A es 2) </p>
        <p>Siendo I el sub-árbol izquierdo, se consideran dos casos:</p>
        <ul>
          <li key='2.1'>
            <p><b>Caso 2.1</b>: El sub-árbol izquierdo de I es mas alto (el factor de I es -1 o 0)</p>
            <p>En este caso se realiza una rotación derecha en A</p>
          </li>
          <li key='2.2'>
            <p><b>Caso 2.2</b>: El sub-árbol derecho de I es mas alto (el factor de I es 1)</p>
            <p>En este caso se realizará una <i>doble rotación</i>, primero se rotará I hacia la izquierda y luego
            se rotará A hacia la derecha</p>
          </li>
        </ul>
      </li>
    </ul>

  </div>
)

export default AVL;