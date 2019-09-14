import {Row, Col} from 'react-bootstrap';
import React from 'react';
import OptionsMenu from './OptionsMenu';
import SpeedBar from './SpeedBar';
import GIFControl from './GIFControl';
import PhotoControl from './PhotoControl';
import actions from '../Actions/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faUndo, faRedo, faBackward, faForward} from '@fortawesome/free-solid-svg-icons'
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
  animation: boolean,
  run: () => void,
  options: Array<{name: string, run: () => void}>,
  dispatch: (action: Object) => void,
  undo: () => void,
  redo: () => void,
  rewind: () => void,
  forward: () => void,
  pause: () => void,
  repeat: () => void,
  paused: boolean,
}

type State = {
  showActions: boolean,
}
const mapStateToProps = (state:Props) => {
  return {...state}
}

class Footer extends React.Component<Props, State>{
  state = {
    showActions: true,
  }
  render(){
    console.log(this.props.algorithm);
    const {animation, paused} = this.props;
    let control;
    if(!animation){ 
      control = 
        <>
          <Col md={1}>
            <button title="Deshacer" className='dropdown-button' onClick={this.props.undo}>
              <FontAwesomeIcon icon={faUndo} size = "lg"/>
            </button>
          </Col>
          <Col md={1}>
            <button title="Rehacer" className='dropdown-button' onClick={this.props.redo}>
              <FontAwesomeIcon icon={faRedo} size = "lg"/>
            </button>
          </Col>
          <Col md={{span: 2, offset:4}}>
            <button className='dropdown-button' onClick={() => this.props.dispatch({type: actions.TOGGLE_PSEUDO})}>Pseudocodigo</button>
          </Col>
        </>
    }else{
      control = 
        <>
          <Col md={1}>
            <button title={paused ? 'Continuar' : 'Pausa'} className='dropdown-button' onClick={this.props.pause}>
              <FontAwesomeIcon icon={paused ? faPlay : faPause} size = "lg"/>
            </button>
          </Col>
          <Col md={1} >
            <button title='Repetir' className='dropdown-button'  onClick={this.props.repeat}>
              <FontAwesomeIcon icon={faRedo} size = "lg"/>
            </button>
          </Col>
          <Col md={1}>
            <button title="Retroceder" className='dropdown-button'  onClick={this.props.rewind}>
              <FontAwesomeIcon icon={faBackward} size = "lg"/>
            </button>
          </Col>
          <Col md={1}>
            <button title="Avanzar" className='dropdown-button'  onClick={this.props.forward}>
              <FontAwesomeIcon icon={faForward} size = "lg"/>
            </button>
          </Col>
          <Col md={{span: 2, offset:2}}>
            <button className='dropdown-button' onClick={() => this.props.dispatch({type: actions.TOGGLE_PSEUDO})}>Pseudocodigo</button>
          </Col>
        </>
    }
    
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
           {control}
          </Row>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Footer);