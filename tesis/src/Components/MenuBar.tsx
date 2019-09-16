import {Row, Col} from 'react-bootstrap';
import React from 'react';
import PhotoControl from './PhotoControl';
import GIFControl from './GIFControl';
import routes from '../resources/names_and_routes/algorithm_routes';
import actions from '../Actions/actions';
const {connect} = require('react-redux');
const {
	NavLink,
	HashRouter
} = require('react-router-dom');

type Props = {
  photo: () => void,
  gif: () => void,
  algorithm: string,
  dispatch: (action:Object) => void,
}

const mapStateToProps = (state:Props) => {
  return { ...state };
}

class MenuBar extends React.Component<Props>{
  render(){
    const searchAlgorithms = [
      <NavLink to={routes.BFS}><button className='dropdown-button'>BFS</button></NavLink>,
      <NavLink to={routes.DFS}><button className='dropdown-button'>DFS</button></NavLink>,
      <NavLink to={routes.Dijkstra}><button className='dropdown-button'>Dijkstra</button></NavLink>,
      <NavLink to={routes.BellmanFord}><button className='dropdown-button'>Bellman-Ford</button></NavLink>
    ];
    const mstAlgorithms = [
      <NavLink to={routes.Kruskal}><button className='dropdown-button'>Kruskal</button></NavLink>,
      <NavLink to={routes.Prim}><button className='dropdown-button'>Prim</button></NavLink>,
    ];
    const arrays = [
      <NavLink to={routes.BubbleSort}><button className='dropdown-button'>Bubble Sort</button></NavLink>,
      <NavLink to={routes.MergeSort}><button className='dropdown-button'>Merge Sort</button></NavLink>,
      <NavLink to={routes.BinarySearch}><button className='dropdown-button'>Busqueda Binaria</button></NavLink>
    ];
    const dataStructures = [
      <NavLink to={routes.SingleLinkedList}><button className='dropdown-button'>Lista enlazada</button></NavLink>,
      <NavLink to={routes.Queue}><button className='dropdown-button'>Cola</button></NavLink>,
      <NavLink to={routes.Stack}><button className='dropdown-button'>Pila</button></NavLink>,
      <NavLink to={routes.DoubleLinkedList}><button className='dropdown-button'>Lista doble</button></NavLink>,
      <NavLink to={routes.MinHeap}><button className='dropdown-button'>Min Heap</button></NavLink>,
      <NavLink to={routes.AVL}><button className='dropdown-button'>Arbol AVL</button></NavLink>,
    ];
    return (
      true && <div className='top-bar'>
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
          <Col md={1} style={{visibility: this.props.algorithm !== 'none' ? 'visible' : 'hidden'}}>
            <PhotoControl callback={this.props.photo}/>
          </Col>
          <Col md={1} style={{visibility: this.props.algorithm !== 'none' ? 'visible' : 'hidden'}}>
            <GIFControl callback={this.props.gif}/>
          </Col>
          <Col md={{span: 2, offset: 6}}>
            <div className='dropdown'>
              <button className='dropdown-button'>Ayuda</button>
              <div className='dropdown-menu'>
                <button className='dropdown-button' onClick={() => this.props.dispatch({type: actions.TOGGLE_TUTORIAL_MODAL})}>
                  Dibujo de grafos
                </button>
                <button className='dropdown-button'>
                  Acerca de
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    )
  }
};
export default connect(mapStateToProps)(MenuBar);