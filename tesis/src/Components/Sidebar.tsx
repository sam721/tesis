import React from 'react';
import Graph from './Graph';
import actions from '../Actions/actions'
const {
	NavLink,
	HashRouter
} = require('react-router-dom');

const {connect}  = require('react-redux');

type Props = {
	dispatch: (action: Object) => Object,
}
const Sidebar = (props:Props) => {
	return (
		<HashRouter>
			<ul>
				<li className="menu-item">
					Home
				</li>

				<li className="menu-item" onClick = {() => props.dispatch({type: actions.SELECT_BFS})}>
					<NavLink to="/BFS">BFS</NavLink>
				</li>

				<li className="menu-item" onClick = {() => props.dispatch({type: actions.SELECT_DFS})}>
					<NavLink to="/DFS">DFS</NavLink>
				</li>

				<li className="menu-item" onClick = {() => props.dispatch({type: actions.SELECT_DIJKSTRA})}>
					<NavLink to="/Dijkstra">Dijkstra</NavLink>
				</li>

				<li className="menu-item" onClick = {() => props.dispatch({type: actions.SELECT_DIJKSTRA})}>
					<NavLink to="/Prim">Prim</NavLink>
				</li>

				<li className="menu-item" onClick = {() => props.dispatch({type: actions.SELECT_DIJKSTRA})}>
					<NavLink to="/Kruskal">Kruskal</NavLink>
				</li>
			</ul>
		</HashRouter>
	);
}

export default connect()(Sidebar);