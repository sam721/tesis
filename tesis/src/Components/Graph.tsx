import React from 'react';
import actions from '../Actions/actions';
import {CytoscapeElement, CytoEvent, AnimationStep} from '../Types/types';

import ControlBar from './ControlBar';
import {Row, Col, Container} from 'react-bootstrap';

const Styles = require('../Styles/Styles');
const popper = require('cytoscape-popper');
const cytoscape = require('cytoscape');
const {connect} = require('react-redux');


const autopanOnDrag = require('cytoscape-autopan-on-drag');
autopanOnDrag(cytoscape);

cytoscape.use(popper);

type Props = {
	dispatch: (action: Object) => Object,

	weighted: Boolean,
	directed: Boolean,

	action: string,
	algorithm: string,
	execute: (param: Object) => Array<AnimationStep>,

	animation: Boolean,
	selection: {
		type: string,
		id: string,
		weight: string,
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

	nodeStyle = Styles.NODE;
	edgeStyle = Styles.EDGE;
	cy = cytoscape();
	

	constructor(props: Props){
		super(props);
		if(this.props.weighted){
			this.edgeStyle = {...this.edgeStyle, ...Styles.EDGE_WEIGHTED};
		}
		if(this.props.directed){
			this.edgeStyle = {...this.edgeStyle, ...Styles.EDGE_DIRECTED};
		}
	}
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
		this.props.dispatch({
			type: this.props.action,
		})
	}

	componentWillUnmount(){
		let nodes = this.cy.nodes();
		nodes.forEach((node:CytoscapeElement) => {
			let id = node.id();
			let popper = document.getElementById(id+'popper');
			if(popper){
				document.body.removeChild(popper);
			}
		});
	}
	
	refreshLayout() {
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({ name: 'preset' });
		this.layout.run();
	}

	clearGraph = () => {
		this.props.dispatch({
			type: actions.CLEAR_GRAPH,
		});
		let nodes = this.cy.nodes();
		let edges = this.cy.edges();
		this.cy.remove(nodes);
		this.cy.remove(edges);
	}
	removeNode = (node : string) => {
		this.cy.remove('node[id="' + node + '"]');
		let nodePopper = document.getElementById(node+'popper');
		if(nodePopper){
			document.body.removeChild(nodePopper);
		}
	}

	removeEdge = (edge : string) => {
		this.cy.remove('edge[id="' + edge + '"]');
	}

	executeAnimation = (commands : Array<AnimationStep>)=> {

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
				let { eles, distance, style, duration} = commands[pos++];
				if(style){
					eles.forEach((ele, index) => {
						this.cy.getElementById(ele).style(style[index]);
					});
				}
				if(distance !== undefined){
					eles.forEach((node, index) => {
						let nodeDom = document.getElementById(node+'popper');
						if(nodeDom) nodeDom.innerHTML = distance[index];
					});
				}
				this.refreshLayout();
				setTimeout(step, (duration === undefined) ? 1000 : duration);
			}
			step();
		}
		animation();
	}

	runButton = () => {
		let {selection} = this.props;
		if(this.props.algorithm !== 'Kruskal' && this.props.algorithm !== 'Prim'){
			console.log(this.props.algorithm);
			if(!selection || selection.type !== 'node'){
				console.error('No node selected');
				return;
			}
		}
		this.props.dispatch({
			type: actions.ANIMATION_START,
		});
		this.cy.autolock(true);
		let commands = this.props.execute({cy: this.cy, selection: this.props.selection});
		this.executeAnimation(commands);
	}
	
	removeButton = () => {
		let {selection} = this.props;
		if(!selection) {
			console.error('No element selected');
			return;
		}

		if(selection.type === 'node'){
			this.removeNode(selection.id);
		}else if(selection.type === 'edge'){
			this.removeEdge(selection.id);
		}

		this.props.dispatch({
			type: actions.NO_SELECTION,
		});
		
	}
	handleClickOnNode = (node : CytoscapeElement) => {
		if(this.props.animation === true) return;
		let nodeId = node.id();
		let { selection } = this.props;

		if (!selection || selection.type !== 'node') {
			node.style(Styles.NODE_SELECTED);

			if (selection && selection.type === 'edge') {
				let edge = this.cy.getElementById(selection.id);
				edge.style(this.edgeStyle);
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
				previous.style(this.edgeStyle);
			} else if (selection.type === 'node') {
				previous.style(this.nodeStyle);
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
			previous.style(this.edgeStyle);
		} else {
			this.props.dispatch({
				type: actions.SELECTION,
				payload: {
					selection: {
						type: 'edge',
						id: edgeId,
						weight: this.cy.getElementById(edgeId).data('weight'),
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
		let nodeId = getNodeIdString(id.toString());
		this.cy.add({
			group: 'nodes',
			data: { id: nodeId, value: id },
			position: { x, y }
		});

		let node = this.cy.getElementById(nodeId);

		let popper = node.popper({
			content: () => {
				let div = document.createElement('div');
				div.setAttribute('id', nodeId+'popper');
				document.body.appendChild( div );

				return div;
			}
		});
		
		let update = () => {
			popper.scheduleUpdate();
		};
		
		node.on('position', update);
	}

	createEdge(x : string, y : string) {
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				weight: Math.floor(Math.random()*15),
				source: x,
				target: y,
			}
		});
	}

	changeWeight = (weight: number) => {
		const {selection} = this.props;
		if(selection.type === 'edge'){
			const {id} = selection;
			this.cy.getElementById(id).data('weight', weight);
			this.props.dispatch({
				type: actions.SELECTION,
				payload: {
					selection: {
						type: 'edge',
						weight,
						id,
					}
				}
			})
		}
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
					previous.style(this.edgeStyle);
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
		let edgeWeight = null;
		let {selection} = this.props;
		if(selection && selection.type === 'edge'){
			const id = selection.id;
			edgeWeight = this.cy.getElementById(id).data('weight');
		}
		return (
			<Container fluid={true}> 
				<Row id="canvas"/>
				<ControlBar 
					run = {this.runButton} 
					remove = {this.removeButton}
					clearGraph = {this.clearGraph}
					changeWeight = {this.changeWeight}
					weighted = {this.props.weighted}
					edgeWeight = {edgeWeight}
				/>
			</Container>
		)
	}
};

export default connect(mapStateToProps)(Graph);