import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Graph from './Components/Graph';
import BFS from './Algorithms/BFS';
import DFS from './Algorithms/DFS';
import Dijkstra from './Algorithms/Dijkstra'
import Kruskal from './Algorithms/Kruskal';
import Prim from './Algorithms/Prim';

import properties from './algorithm-properties';
const {HashRouter, Route} = require('react-router-dom');
class Editor extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container fluid = {true}>
				<Row>
					<Col>
					<div>
						<HashRouter>
							<Route path="/BFS" render={() => <Graph {...properties.BFS}/>}/>
							<Route path="/DFS" render={() => <Graph {...properties.DFS}/>}/>
							<Route path="/Dijkstra" render={() => <Graph {...properties.Dijkstra}/>}/>
							<Route path="/Prim" render={() => <Graph {...properties.Prim}/>}/>
							<Route path="/Kruskal" render={() => <Graph {...properties.Kruskal}/>}/>
						</HashRouter>
					</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Editor;