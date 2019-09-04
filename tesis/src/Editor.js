import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Graph from './Components/Graph';
import Heap from './Components/Heap';
import AVL from './Components/AVL'
import properties from './algorithm-properties';
import BubbleSort from './Components/BubbleSort';
import MergeSort from './Components/MergeSort';
import BinarySearch from './Components/BinarySearch';

const { HashRouter, Route } = require('react-router-dom');
class Editor extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Row>
				<Col>
					<HashRouter>
						<Route path="/BFS" render={() => <Graph {...properties.BFS} />} />
						<Route path="/DFS" render={() => <Graph {...properties.DFS} />} />
						<Route path="/Dijkstra" render={() => <Graph {...properties.Dijkstra} />} />
						<Route path="/Prim" render={() => <Graph {...properties.Prim} />} />
						<Route path="/Kruskal" render={() => <Graph {...properties.Kruskal} />} />
						<Route path="/Heap" render={() => <Heap {...properties.Heap} />} />
						<Route path="/AVL" render={() => <AVL {...properties.AVL} />} />
						<Route path="/BubbleSort" render={() => <BubbleSort {...properties.BubbleSort} />} />
						<Route path="/MergeSort" render={() => <MergeSort {...properties.MergeSort} />} />
						<Route path="/binarysearch" render={() => <BinarySearch {...properties.BinarySearch}/>}/>
					</HashRouter>
				</Col>
			</Row>
		)
	}
}

export default Editor;