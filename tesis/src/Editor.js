import React from 'react';
import Graph from './Components/Graph';
import Heap from './Components/Heap';
import Home from './Components/Home';
import BST from './Components/BST'
import properties from './algorithm-properties';
import LinkedList from './Components/LinkedList';

import routes from './resources/names_and_routes/algorithm_routes';
import names from './resources/names_and_routes/algorithm_names';
import ArrayComponent from './Components/ArrayComponent';

const { HashRouter, Route, Switch } = require('react-router-dom');
class Editor extends React.Component {
	render() {
		return (
			<HashRouter>
				<Switch>
					<Route key={names.BFS} path={routes.BFS} render={() => <Graph {...properties.BFS} />} />
					<Route key={names.DFS} path={routes.DFS} render={() => <Graph {...properties.DFS} />} />
					<Route key={names.Dijkstra} path={routes.Dijkstra} render={() => <Graph {...properties.Dijkstra} />} />
					<Route key={names.BellmanFord} path={routes.BellmanFord} render={() => <Graph {...properties.BellmanFord} />} />
					<Route key={names.Prim} path={routes.Prim} render={() => <Graph {...properties.Prim} />} />
					<Route key={names.Kruskal} path={routes.Kruskal} render={() => <Graph {...properties.Kruskal} />} />
					<Route key={names.Heap} path={routes.MinHeap} render={() => <Heap {...properties.Heap} />} />
					<Route key={names.BST} path={routes.BST} render={() => <BST {...properties.BST} />} />
					<Route key={names.AVL} path={routes.AVL} render={() => <BST {...properties.AVL} />} />
					<Route key={names.BubbleSort} path={routes.BubbleSort} render={() => <ArrayComponent {...properties.BubbleSort} />} />
					<Route key={names.MergeSort} path={routes.MergeSort} render={() => <ArrayComponent {...properties.MergeSort} />} />
					<Route key={names.BinarySearch} path={routes.BinarySearch} render={() => <ArrayComponent {...properties.BinarySearch} />} />
					<Route key={names.SingleLinkedList} path={routes.SingleLinkedList} render={() => <LinkedList {...properties.SingleLinkedList} />} />
					<Route key={names.DoubleLinkedList} path={routes.DoubleLinkedList} render={() => <LinkedList {...properties.DoubleLinkedList} />} />
					<Route key={names.Queue} path={routes.Queue} render={() => <LinkedList {...properties.Queue} />} />
					<Route key={names.Stack} path={routes.Stack} render={() => <LinkedList {...properties.Stack} />} />
					<Route render={() => <Home />} />
				</Switch>
			</HashRouter>
		)
	}
}

export default Editor;