import {Row, Col} from 'react-bootstrap';
import React from 'react';
const {
	NavLink,
	HashRouter
} = require('react-router-dom');
class MenuBar extends React.Component{
  render(){
    const searchAlgorithms = [
      <NavLink to={"/BFS"}><button className='dropdown-button'>BFS</button></NavLink>,
      <NavLink to={"/DFS"}><button className='dropdown-button'>DFS</button></NavLink>,
      <NavLink to={"/Dijkstra"}><button className='dropdown-button'>Dijkstra</button></NavLink>,
    ];
    const mstAlgorithms = [
      <NavLink to={"/Kruskal"}><button className='dropdown-button'>Kruskal</button></NavLink>,
      <NavLink to={"/Prim"}><button className='dropdown-button'>Prim</button></NavLink>,
    ];
    const arrays = [
      <NavLink to={"/bubblesort"}><button className='dropdown-button'>Bubble Sort</button></NavLink>,
      <NavLink to={"/mergesort"}><button className='dropdown-button'>Merge Sort</button></NavLink>,
    ];
    const dataStructures = [
      <NavLink to={"/heap"}><button className='dropdown-button'>Min Heap</button></NavLink>,
      <NavLink to={"/AVL"}><button className='dropdown-button'>Arbol AVL</button></NavLink>,
    ];
    return (
      <div className='top-bar'>
        <Row>
          <Col md={2}>
            <div className='dropdown'>
              <button className='dropdown-button'>Algoritmos</button>
              <HashRouter>
                <div className='dropdown-menu'>
                  <div className='dropright'>
                    <button className='dropdown-button'>Algoritmos de Busqueda</button>
                    <div className='right-menu'>
                      {searchAlgorithms}
                    </div>  
                  </div>
                  <div className='dropright'>
                  <button className='dropdown-button'>Arbol Recubridor Minimo</button>
                    <div className='right-menu'>
                      {mstAlgorithms}
                    </div>
                  </div>
                  <div className='dropright'>
                  <button className='dropdown-button'>Arreglos</button>
                    <div className='right-menu'>
                      {arrays}
                    </div>
                  </div>
                  <div className='dropright'>
                  <button className='dropdown-button'>Estructuras de Datos</button>
                    <div className='right-menu'>
                      {dataStructures}
                    </div>
                  </div>
                </div>
              </HashRouter>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};
export default MenuBar;