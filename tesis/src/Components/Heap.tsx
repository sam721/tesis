import React from 'react';
import actions from '../Actions/actions';

import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import TreeBar from './TreeBar';
import { Row, Container } from 'react-bootstrap';
import PriorityQueue from '../Algorithms/DS/PriorityQueue'
import downloadGif from '../utils/gifshot-utils';
import HeapArray from './HeapArray';
import { number, string } from 'prop-types';
import InputHeapModal from './InputHeapModal';
import MediaRecorder from '../utils/MediaRecorder';
import { parseHeap } from '../utils/heap-utils';
import InputModal from './InputModal';
import { insert, remove } from '../resources/pseudocodes/heap';
import HeapProcessor from '../Processing/heap-processing';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

type options = {
	name: string,
	positions: { [id: string]: { x: number, y: number } },
	padding: number,
	animate: boolean,
	animationDuration: number,
}

let layoutOptions: options = {
	name: 'preset',
	positions: {}, // map of (node id) => (position obj); or function(node){ return somPos; }
	padding: 30, // padding on fit
	animate: true, // whether to transition the node positions
	animationDuration: 500, // duration of animation in ms if enabled
};

type storeState = {
	animation: string,
	speed: number,
	paused: boolean,
}

type Element = {
	value: number,
	class: string,
}

type State = {
	show: boolean,
	showInsertModal: boolean,
}

type stackState = {
	heap: Array<number>,
	elements: Array<Object>,
}

type Props = {
	action: string,
	animation: boolean,
	speed: number,
	dispatch: (action: Object) => Object,
	paused: boolean,
}
const mapStateToProps = (state: storeState) => {
	return {
		animation: state.animation,
		speed: state.speed,
		paused: state.paused,
	}
}
class Heap extends React.Component<Props, State>{

	_isMounted = false;
	_mediaRecorder = new MediaRecorder();

	undo: Array<Array<Object>> = [];
	redo: Array<Array<Object>> = [];

	state = {
		show: false,
		showInsertModal: false,
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	edgeStyle = Styles.EDGE;
	cy = cytoscape();

	heapProcessor:any;
	buffer: Array<{ elements: Array<Object>, lines: Array<number>, duration: number }> = [];
	options: Array<{ name: string, run: () => void }>;

	animationTimeout = 0;
	step = 0;

	constructor(props: Props) {
		super(props);
		this._mediaRecorder = new MediaRecorder(props.dispatch);
		this.options = [
			{
				name: 'Insertar',
				run: () => this.setState({ showInsertModal: true }),
			},
			{
				name: 'Extraer minimo',
				run: this.remove,
			},
			{
				name: 'Limpiar canvas',
				run: () => { },
			},
			{
				name: 'Subir Heap',
				run: () => this.setState({ show: true }),
			},
			{
				name: 'Descargar Heap',
				run: () => { 
					if(!this.props.animation) parseHeap(this.heapProcessor.heap._data)
				}
			}
		]
	}

	initialize() {
		let edgeStyle = Styles.EDGE;
		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements: [],

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

			headless: false,
			styleEnabled: true,
			hideEdgesOnViewport: false,
			hideLabelsOnViewport: false,
			userPanningEnabled: false,
			zoomingEnabled: false,
			textureOnViewport: false,
			motionBlur: false,
			motionBlurOpacity: 0.2,
			pixelRatio: '1.0',
			autoungrabify: true,
		});
		this.cy.nodes().forEach((node: CytoscapeElement) => {
			if (node.id().match('-popper')) {
				node.style(
					{
						'z-index': 0,
						'border-width': 0,
						'font-size': 15,
						'width': 10,
						'height': 10,
					}
				)
			}
		});
		this.cy.on('resize', () => this.refreshLayout(false));
		this.layout = this.cy.elements().makeLayout({ ...layoutOptions, animate: false });
		this.layout.run();

		this.refreshLayout();
	}

	componentDidMount() {
		this._isMounted = true;
		this.initialize();
		this.heapProcessor = new HeapProcessor(this.cy.width(), this.cy.height());
		this.props.dispatch({
			type: this.props.action,
			payload: {
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				undo: this.handleUndo,
				redo: this.handleRedo,
				options: this.options,
				rewind: this.handleRewind,
				forward: this.handleForward,
				repeat: this.handleRepeat,
				pause: this.handlePauseContinue,
			}
		})
	}

	componentDidUpdate(prevProps: Props) {
		layoutOptions.animationDuration = 500 / this.props.speed;

		if (prevProps.animation && !this.props.animation) {
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: { options: this.options }
			});
		} else if (!prevProps.animation && this.props.animation) {
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: {
					options: [
						{
							name: 'Volver a edicion',
							run: () => {
								this.loadGraph(this.buffer[this.buffer.length-1].elements);
								this.props.dispatch({ type: actions.ANIMATION_END })
								clearTimeout(this.animationTimeout);
							}
						}]
				}
			});
		}
	}

	componentWillUnmount() {
		this.props.dispatch({
			type: actions.ANIMATION_END,
		});
		clearTimeout(this.animationTimeout);
		this._isMounted = false;
		let nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			this.removeNode(node.id());
		});
	}

	handleUndo = () => {
		if (this.undo.length === 0) {
			return;
		}

		if (this.props.animation) {
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}

		this.props.dispatch({
			type: actions.NO_SELECTION,
		});

		const currentElements = this.exportGraph();

		let state = this.undo.pop();
		if (state !== undefined) {
			this.redo.push(currentElements);
			this.loadGraph(state);
			this.heapProcessor.loadGraph(state);
		}
	}

	handleRedo = () => {
		if (this.redo.length === 0) {
			return;
		}

		if (this.props.animation) {
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}

		this.props.dispatch({
			type: actions.NO_SELECTION,
		});

		const currentElements = this.exportGraph();

		let state = this.redo.pop();
		if (state !== undefined) {
			this.undo.push(currentElements);
			this.loadGraph(state);
			this.heapProcessor.loadGraph(state);
		}
	}

	pushState() {
		this.redo = [];
		this.undo.push(this.exportGraph());
	}

	handleRewind = () => { 
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

	loadGraph(elements: Array<Object>) {
		const nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			this.cy.remove(node);
		})

		for (let i = 0; i < elements.length; i++) {
			this.cy.add(elements[i]);
		}

		this.cy.nodes().forEach((node: CytoscapeElement) => {
			const style = node.data('style');
			if (style != null) node.style(style);
			const position = node.data('position');
			//console.log("PREV", node.position());
			//console.log("NEXT", position);
			if (position != null) {
				layoutOptions.positions[node.id()] = JSON.parse(JSON.stringify(position));
			}
		})

		this.cy.edges().forEach((edge: CytoscapeElement) => {
			const style = edge.data('style');
			if (style != null) edge.style(style);
		})

		this.refreshLayout();
	}

	exportGraph() {
		const elements: Array<Object> = [];
		this.cy.nodes().forEach((node: CytoscapeElement) => {
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
					value: node.data('value'),
					position: {
						x: node.position().x,
						y: node.position().y,
					}
				},
				style: node.style(),
				position: {
					x: node.position().x,
					y: node.position().y,
				},
			})
		});
		this.cy.edges().forEach((edge: CytoscapeElement) => {
			elements.push({
				group: 'edges',
				data: {
					id: edge.id(),
					source: edge.source().id(), target: edge.target().id(),
					weight: edge.data('weight'),
				},
			})
		});
		return elements;
	}

	createPopper(nodeId: string, value: number) {
		const ele = this.cy.getElementById(nodeId);
		const position = ele.position();
		this.cy.add({
			group: 'nodes',
			data: { id: nodeId + '-popper', value },
			position: {
				x: position.x,
				y: position.y + 30,
			},
			style: {
				'z-index': 0,
				'border-width': 0,
				'font-size': 15,
				'width': 10,
				'height': 10,
			}
		});
	}

	addNode(node: string, value: number, position: { x: number, y: number } = { x: 0, y: 0 }) {
		this.cy.add(
			{
				group: 'nodes',
				data: { id: node.toString(), value },
				grabbable: false,
				pannable: false,
				position: { x: position.x, y: position.y },
			},
		)
		this.createPopper(node, parseInt(node));
	}
	removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
		this.cy.remove('node[id="' + node + '-popper"]');
	}

	animation() {
		let step = () => {
			if (this.step === this.buffer.length) {
				this.props.dispatch({
					type: actions.FINISHED_ALGORITHM_SUCCESS,
				});
				this.props.dispatch({
					type: actions.ANIMATION_PAUSE,
				});
				return;
			}
			if (!this.props.animation) {
				return;
			}
			const { elements, lines, duration } = this.buffer[this.step++];
			if(this.props.paused) return;
			this.loadGraph(elements);
			if (lines) this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines } });
			console.log(duration);
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration) / (this.props.speed));
		}
		step();
	}

	executeAnimation = () => {
		this.cy.nodes().forEach((node: CytoscapeElement) => {
			if (!node.id().match('-popper')) {
				node.style({
					'background-color': 'white',
					'color': 'black',
				})
			}
		})
		new Promise((resolve, reject) => {
			this.props.dispatch({
				type: actions.ANIMATION_START,
			});
			resolve();
		}).then(() => {
			this.step = 0;
			this.animation();
		})
	}

	refreshLayout(animate: boolean = true) {
		this.layoutProcessing();
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({ ...layoutOptions, animate });
		this.layout.run();
	}
	
	layoutProcessing() {
		const getHeight = (node: CytoscapeElement) => {
			let outgoers = node.outgoers('node');
			let height = 0;
			for (let i = 0; i < outgoers.length; i++) {
				height = Math.max(height, getHeight(outgoers[i]));
			}
			return height + 1;
		}
		let height = getHeight(this.cy.getElementById("1"));

		let sep = (1 << height) * 5;

		const setSep = (node: CytoscapeElement, nx: number, ny: number, sep: number) => {
			layoutOptions.positions[node.id()] = { x: nx, y: ny }
			node.data('position', {x: nx, y: ny});
			const popper = this.cy.getElementById(node.id() + '-popper');
			layoutOptions.positions[popper.id()] = { x: nx, y: ny + 30 }
			popper.data('position', {x: nx, y: ny+30});
			if (node.outgoers('node').length) setSep(node.outgoers('node')[0], nx - sep, ny + 50, sep / 2);
			if (node.outgoers('node').length === 2) setSep(node.outgoers('node')[1], nx + sep, ny + 50, sep / 2);
		}
		const vw = this.cy.width(), vh = this.cy.height();
		setSep(this.cy.getElementById("1"), vw / 2, vh / 4, sep);
		return true;
	}
	
	insert(val = 0) {
		if (this.props.animation) {
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}

		this.props.dispatch({
			type: actions.CHANGE_PSEUDO,
			payload: {
				pseudo: insert,
			}
		});

		this.pushState();

		this.buffer = this.heapProcessor.insert(val);
		console.log(this.buffer);
		this.executeAnimation();
	}

	remove = () => {
		if (this.props.animation) {
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}

		this.props.dispatch({
			type: actions.CHANGE_PSEUDO,
			payload: {
				pseudo: remove,
			}
		});

		this.pushState();

		this.buffer = this.heapProcessor.remove();
		console.log(this.buffer);
		this.executeAnimation();
	}

	changeArray(values: Array<number>) {
		this.pushState();

		this.cy.nodes().forEach((node: CytoscapeElement) => {
			this.cy.remove(node);
		});
		this.heapProcessor.heap.clear();
		for(let i = 1; i < values.length; i++){
			this.addNode(i.toString(), values[i]);
		}
		for(let i = 1; 2*i < values.length; i++){
			this.cy.add({
				group: 'edges',
				data: {
					id: i.toString() + '-' + (2*i).toString(),
					source: i.toString(),
					target: (2*i).toString(),
				}
			});
		}
		for(let i = 1; 2*i+1 < values.length; i++){
			this.cy.add({
				group: 'edges',
				data: {
					id: i.toString() + '-' + (2*i+1).toString(),
					source: i.toString(),
					target: (2*i+1).toString(),
				}
			});
		}
		this.refreshLayout();
		this.heapProcessor.loadGraph(this.exportGraph());
	}
	render() {
		return (
			<>
				<InputHeapModal
					show={this.state.show}
					changeArray={(values: Array<number>) => this.changeArray(values)}
					handleClose={() => this.setState({ show: false })}
				/>
				<InputModal
					show={this.state.showInsertModal}
					handleClose={() => this.setState({ showInsertModal: false })}
					callback={(v: number) => this.insert(v)}
				/>
				<div id="canvas" className='standard-struct' />
			</>
		);
	}
}

export default connect(mapStateToProps)(Heap);