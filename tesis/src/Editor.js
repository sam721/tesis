import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Graph from './Components/Graph';
import Heap from './Components/Heap';
import AVL from './Components/AVL'
import properties from './algorithm-properties';
import BubbleSort from './Components/BubbleSort';
import MergeSort from './Components/MergeSort';
import BinarySearch from './Components/BinarySearch';
import LinkedList from './Components/LinkedList';

import routes from './resources/names_and_routes/algorithm_routes';
const { HashRouter, Route, Switch} = require('react-router-dom');
class Editor extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<HashRouter>
				<Row>
					<Col>
							<Route path={routes.BFS} render={() => <Graph {...properties.BFS} />} />
							<Route path={routes.DFS} render={() => <Graph {...properties.DFS} />} />
							<Route path={routes.Dijkstra} render={() => <Graph {...properties.Dijkstra} />} />
							<Route path={routes.BellmanFord} render={() => <Graph {...properties.BellmanFord} />} />
							<Route path={routes.Prim} render={() => <Graph {...properties.Prim} />} />
							<Route path={routes.Kruskal} render={() => <Graph {...properties.Kruskal} />} />
							<Route path={routes.MinHeap} render={() => <Heap {...properties.Heap} />} />
							<Route path={routes.AVL} render={() => <AVL {...properties.AVL} />} />
							<Route path={routes.BubbleSort} render={() => <BubbleSort {...properties.BubbleSort} />} />
							<Route path={routes.MergeSort} render={() => <MergeSort {...properties.MergeSort} />} />
							<Route path={routes.BinarySearch} render={() => <BinarySearch {...properties.BinarySearch}/>}/>
							<Route path={routes.SingleLinkedList} render={() => <LinkedList {...properties.SingleLinkedList}/>}/>
							<Route path={routes.DoubleLinkedList} render={() => <LinkedList {...properties.DoubleLinkedList}/>}/>
							<Route path={routes.Queue} render={() => <LinkedList {...properties.Queue}/>}/>
							<Route path={routes.Stack} render={() => <LinkedList {...properties.Stack}/>}/>
					</Col>
				</Row>
			</HashRouter>
		)
	}
}

export default Editor;