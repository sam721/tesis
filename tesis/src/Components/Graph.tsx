import React from 'react';
import actions from '../Actions/actions';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import {defaultGraphs} from '../resources/default_examples/defaultGraphs';
import ControlBar from './ControlBar';
import { Row, Col, Container } from 'react-bootstrap';
import GraphArray from './GraphArray';
import MediaRecorder from '../utils/MediaRecorder';
import MyModal from './UploadGraphModal';
import InputModal from './InputModal';

const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');


const autopanOnDrag = require('cytoscape-autopan-on-drag');
autopanOnDrag(cytoscape);

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
	speed: number,

	loadingGraph: Boolean,
	data: string,
}

type Element = {
	value: number,
	class: string,
}

type storeState = {
	selection: Object,
	algorithm: string,
	animation: Boolean,
	speed: number,
	loadingGraph: Boolean,
	data: string,
}

type State = {
	values: Array<string>,
	showModal: boolean,
	showWeightModal: boolean,
}

const getNodeIdString = (nodeId: string) => {
	return 'node-' + nodeId;
}

const mapStateToProps = (state: storeState) => {
	return {
		selection: state.selection,
		algorithm: state.algorithm,
		animation: state.animation,
		speed: state.speed,
		loadingGraph: state.loadingGraph,
		data: state.data,
	}
}

class Graph extends React.Component<Props, State>{

	_isMounted = false;

	_mediaRecorder = new MediaRecorder();

	state = {
		values: new Array(),
		showModal: false,
		showWeightModal: false,
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	edgeStyle = Styles.EDGE;
	cy = cytoscape();


	constructor(props: Props) {
		super(props);
		if (this.props.weighted) {
			this.edgeStyle = { ...this.edgeStyle, ...Styles.EDGE_WEIGHTED };
		}
		if (this.props.directed) {
			this.edgeStyle = { ...this.edgeStyle, ...Styles.EDGE_DIRECTED };
		}

		this._mediaRecorder = new MediaRecorder(props.dispatch);
	}

	initialize(elements: Object){
		let edgeStyle = Styles.EDGE;
		if (this.props.weighted) {
			edgeStyle = { ...edgeStyle, ...Styles.EDGE_WEIGHTED };
		}
		if (this.props.directed) {
			edgeStyle = { ...edgeStyle, ...Styles.EDGE_DIRECTED };
		}
		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements,

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
		this.removePoppers();
		this.cy.on('click', (event: CytoEvent) => this.handleClickViewport(event));
		this.cy.on('click', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
		this.cy.on('click', 'edge', (event: CytoEvent) => this.handleClickOnEdge(event.target));
		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
		});
		this.layout.run();
	}

	componentDidMount() {
		this._isMounted = true;
		this.initialize(defaultGraphs[Math.floor(Math.random()*defaultGraphs.length)].elements);
		this.props.dispatch({
			type: this.props.action,
			payload:{
				run: this.runButton,
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				options: [
					{
						name: 'Ejecutar',
						run: this.runButton,
					},
					{
						name: 'Eliminar',
						run: this.removeButton,
					},
					{
						name: 'Cambiar peso',
						run: this.weightButton,
					},
					{
						name: 'Limpiar canvas',
						run: this.clearGraph,
					},
					{
						name: 'Descargar grafo',
						run: () => this._mediaRecorder.takeJson(this.cy),
					},
					{
						name: 'Subir grafo',
						run: () => this.setState({showModal: true}),
					}
				]
			}
		});
		if(this.props.action === actions.SELECT_DIJKSTRA){
			this.props.dispatch({
				type: actions.DIJKSTRA_NEGATIVE_WEIGHT_WARNING,
			});
		}
	}

	componentDidUpdate(prevProps:Props){
		if(!prevProps.loadingGraph && this.props.loadingGraph){
			const elements = JSON.parse(this.props.data).elements;
			if(elements)
				this.initialize(JSON.parse(this.props.data).elements);
			this.props.dispatch({
				type: actions.FINISHED_LOAD,
			});
		}
	}
	componentWillUnmount() {
		this.props.dispatch({
			type: actions.ANIMATION_END,
		});
		
		this._isMounted = false;
		this._mediaRecorder.cancelGif();
		this.removePoppers();
	}

	refreshLayout() {
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({ name: 'preset' });
		this.layout.run();
	}

	clearGraph = () => {
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		this.props.dispatch({
			type: actions.CLEAR_GRAPH,
		});
		let nodes = this.cy.nodes();
		for (let i = 0; i < nodes.length; i++) {
			this.removeNode(nodes[i].id());
		}
	}

	removeNodePopper(node: string) {
		this.cy.remove('node[id="' + node + '-popper"]');

	}

	removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
		this.removeNodePopper(node);
	}

	removeEdge = (edge: string) => {
		this.cy.remove('edge[id="' + edge + '"]');
	}

	executeAnimation = (commands: Array<AnimationStep>) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
		this.props.dispatch({
			type: actions.STARTING_ALGORITHM_EXECUTION_INFO,
		});
		let animation = () => {
			let pos = 0;
			let step = () => {
				if(!this._isMounted) return;
				if(pos === commands.length){
					this.props.dispatch({
						type: actions.FINISHED_ALGORITHM_SUCCESS,
					});
					return;
				}
				if (!this.props.animation) {
					this.cy.nodes().style(this.nodeStyle);
					this.cy.edges().style(this.edgeStyle);
					this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					if(this._isMounted){
						this.setState({values: Array()});
					}
					this.cy.autolock(false);
					return;
				}
				let { eles, distance, style, duration, inst, lines} = commands[pos++];
				if (style) {
					eles.forEach((ele, index) => {
						this.cy.getElementById(ele).style(style[index]);
					});
				}
				if(eles){
					eles.forEach((node, index) => {
						
						if (distance !== undefined){
							this.cy.getElementById(node+'-popper').style({visibility: 'visible'});
							this.cy.getElementById(node+'-popper').data('value', distance[index]);
						}
						
					});
				}
				if(inst){
					let {values} = this.state;
					inst.forEach(ele => {
						if(ele.name === 'push'){
							const {data} = ele;
							console.log(data);
							values.push(data);
						}else if(ele.name === 'shift'){
							values.shift();
						}else if(ele.name === 'pop'){
							values.pop();
						}else if(ele.name === 'change_element'){
							let {position} = ele;
							if(position != null) values[position] = ele.data;
						}else if(ele.name === 'fill'){
							values.fill(ele.data);
						}
					});
					if(this._isMounted){
						this.setState({values});
					}
				}
				if(lines != null && this._isMounted){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {lines}
					})
				}
				this.refreshLayout();
				setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
			}
			step();
		}
		animation();
	}

	runButton = () => {
		if (this.props.animation === true) {
			this.setState({values: Array()});
			this.props.dispatch({
				type: actions.ANIMATION_END,
			});
			this.cy.nodes().style(this.nodeStyle);
			this.cy.edges().style(this.edgeStyle);
			this.removePoppers();
			this.cy.autolock(false);
			return;
		}
		let { selection } = this.props;
		if (this.props.algorithm !== 'Kruskal' && this.props.algorithm !== 'Prim') {
			console.log(this.props.algorithm);
			if (!selection || selection.type !== 'node') {
				this.props.dispatch({
					type: actions.NO_NODE_SELECTED_ERROR,
				})
				return;
			}
		}
		const nodes = this.cy.nodes();
		nodes.forEach((node:CytoscapeElement) => {
			this.createPopper(node.id());
		});
		this.refreshLayout();
		let animationPromise = new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
			this.props.dispatch({
				type: actions.ANIMATION_START,
			});
			let commands = this.props.execute({ cy: this.cy, selection: this.props.selection });
			resolve(commands);
		});

		animationPromise.then((commands: Array<AnimationStep>) => {
			this.cy.autolock(true);

			this.executeAnimation(commands);
		});
	}

	removeButton = () => {
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		let { selection } = this.props;
		if (!selection) {
			this.props.dispatch({
				type: actions.NO_ELEMENT_SELECTED_ERROR,
			})
			return;
		}

		if (selection.type === 'node') {
			this.removeNode(selection.id);
		} else if (selection.type === 'edge') {
			this.removeEdge(selection.id);
		}

		this.props.dispatch({
			type: actions.NO_SELECTION,
		});

	}
	handleClickOnNode = (node: CytoscapeElement) => {
		if (this.props.animation === true) return;
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

	handleClickOnEdge = (edge: CytoscapeElement) => {
		if (this.props.animation === true) return;
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

	createNode(x: string, y: string) {
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
	}

	createPopper(nodeId: string){
		const ele = this.cy.getElementById(nodeId);
		const position = ele.position();
		this.cy.add({
			group: 'nodes',
			data: {id : nodeId+'-popper'},
			position: {
				x: position.x,
				y: position.y+30,
			},
			style: {
				'z-index': 0,
				'border-width': 0,
				'font-size': 15,
				'width': 10,
				'height': 10,
				'visibility': 'hidden',
			}
		});
	}

	removePoppers(){
		const nodes = this.cy.nodes();
		nodes.forEach((node:CytoscapeElement) => {
			this.removeNode(node.id()+'-popper');
		})
	}

	createEdge(x: string, y: string) {
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				weight: Math.floor(Math.random() * 15),
				source: x,
				target: y,
			}
		});
	}

	changeWeight = (weight: number) => {
		const { selection } = this.props;
		if (selection.type === 'edge') {
			const { id } = selection;
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

	weightButton = () => {
		const {selection} = this.props;
		if(selection && selection.type === 'edge'){
			this.setState({showWeightModal: true});
		}else{
			this.props.dispatch({
				type: actions.NO_EDGE_SELECTED_ERROR,
			})
		}
	}

	handleClickViewport = (event: CytoEvent) => {
		if (this.props.animation === true){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			})
			return;
		}

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
		let { selection } = this.props;
		if (selection && selection.type === 'edge') {
			const id = selection.id;
			edgeWeight = this.cy.getElementById(id).data('weight');
		}
		return (
			<>
				<MyModal show={this.state.showModal} handleClose={() => this.setState({showModal: false})}/>
				<InputModal 
					show={this.state.showWeightModal} 
					handleClose = {() => this.setState({showWeightModal: false})}
					callback = {(w:number) => this.changeWeight(w)}
				/>
				<div id = "canvas" className="standard-struct"/>
				{
					/*
				<GraphArray array={this.state.values}/>
				
					
					<ControlBar
						run={this.runButton}
						remove={this.removeButton}
						clearGraph={this.clearGraph}
						changeWeight={this.changeWeight}
						weighted={this.props.weighted}
						edgeWeight={edgeWeight}
					/>
					<button onClick={() => this._mediaRecorder.takePicture(this.cy)}>Test picture</button>
					<button onClick={() => this._mediaRecorder.takeGif(this.cy)}>Test gif</button>
					*/
				}
			</>
		)
	}
};

export default connect(mapStateToProps)(Graph);