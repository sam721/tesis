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
	algorithm: string,
}

type State = {
	algorithm: string,
}
const mapStateToProps = (state:State) => {
	return {
		algorithm: state.algorithm,
	}
}
const Sidebar = (props:Props) => {
	const items = [
		{name: 'BFS'},
		{name: 'DFS'},
		{name: 'Dijkstra'},
		{name: 'Prim'},
		{name: 'Kruskal'}
	];

	const list = [];

	for(let i = 0; i < items.length; i++){
		list.push(
			<NavLink to={"/"+items[i].name}>
				<li 
					className={items[i].name === props.algorithm ? "active" : "normal"}
				>
					{items[i].name}
				</li>
			</NavLink>
		)
	}
	return (
		<HashRouter>
			<ul>
				{list}
			</ul>
		</HashRouter>
	);
}

export default connect(mapStateToProps)(Sidebar);