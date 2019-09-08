import {Row, Col} from 'react-bootstrap';
import React from 'react';
import PhotoControl from './PhotoControl';
import GIFControl from './GIFControl';
const {connect} = require('react-redux');
const {
	NavLink,
	HashRouter
} = require('react-router-dom');

type Props = {
  photo: () => void,
  gif: () => void,
}

const mapStateToProps = (state:Props) => {
  return { ...state };
}

class MenuBar extends React.Component<Props>{
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
      <NavLink to={"/binarysearch"}><button className='dropdown-button'>Busqueda Binaria</button></NavLink>
    ];
    const dataStructures = [
      <NavLink to={"/SingleLinkedList"}><button className='dropdown-button'>Lista enlazada</button></NavLink>,
      <NavLink to={"/Queue"}><button className='dropdown-button'>Cola</button></NavLink>,
      <NavLink to={"/Stack"}><button className='dropdown-button'>Pila</button></NavLink>,
      <NavLink to={"/DoublelinkedList"}><button className='dropdown-button'>Lista doble</button></NavLink>,
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
          <Col md={1}>
            <PhotoControl callback={this.props.photo}/>
          </Col>
          <Col md={1}>
            <GIFControl callback={this.props.gif}/>
          </Col>
        </Row>
      </div>
    )
  }
};
export default connect(mapStateToProps)(MenuBar);