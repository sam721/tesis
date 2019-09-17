import React from 'react';
import actions from '../Actions/actions';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import MediaRecorder from '../utils/MediaRecorder';
import MyModal from './UploadGraphModal';
import InputModal from './InputModal';
import graphProcessing from '../Processing/graph-processing';
import algoNames from '../resources/names_and_routes/algorithm_names'
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

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
	paused: boolean,

	cookies: any,
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
	paused: boolean,
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
		paused: state.paused,
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

	undo: Array<Array<Object>> = [];
	redo: Array<Array<Object>> = [];
	
	options: Array<{name: string, run: () => void}>;
	cy = cytoscape();

	buffer: Array<{elements: Array<Object>, lines: Array<number>, duration: number, action?:string}> = [];

	step:number=0;
	animationTimeout = 0;
	constructor(props: Props) {
		super(props);
		if (this.props.weighted) {
			this.edgeStyle = { ...this.edgeStyle, ...Styles.EDGE_WEIGHTED };
		}
		if (this.props.directed) {
			this.edgeStyle = { ...this.edgeStyle, ...Styles.EDGE_DIRECTED };
		}

		this._mediaRecorder = new MediaRecorder(props.dispatch);
		this.options = [
			{
				name: 'Ejecutar',
				run: this.runButton,
			},
			{
				name: 'Cambiar peso',
				run: this.weightButton,
			},
			{
				name: 'Descargar grafo',
				run: () => this._mediaRecorder.takeJson(this.exportGraph()),
			},
			{
				name: 'Subir grafo',
				run: () => this.setState({showModal: true}),
			}
		];
	}

	componentDidMount() {
		this._isMounted = true;
		this.initialize([]);
		this.props.dispatch({
			type: this.props.action,
			payload:{
				run: this.runButton,
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				undo: this.handleUndo,
				redo: this.handleRedo,
				options: this.options,
				rewind: this.handleRewind,
				forward: this.handleForward,
				pause: this.handlePauseContinue,
				repeat: this.handleRepeat,
				end: this.handleEnd,
				remove: this.removeButton,
				clear: this.clearGraph,
			}
		});
		const {cookies} = this.props;
		console.log(cookies.getAll());
		if(this.props.action === actions.SELECT_DIJKSTRA){
			if(!cookies.get('dijkstra_warning')){
				cookies.set('dijkstra_warning', 'true', {path: '/'});		
				this.props.dispatch({
					type: actions.DIJKSTRA_NEGATIVE_WEIGHT_WARNING,
				});
			}
		}

		if(!cookies.get('visited')){
			cookies.set('visited', 'true', {path: '/' });
			this.props.dispatch({
				type: actions.TOGGLE_TUTORIAL_MODAL,
			});
		}
	}

	componentDidUpdate(prevProps:Props){
		if(!prevProps.loadingGraph && this.props.loadingGraph){
			const elements = JSON.parse(this.props.data);
			if(elements){
				this.pushState();
				this.loadGraph(elements);
			}
			this.props.dispatch({
				type: actions.FINISHED_LOAD,
			});
		}
		if(!prevProps.animation && this.props.animation){
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: {
					options: [
						{ name: 'Volver a edicion', run: this.runButton}
					]
				}
			})
		}else if(prevProps.animation && !this.props.animation){
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: {
					options: this.options,
				}
			});
		}
	}
	
	componentWillUnmount() {
		this.props.dispatch({
			type: actions.ANIMATION_END,
		});
		
		this._isMounted = false;
		clearTimeout(this.animationTimeout);
		this._mediaRecorder.cancelGif();
		this.removePoppers();
	}


	initialize(elements: Array<Object>, withPoppers:boolean=false){
		console.log(elements);
		
		let edgeStyle = Styles.EDGE;
		if (this.props.weighted) {
			edgeStyle = { ...edgeStyle, ...Styles.EDGE_WEIGHTED };
		}
		if (this.props.directed) {
			edgeStyle = { ...edgeStyle, ...Styles.EDGE_DIRECTED };
		}

		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements: JSON.parse(JSON.stringify(elements)),

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
			pixelRatio: '1.0'
		});
		if(!withPoppers) this.removePoppers();
		else{
			this.cy.nodes().forEach((node:CytoscapeElement) => {
				if(node.id().match('popper')) node.style({'visibility': 'hidden'});
			});
		}
		this.cy.on('click', (event: CytoEvent) => this.handleClickViewport(event));
		this.cy.on('click', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
		this.cy.on('click', 'edge', (event: CytoEvent) => this.handleClickOnEdge(event.target));

		this.cy.on('tap', (event: CytoEvent) => this.handleClickViewport(event));
		this.cy.on('tap', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
		this.cy.on('tap', 'edge', (event: CytoEvent) => this.handleClickOnEdge(event.target));
		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
		});
		this.layout.run();
	}

	handleUndo = () => {
		console.log(this.undo);
		if(this.undo.length === 0){
			return;
		}
		
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}

		this.props.dispatch({
			type: actions.NO_SELECTION,
		});

		const currentElements = this.exportGraph();
		let elements = this.undo.pop();
		console.log(elements);
		this.redo.push(currentElements);
		
		if(elements !== undefined) this.loadGraph(elements);
		
	}

	handleRedo = () => {
		if(this.redo.length === 0){
			return;
		}

		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		
		this.props.dispatch({
			type: actions.NO_SELECTION,
		});

		const currentElements = this.exportGraph();
		const elements = this.redo.pop();
		this.undo.push(currentElements);
		if(elements !== undefined) this.loadGraph(elements);
	}

	pushState(){
		this.redo = [];
		this.undo.push(this.exportGraph());
	}

	handleRewind = () => { 
		console.log(this.animationTimeout);
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.max(this.step-1, 0);
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements);
		this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleForward = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.min(this.step+1, this.buffer.length-1);
		console.log(this.step);
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements);
		this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleRepeat = () => {
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = 0;
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements);
		this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleEnd = () => {
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = this.buffer.length - 1;
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements);
		this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines }});
	}

	handlePauseContinue = () => {
		if(!this.props.paused){
			clearTimeout(this.animationTimeout);
			this.props.dispatch({
				type: actions.ANIMATION_PAUSE,
			})
		}else{
			new Promise(resolve => {
				this.props.dispatch({
					type: actions.ANIMATION_CONTINUE
				})
				resolve();
			}).then(() => this.animation());
		}
	}
	
	loadGraph(elements:Array<Object>, withPoppers:boolean = false){
		try{
			const nodes = this.cy.nodes();
			for(let i = 0; i < nodes.length; i++){
				this.removeNode(nodes[i].id());
			}
			for(let i = 0; i < elements.length; i++) this.cy.add(JSON.parse(JSON.stringify(elements[i])));
			this.cy.nodes().forEach((node:CytoscapeElement) => {
				const style = node.data('style');
				if(style != null) node.style(style);
			})
			this.cy.edges().forEach((edge:CytoscapeElement) => {
				const style = edge.data('style');
				edge.style(this.edgeStyle);
				if(style != null) edge.style(style);
			})
		}catch(error){
			this.props.dispatch({ type: actions.INVALID_GRAPH_ERROR});
		}
	}

	exportGraph(withStyle:boolean=false){
		const elements:Array<Object> = [];
		this.cy.nodes().forEach((node:CytoscapeElement) => {
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
					value: node.data('value'),
					position: node.position(),
					style: (withStyle? {
						color: node.style('color'),
						backgroundColor: node.style('background-color'),
						borderWidth: node.style('border-width'),
						width: node.style('width'),
						height: node.style('height'),
						visibility: node.style('visibility'),
						zIndex: node.style('z-index'),

					} : {}),
				},
				position: {
					x: node.position().x,
					y: node.position().y,
				}
			})
		});
		this.cy.edges().forEach((edge:CytoscapeElement) => {
			elements.push({
				group: 'edges',
				data: {
					id: edge.id(),
					source: edge.source().id(), target: edge.target().id(),
					weight: edge.data('weight'),
					style: (withStyle? {
						lineColor: edge.style('line-color'),
						targetArrowShape: edge.style('target-arrow-shape'),
						targetArrowColor: edge.style('target-arrow-color'),
						lineStyle: edge.style('line-style'),
						label: edge.style('label'),
						textRotation: edge.style('text-rotation'),
						textMarginY: edge.style('text-margin-y'),	
					} : {}),
				}
			})
		});
		return elements;
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
		if(nodes.length === 0) return;
		this.pushState();
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

	animation(){
		let step = () => {
			if(!this._isMounted) return;
			if(this.step === this.buffer.length){
				this.props.dispatch({
					type: actions.FINISHED_ALGORITHM_SUCCESS,
				});
				this.props.dispatch({
					type: actions.ANIMATION_PAUSE,
				});
				return;
			}
			if (!this.props.animation) {
				this.cy.nodes().style(this.nodeStyle);
				this.cy.edges().style(this.edgeStyle);
				this.props.dispatch({
					type: actions.ANIMATION_END,
				});
				this.cy.autolock(false);
				return;
			}
			if(this.props.paused) return;
			const {elements, lines, duration, action} = this.buffer[this.step++];
			if(action){
				this.props.dispatch({ type: action });
			}
			this.loadGraph(elements, true);
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			this.refreshLayout();
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
		}
		step();
	}
	executeAnimation = (commands:Array<AnimationStep>) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
		this.buffer = graphProcessing(this.exportGraph(true), commands);
		let notification;
		if(this.props.algorithm === algoNames.BFS) notification = actions.STARTING_BFS_INFO;
		else if(this.props.algorithm === algoNames.DFS) notification = actions.STARTING_DFS_INFO;
		else if(this.props.algorithm === algoNames.Dijkstra) notification = actions.STARTING_DIJKSTRA_INFO;
		else if(this.props.algorithm === algoNames.BellmanFord) notification = actions.STARTING_BELLMAN_FORD_INFO;
		else if(this.props.algorithm === algoNames.Kruskal) notification = actions.STARTING_KRUSKAL_INFO;
		else if(this.props.algorithm === algoNames.Prim) notification = actions.STARTING_PRIM_INFO;
		this.props.dispatch({
			type: notification,
		});
		this.step = 0;
		this.animation();
	}

	runButton = () => {
		if (this.props.animation === true) {
			//this.setState({values: Array()});
			new Promise((resolve) => {
				this.props.dispatch({
					type: actions.ANIMATION_END,
				});
				this.cy.autolock(false);
				clearTimeout(this.animationTimeout);
				resolve();
			}).then(() => {this.handleUndo(); this.redo.pop()});

			return;
		}

		this.pushState();
		let { selection } = this.props;
		if (this.props.algorithm !== algoNames.Kruskal && this.props.algorithm !== algoNames.Prim) {
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
		let animationPromise = new Promise((resolve: (commands:Array<AnimationStep>) => void, reject) => {
			this.props.dispatch({
				type: actions.ANIMATION_START,
			});
			let commands = this.props.execute({ cy: this.cy, selection: this.props.selection });
			resolve(commands);
		});

		animationPromise.then((commands:Array<AnimationStep>) => {
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
		this.pushState();
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
		this.pushState();
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
				y: position.y+32,
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
		this.pushState();
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				weight: Math.floor(Math.random() * 15) - (this.props.algorithm === 'BellmanFord' ? 7 : 0),
				source: x,
				target: y,
			}
		});
	}

	changeWeight = (weight: number) => {
		const { selection } = this.props;
		if (selection.type === 'edge') {
			const { id } = selection;
			if(this.cy.getElementById(id).data('weight') === weight) return;
			this.pushState();
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
					previous.style(Styles.NODE);
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

export default withCookies(connect(mapStateToProps)(Graph));