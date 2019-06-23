import React from 'react';
import actions from '../Actions/actions';
import {CytoscapeElement, CytoEvent} from '../Types/types';

import ControlBar from './ControlBar';

const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const {connect} = require('react-redux');


const autopanOnDrag = require('cytoscape-autopan-on-drag');
autopanOnDrag(cytoscape);

type Props = {
	dispatch: (action: Object) => Object,

	weighted: Boolean,
	directed: Boolean,

	algorithm: string,
	execute: (cy: Object, id: Object) => Array<{node: string, paint: string}>,

	animation: Boolean,
	selection: {
		type: string,
		id: string,
	}
}

type State = {
	selection: Object,
	algorithm: string,
	animation: Boolean,
}

const getNodeIdString = (nodeId: string) => {
	return 'node-' + nodeId;
}

const mapStateToProps = (state : State) => {
	return {
		selection: state.selection,
		algorithm: state.algorithm,
		animation: state.animation,
	}
}

class Graph extends React.Component<Props>{

	layout = {
		run: () => {},
		stop: () => {},
	};
	cy = cytoscape();
	
	componentDidMount() {

		let edgeStyle = Styles.EDGE;
		if(this.props.weighted){
			edgeStyle = {...edgeStyle, ...Styles.EDGE_WEIGHTED};
		}
		if(this.props.directed){
			edgeStyle = {...edgeStyle, ...Styles.EDGE_DIRECTED};
		}
		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements: [
			],

			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: Styles.NODE,
				},

				{
					selector: 'edge',
					style: edgeStyle,
				}
			],

			layout: {
				name: 'preset',
			},
			headless: false,
			styleEnabled: true,
			hideEdgesOnViewport: false,
			hideLabelsOnViewport: false,
			userPanningEnabled: false,
			zoomingEnabled: false,
			textureOnViewport: false,
			motionBlur: false,
			motionBlurOpacity: 0.2,
			wheelSensitivity: 1,
			pixelRatio: '1.0'
		});
		
		this.cy.on('click', (event: CytoEvent) => this.handleClickViewport(event));
		this.cy.on('click', 'node', (event : CytoEvent) => this.handleClickOnNode(event.target));
		this.cy.on('click', 'edge', (event : CytoEvent) => this.handleClickOnEdge(event.target));
		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
		});
		this.layout.run();
	}

	refreshLayout() {
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({ name: 'preset' });
		this.layout.run();
	}

	removeNode = (node : string) => {
		this.cy.remove('node[id="' + node + '"]');
	}

	removeEdge = (edge : string) => {
		this.cy.remove('edge[id="' + edge + '"]');
	}

	executeAnimation = (commands : Array<{node: string, paint: string}>)=> {

		let animation = () => {
			let pos = 0;
			let step = () => {
				if (pos === commands.length) {
					this.cy.nodes().style({
						'background-color': 'white',
						'color': 'black',
					});
					this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					this.cy.autolock(false);
					return;
				}
				let { node, paint } = commands[pos++];
				this.cy.getElementById(node).style({
					'background-color': paint,
					'color': (paint === 'gray' ? 'black' : 'white'),
				});
				this.refreshLayout();
				setTimeout(step, 1000);
			}
			step();
		}
		animation();
	}

	runButton = () => {
		let {selection} = this.props;
		if(!selection || selection.type !== 'node'){
			console.error('No node selected');
			return;
		}

		this.props.dispatch({
			type: actions.ANIMATION_START,
		});
		this.cy.autolock(true);
		let commands = this.props.execute(this.cy, selection.id);

		this.executeAnimation(commands);

	}
	
	handleClickOnNode = (node : CytoscapeElement) => {
		if(this.props.animation === true) return;
		let nodeId = node.id();
		let { selection } = this.props;

		if (!selection || selection.type !== 'node') {
			node.style(Styles.NODE_SELECTED);

			if (selection && selection.type === 'edge') {
				let edge = this.cy.getElementById(selection.id);
				edge.style(Styles.EDGE);
			}

			this.props.dispatch({
				type: actions.SELECTION,
				payload: {
					selection: {
						id: nodeId, type: 'node'
					}
				}
			})


			return;
		}
		if (selection.type === 'node') {
			let prevNode = selection.id;
			if (prevNode === nodeId) {
				node.style(Styles.NODE);
				this.props.dispatch({
					type: actions.NO_SELECTION,
				})
			} else {
				let previous = this.cy.getElementById(prevNode);
				if (prevNode) {
					if (
						(this.props.directed && !previous.outgoers().contains(node)) ||
						(!this.props.directed && !previous.neighborhood().contains(node))) {
						this.createEdge(prevNode, nodeId);
					}
					this.props.dispatch({
						type: actions.NO_SELECTION,
						payload: {
							selection: null,
						}
					})
				}
				previous.style(Styles.NODE);
			}
		}
	}

	handleClickOnEdge = (edge : CytoscapeElement) => {
		if(this.props.animation === true) return;
		let edgeId = edge.id();

		let { selection } = this.props;

		let prevId = null;
		if (selection) {
			prevId = selection.id;
			let previous = this.cy.getElementById(prevId);
			if (selection.type === 'edge') {
				previous.style(Styles.EDGE);
			} else if (selection.type === 'node') {
				previous.style(Styles.NODE);
			}
		}

		if (prevId === edgeId) {
			this.props.dispatch({
				type: actions.NO_SELECTION,
				payload: {
					selection: null,
				}
			})
			let previous = this.cy.getElementById(prevId);
			previous.style(Styles.EDGE);
		} else {
			this.props.dispatch({
				type: actions.SELECTION,
				payload: {
					selection: {
						type: 'edge',
						id: edgeId,
					}
				}
			})
			edge.style(Styles.EDGE_SELECTED);
		}
	}

	createNode(x : string, y : string) {
		let id = 1;
		while (this.cy.getElementById(getNodeIdString(id.toString())).length > 0) {
			id++;
		}
		this.cy.add({
			group: 'nodes',
			data: { id: getNodeIdString(id.toString()), value: id },
			position: { x, y }
		});
	}

	createEdge(x : string, y : string) {
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				weight: Math.floor(Math.random()*100),
				source: x,
				target: y,
			}
		});
	}

	handleClickViewport = (event : CytoEvent) => {
		if(this.props.animation === true) return;

		let { selection } = this.props;
		if (event.target === this.cy) {
			if (selection) {
				let previous = this.cy.getElementById(selection.id);
				if (selection.type === 'node') {
					previous.style('background-color', 'white');
				} else if (selection.type === 'edge') {
					previous.style({
						'line-color': '#ccc',
						'target-arrow-color': '#ccc',
					});
				}
				this.props.dispatch({ type: actions.NO_SELECTION });
			} else {
				let { x, y } = event.position;
				this.createNode(x, y);
				this.refreshLayout();
			}
		}
	}

	render() {
		return (
			<div> 
				<div
					id="canvas"
					style={{
						width: '70%',
						height: '4in',
						borderStyle: 'solid',
						borderColor: 'black',
						margin: 'auto'
					}}
				/>
				<ControlBar onClick = {this.runButton}/>
			</div>
		)
	}
};

export default connect(mapStateToProps)(Graph);