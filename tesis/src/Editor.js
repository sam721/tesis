import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Graph from './Components/Graph';
import BFS from './Algorithms/BFS';
import DFS from './Algorithms/DFS';
import Dijkstra from './Algorithms/Dijkstra'
const {HashRouter, Route} = require('react-router-dom');
class Editor extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<Container fluid = {true}>
				<h1>Edicion de grafos</h1>
				<br />
				<Row>
					<Col>
					<div>
						<HashRouter>
							<Route path="/BFS" render={() => <Graph execute={BFS} directed={true}/>}/>
							<Route path="/DFS" render={() => <Graph execute={DFS} directed={true}/>}/>
							<Route path="/Dijkstra" render={() => <Graph execute={Dijkstra} weighted = {true} directed = {true}/>}/>
							<Route path="/Prim" render={() => <Graph execute={BFS} weighted = {true}/>}/>
							<Route path="/Kruskal" render={() => <Graph execute={BFS} weighted = {true}/>}/>
						</HashRouter>
					</div>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default Editor;