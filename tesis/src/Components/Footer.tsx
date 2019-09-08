import {Row, Col} from 'react-bootstrap';
import React from 'react';
import OptionsMenu from './OptionsMenu';
import SpeedBar from './SpeedBar';
import GIFControl from './GIFControl';
import PhotoControl from './PhotoControl';
import actions from '../Actions/actions';
const { connect } = require('react-redux');


const algoDict:({[name: string]: string})= {
  'BFS': 'BFS',
  'DFS': 'DFS',
  'Dijkstra': 'Dijkstra',
  'Prim': 'Prim',
  'Kruskal': 'Kruskal',
  'Heap': 'Min Heap',
  'AVL': 'Arbol AVL',
  'BubbleSort': 'Bubble Sort',
  'MergeSort': 'Merge Sort',
  'BinarySearch': 'Busqueda Binaria',
  'SingleLinkedList': 'Lista enlazada',
  'DoubleLinkedList': 'Lista doble',
  'Queue': 'Cola',
  'Stack': 'Pila',
}

type Props = {
  algorithm: string,
  run: () => void,
  options: Array<{name: string, run: () => void}>,
  dispatch: (action: Object) => void,
  undo: () => void,
  redo: () => void,
}

type State = {
  showActions: boolean,
}
const mapStateToProps = (state:Props) => {
  return {
    algorithm: state.algorithm,
    run: state.run,
    options: state.options,
    undo: state.undo,
    redo: state.redo,
  }
}

class Footer extends React.Component<Props, State>{
  state = {
    showActions: true,
  }
  render(){
    console.log(this.props.algorithm);
    return(
      <div className='footer'>
        {this.props.algorithm !== 'none' && 
          <Row>
            <Col md={2}>
              <div className="dropup">
                <button className='dropdown-button' onClick={() => this.setState({showActions: !this.state.showActions})}>{algoDict[this.props.algorithm]}</button>
                { 
                  this.state.showActions && 
                  <div className='actions-menu'>
                    <OptionsMenu op={this.props.options}/>
                  </div>
                }
              </div>
            </Col>
            <Col md={2}>
              <span>Velocidad</span>
              <SpeedBar/>
            </Col>
            <Col md={1}>
              <button className='dropdown-button' onClick={this.props.undo}>Deshacer</button>
            </Col>
            <Col md={1}>
              <button className='dropdown-button' onClick={this.props.redo}>Rehacer</button>
            </Col>
            <Col md={{span: 2, offset:4}}>
              <button className='dropdown-button' onClick={() => this.props.dispatch({type: actions.TOGGLE_PSEUDO})}>Pseudocodigo</button>
            </Col>
          </Row>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Footer);