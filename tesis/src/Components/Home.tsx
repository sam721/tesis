import React, { FunctionComponent } from 'react';
import actions from '../Actions/actions';
import {Row, Col} from 'react-bootstrap';
import BFS from '../static/images/graph3.png';
import AVL from '../static/images/AVL.png';
import ArrayPic from '../static/images/array.png';
import routes from '../resources/names_and_routes/algorithm_routes';
const { connect } = require('react-redux');
const {
	NavLink,
	HashRouter
} = require('react-router-dom');

type Props = {
  dispatch: (action:Object) => void,
}

type ThumbProps = {
  imgSrc: string,
  title: string,
}
const AlgoThumb:FunctionComponent<ThumbProps> = ({imgSrc, title, children}) => {
  return (
    <div className='algoThumbnail'>
      {children}
      <div className='algoPicture' style={{height: '65%'}}>
        <img src={imgSrc} height={'100%'} width={'100%'}></img>
      </div>
      <div className='algoName'>
        {title}
      </div>
      
    </div>
  )
}

class Home extends React.Component<Props> {
  componentDidMount(){
    this.props.dispatch({
      type: actions.HOME,
    });
  }

  render(){
    return (
    <HashRouter>
      <div id='home'>
        <div className='home-title'>
          <Row>
            <Col>
                <h1>¡Bienvenido a CytoAyed!</h1>
                <h2>Aquí podrás visualizar y obtener información sobre diferentes algoritmos y estructuras de datos</h2>
            </Col>
          </Row>
        </div>
        <div className='home-content'>
          <Row>
            <Col md={4}>
              <AlgoThumb imgSrc={BFS} title='Algoritmos sobre grafos'>
                <div className='thumb-menu'>
                  <NavLink to={routes.BFS}><button>Busqueda en Anchura</button></NavLink>
                  <NavLink to={routes.DFS}><button>Busqueda en Profundidad</button></NavLink>
                  <NavLink to={routes.Dijkstra}><button>Camino minimo - Dijkstra</button></NavLink>
                  <NavLink to={routes.BellmanFord}><button>Camino minimo - Bellman-Ford</button></NavLink>
                  <NavLink to={routes.Kruskal}><button>Arbol Recubridor Minimo - Kruskal</button></NavLink>
                  <NavLink to={routes.Prim}><button>Arbol Recubridor Minimo - Prim</button></NavLink>
                </div>
              </AlgoThumb>
            </Col>
            
            <Col md={4}>
              <AlgoThumb imgSrc={AVL} title='Estructuras de datos'>
                <div className='thumb-menu'>
                  <NavLink to={routes.SingleLinkedList}><button>Listas Enlazadas</button></NavLink>
                  <NavLink to={routes.MinHeap}><button>Heap Mínimo</button></NavLink>
                  <NavLink to={routes.BST}><button>Árbol Binario de Búsqueda</button></NavLink>
                  <NavLink to={routes.AVL}><button>Árbol AVL</button></NavLink>
                </div>
              </AlgoThumb>
            </Col>
            
            <Col md={4}>
              <AlgoThumb imgSrc={ArrayPic} title='Algoritmos sobre arreglos'>
                <div className='thumb-menu'>
                  <NavLink to={routes.BinarySearch}><button>Ordenamiento Burbuja</button></NavLink>
                  <NavLink to={routes.MergeSort}><button>Ordenamiento por Mezcla</button></NavLink>
                  <NavLink to={routes.BinarySearch}><button>Busqueda Binaria</button></NavLink>
                </div>
              </AlgoThumb>
            </Col>
          </Row>
        </div>
      </div>
    </HashRouter>
    )
  }
}

export default connect()(Home);