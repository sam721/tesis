import {Row, Col} from 'react-bootstrap';
import React from 'react';
import OptionsMenu from './OptionsMenu';
import SpeedBar from './SpeedBar';
import GIFControl from './GIFControl';
import PhotoControl from './PhotoControl';
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
}

type Props = {
  algorithm: string,
  run: () => void,
  options: Array<{name: string, run: () => void}>
  photo: () => {},
  gif: () => {},
}

type State = {
  showActions: boolean,
}
const mapStateToProps = (state:Props) => {
  return {
    algorithm: state.algorithm,
    run: state.run,
    options: state.options,
    photo: state.photo,
    gif: state.gif,
  }
}

class Footer extends React.Component<Props, State>{
  state = {
    showActions: true,
  }
  render(){
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
            <Col md={{span:1, offset:6}}>
              <PhotoControl callback={this.props.photo}/>
              </Col>
            <Col md={1}>
              <GIFControl callback={this.props.gif}/>
            </Col>
          </Row>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps)(Footer);