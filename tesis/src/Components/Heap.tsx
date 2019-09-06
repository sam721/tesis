import React from 'react';
import actions from '../Actions/actions';

import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import TreeBar from './TreeBar';
import { Row, Container} from 'react-bootstrap';
import PriorityQueue from '../Algorithms/DS/PriorityQueue'
import downloadGif from '../utils/gifshot-utils';
import HeapArray from './HeapArray';
import { number, string } from 'prop-types';
import InputHeapModal from './InputHeapModal';
import MediaRecorder from '../utils/MediaRecorder';
import { parseHeap } from '../utils/heap-utils';
import InputModal from './InputModal';
import {insert, remove} from '../resources/pseudocodes/heap';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

type options = {
	name: string,
	positions: {[id: string]:{x: number, y:number}},
	padding: number,
	animate: boolean,
	animationDuration: number,
}

let layoutOptions:options = {
	name: 'preset',
	positions: {}, // map of (node id) => (position obj); or function(node){ return somPos; }
	padding: 30, // padding on fit
	animate: true, // whether to transition the node positions
	animationDuration: 500, // duration of animation in ms if enabled
};

type storeState = {
	animation: string,
	speed: number,
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
}
const mapStateToProps = (state:storeState) => {
	return {
		animation: state.animation,
		speed: state.speed,
	}
}
class Heap extends React.Component<Props, State>{

	_isMounted = false;
	_mediaRecorder = new MediaRecorder();

	undo: Array<stackState>=[];
	redo: Array<stackState>=[];

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

	heap = new PriorityQueue((x, y) => x <= y);

	constructor(props:Props){
    super(props);
    this._mediaRecorder = new MediaRecorder(props.dispatch);
	}
	
	initialize(state: stackState){
		const {heap, elements} = state;

		this.heap._data = [...heap];
		let edgeStyle = Styles.EDGE;
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
			pixelRatio: '1.0',
			autoungrabify: true,
		});
		this.cy.nodes().forEach((node:CytoscapeElement) => {
			if(node.id().match('-popper')){
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
		this.layout = this.cy.elements().makeLayout({...layoutOptions, animate: false});
		this.layout.run();

		this.refreshLayout();
	}
	
	componentDidMount() {
		this._isMounted = true;
		this.initialize({heap: [0], elements: []});
		this.props.dispatch({
			type: this.props.action,
			payload: {
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				undo: this.handleUndo,
				redo: this.handleRedo,
				options: [
					{
						name: 'Insertar',
						run: () => this.setState({showInsertModal: true}),
					},
					{
						name: 'Extraer minimo',
						run: this.remove,
					},
					{
						name: 'Limpiar canvas',
						run: () => this.heap.length() > 1 && this.changeArray([0]),
					},
					{
						name: 'Subir Heap',
						run: () => this.setState({show: true}),
					},
					{
						name: 'Descargar Heap',
						run: () => {
							if(!this.props.animation) parseHeap(this.heap._data)
						}
					}
				]
			}
		})
	}

	componentDidUpdate(){
    layoutOptions.animationDuration = 500/this.props.speed;
	}
	
	componentWillUnmount(){
		this.props.dispatch({
      type: actions.ANIMATION_END,
    });
    this._isMounted = false;
		let nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			this.removeNode(node.id());
		});
	}
	
	handleUndo = () => {
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
		
		let state = this.undo.pop();
		if(state !== undefined){
			this.redo.push({heap: [...this.heap._data], elements: currentElements});
			this.initialize(state);
		}
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
		
		let state = this.redo.pop();
		if(state !== undefined){
			this.undo.push({heap: [...this.heap._data], elements: currentElements});
			this.initialize(state);
		}
	}

	pushState(){
		this.redo = [];
		this.undo.push({ heap: [...this.heap._data], elements: this.exportGraph()});
	}
	exportGraph(){
		const elements:Array<Object> = [];
		this.cy.nodes().forEach((node:CytoscapeElement) => {
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
					value: node.data('value'),
				},
				position: {
					x: node.position().x,
					y: node.position().y,
				},
			})
		});
		this.cy.edges().forEach((edge:CytoscapeElement) => {
			elements.push({
				group: 'edges',
				data: {
					id: edge.id(),
					source: edge.source().id(), target: edge.target().id(),
					weight: edge.data('weight'),
				}
			})
		});
		return elements;
	}

	createPopper(nodeId: string, value: number){
		const ele = this.cy.getElementById(nodeId);
		const position = ele.position();
		this.cy.add({
			group: 'nodes',
			data: {id : nodeId+'-popper', value},
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
			}
		});
	}

	addNode(node: string, value: number, position: {x: number, y: number} = {x: 0, y: 0}){
		this.cy.add(
			{
				group: 'nodes',
				data: { id: node.toString(), value },
				grabbable: false,
				pannable: false,
				position: {x: position. x, y: position.y },
			},
		)
		this.createPopper(node, parseInt(node));
	}
	removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
		this.cy.remove('node[id="' + node + '-popper"]');
	}

	executeAnimation = (commands: Array<AnimationStep>) => {
		this.cy.nodes().forEach((node: CytoscapeElement) => {
			if(!node.id().match('-popper')){
				node.style({
					'background-color': 'white',
					'color': 'black',
				})
			}
		})
		let animation = () => {
			let pos = 0;
			let step = () => {
				if (pos === commands.length || !this.props.animation) {
					this.cy.nodes().forEach((node: CytoscapeElement) => {
						if(!node.id().match('-popper')){
							node.style({
								'background-color': 'white',
								'color': 'black',
							})
						}
					})
					this.cy.edges().style(this.edgeStyle);

					this.props.dispatch({
						type: actions.ANIMATION_END,
					});

					this.refreshLayout();
					return;
				}
				let { eles, style, duration, data, classes, lines} = commands[pos++];
				if (eles) {
					eles.forEach((ele, index) => {
						if(style) this.cy.getElementById(ele).style(style[index]);
					});
					eles.forEach((ele, index) => {
						if(data !== undefined){
							this.cy.getElementById(ele).data(data[index]);
							console.log(ele, data[index]);
							const id = parseInt(ele, 10);
						}
	
					})
				}
				if(lines != null && this._isMounted){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {lines}
					})
				}
				this.refreshLayout();
				setTimeout(step, ((duration === undefined) ? 1000/this.props.speed : duration)/this.props.speed);
			}
			step();
		}
		animation();
	}

	refreshLayout(animate:boolean=true) {
		this.layoutProcessing();
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({...layoutOptions, animate});
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
			layoutOptions.positions[node.id()+'-popper'] = { x: nx, y: ny+30}
			if (node.outgoers('node').length) setSep(node.outgoers('node')[0], nx - sep, ny + 50, sep / 2);
			if (node.outgoers('node').length === 2) setSep(node.outgoers('node')[1], nx + sep, ny + 50, sep / 2);
		}
		const vw = this.cy.width(), vh = this.cy.height();
		setSep(this.cy.getElementById("1"), vw / 2, vh / 4, sep);
		return true;
	}

	insert(val = 0) {
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		let commands:Array<AnimationStep> = [];
		if(this.heap.length() === 32) return;

		this.props.dispatch({
			type: actions.CHANGE_PSEUDO,
			payload: {
				pseudo: insert,
			}
		});

		this.props.dispatch({
			type: actions.CHANGE_LINE,
			payload: {
				lines: [0, 1, 2],
			}
		});

		this.pushState();
		console.log(this.heap.length());
		if (this.heap.length()-1 === 0) {
			
			this.addNode("1", val);
			commands = this.heap.push(val, true);
		} else {
			let nodeId = this.heap.length();
			console.log(nodeId);
			let src = this.cy.getElementById(Math.floor(nodeId / 2).toString());
			this.addNode(nodeId.toString(), val, src.position());
			this.cy.add(
				{
					group: 'edges',
					data: { id: src.id() + '-' + nodeId.toString(), source: src.id(), target: nodeId.toString() }
				}
			)
			commands = this.heap.push(val, true);
		}

		this.refreshLayout();
		let animationPromise = new Promise((resolve, reject) => {

			this.props.dispatch({
				type: actions.ANIMATION_START,
			});

			resolve(commands);
		});
		animationPromise.then(commands => {
			//this.cy.autolock(true);
			setTimeout(this.executeAnimation, 1000/this.props.speed, commands);
		});
	}

	remove = () => {
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		const n = this.heap.length()-1;
		if (n === 0){
			this.props.dispatch({
				type: actions.EMPTY_HEAP_WARNING,
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

		const outgoers = this.cy.getElementById("1").outgoers('node');
		this.removeNode("1");
		let commands:Array<AnimationStep> = [];

		this.props.dispatch({
			type: actions.CHANGE_LINE,
			payload: {
				lines: [0, 1, 2, 3],
			}
		});
		
		commands = this.heap.pop(true);

		if (n === 1) {
			return;
		}

		const position = this.cy.getElementById(n.toString()).position();
		const value = this.cy.getElementById(n.toString()).data('value');
		this.removeNode(n.toString());

		this.addNode("1", value, position);

		for (let i = 0; i < outgoers.length; i++) {
			if (this.cy.getElementById(outgoers[i].id()).length === 0) continue;
			this.cy.add({
				group: 'edges',
				data: { id: "1-" + outgoers[i].id(), source: "1", target: outgoers[i].id() }
			});
		}
		console.log(commands);
		this.refreshLayout();

		let animationPromise = new Promise((resolve, reject) => {

			this.props.dispatch({
				type: actions.ANIMATION_START,
			});

			resolve(commands);
		});
		animationPromise.then(commands => {
			//this.cy.autolock(true);
			setTimeout(this.executeAnimation, 1000/this.props.speed, commands);
		});
	}

	changeArray(values: Array<number>){
		this.pushState();

		this.cy.nodes().forEach((node:CytoscapeElement) => {
			this.cy.remove(node);
		});
		this.heap.clear();
		for(let i = 1; i < values.length; i++){
			this.heap.push(values[i]);
			this.addNode((i).toString(), values[i]);
		}
		for(let i = 1; 2*i < values.length; i++){
			const left = 2*i, right = 2*i + 1;
			this.cy.add({
				group: 'edges',
				data: {
					id:  (i).toString() + '-' + (left).toString(),
					source: (i).toString(),
					target: (left).toString(),
				}
			});
			if(right < values.length){
				this.cy.add({
					group: 'edges',
					data: {
						id:  (i).toString() + '-' + (right).toString(),
						source: (i).toString(),
						target: (right).toString(),
					}
				});
			}
		}
		this.refreshLayout();
	}
	render() {
		return (
			<>
				<InputHeapModal 
					show={this.state.show}
					changeArray = {(values: Array<number>) => this.changeArray(values)}
					handleClose = {() => this.setState({show: false})}
				/>
				<InputModal 
					show={this.state.showInsertModal} 
					handleClose = {() => this.setState({showInsertModal: false})}
					callback = {(v:number) => this.insert(v)}
				/>
				<div id="canvas" className='standard-struct'/>
			</>
		);
	}
}

export default connect(mapStateToProps)(Heap);