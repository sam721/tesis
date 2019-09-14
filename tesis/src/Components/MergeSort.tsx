import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import InputArrayModal from './InputArrayModal';
import Mergesort from '../Algorithms/MergeSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
import processCommands from '../Processing/mergesort-processing';
import { node } from 'prop-types';
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

type stackState = Array<number>;

type State = {
	show: boolean,
	values: Array<number>,
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

class MergeSort extends React.Component<Props, State> {
	_isMounted = false;
	_mediaRecorder = new MediaRecorder();
  cy = cytoscape();

  state = {
		show: false,
		values: [4, 8, 12, 16, 10, 4, 45, 17],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = {...Styles.NODE, shape: 'square', zIndex: 2};

	options:Array<{name: string, run: () => void}>;

	buffer:Array<{elements:Array<Object>, lines: Array<number>, duration: number}> = [];

	undo:Array<stackState> = [];
	redo:Array<stackState> = [];

	step = 0;
	animationTimeout = 0;
	constructor(props:Props){
    super(props);
		this._mediaRecorder = new MediaRecorder(props.dispatch);
		this.options = [
			{
				name: 'Ordenar',
				run: this.runButton,
			},
			{
				name: 'Cambiar arreglo',
				run: () => this.setState({show: true}),
			}
		]
	}
	
  componentDidMount() {

		this._isMounted = true;
				
		this.initialize([]);
		this.valuesToGraph();

		this.props.dispatch({
			type: this.props.action,
			payload: {
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				options: this.options,
				undo: this.handleUndo,
				redo: this.handleRedo,
				rewind: this.handleRewind,
				forward: this.handleForward,
				pause: this.handlePauseContinue,
				repeat: this.handleRepeat,
			}
    })
	}
	
	componentDidUpdate(prevProps:Props, prevState:State){
		layoutOptions.animationDuration = 500/this.props.speed;
		if(prevState.values !== this.state.values){
			this.clearGraph();
			this.valuesToGraph();
		}
		if(prevProps.animation && !this.props.animation){
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: { options: this.options}
			});
		}else if(!prevProps.animation && this.props.animation){
			this.props.dispatch({
				type: actions.CHANGE_OPTIONS,
				payload: { options: [{name: 'Volver a edicion', run: this.runButton}]}
			});
		}
	}
	
	componentWillUnmount() {
		this.props.dispatch({
			type: actions.ANIMATION_END,
		});
		clearTimeout(this.animationTimeout);
		this._isMounted = false;
  }
	
	initialize(elements: Array<Object>){
		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements: JSON.parse(JSON.stringify(elements)),

			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: this.nodeStyle,
				},
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
			pixelRatio: '1.0',
			autoungrabify: true,
		});
		layoutOptions.positions = {};
		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout(layoutOptions);
    this.layout.run();
		//this.refreshLayout();
	}

	handleUndo = () => {
		if(this.undo.length === 0) return;

		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			})
			return;
		}
		const prevValues = this.undo.pop();
		this.redo.push([...this.state.values]);
		if(prevValues) this.changeArray(prevValues);
	}

	handleRedo = () => {
		if(this.redo.length === 0) return;

		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			})
			return;
		}
		const prevValues = this.redo.pop();
		this.undo.push([...this.state.values]);
		if(prevValues) this.changeArray(prevValues);
	}

	pushState(){
		this.redo = [];
		this.undo.push([...this.state.values]);
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
	
	loadGraph(elements:Array<Object>){
		const nodes = this.cy.nodes();
		nodes.forEach((node:CytoscapeElement) => {
			this.cy.remove(node);
		})

		for(let i = 0; i < elements.length; i++){
			this.cy.add(elements[i]);
		}
		
		this.cy.nodes().forEach((node:CytoscapeElement) => {
			const style = node.data('style');
			if(style != null) node.style(style);
			const position = node.data('position');
			//console.log("PREV", node.position());
			//console.log("NEXT", position);
			if(position != null){
				layoutOptions.positions[node.id()] = JSON.parse(JSON.stringify(position));
			}
		})
		
		this.cy.edges().forEach((edge:CytoscapeElement) => {
			const style = edge.data('style');
			if(style != null) edge.style(style);
		})
		
		this.refreshLayout();
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
						zIndex: node.style('z-index'),
						backgroundColor: node.style('background-color'),
						borderWidth: node.style('border-width'),
						width: node.style('width'),
						height: node.style('height'),
						visibility: node.style('visibility'),
					} : {}),
				},
				position: {
					x: node.position().x,
					y: node.position().y,
				}
			})
		});
		return elements;
	}

  refreshLayout() {
		this.layout.stop();
    this.layout = this.cy.elements().makeLayout({...layoutOptions, animate: true});
    this.layout.run();
	}
  
  addNode = (id: string, value: number | string) => {
    this.cy.add({
      group: 'nodes',
      data: {
        id,
        value,
			},
			position: {
				x: this.cy.width()/2 - (this.state.values.length-1)*(35/2) + 35*(parseInt(id)),
				y: this.cy.height()/4,
			},
		});
		layoutOptions.positions[id] = {
			x: this.cy.width()/2 - (this.state.values.length-1)*(35/2) + 35*(parseInt(id)),
			y: this.cy.height()/4,
		}
  }
	
	addShadow = (id: string, position: {x: number, y: number}) => {
		this.cy.add({
			group: 'nodes',
			data: { id },
			style: {'z-index': 1},
			position,
		});
		layoutOptions.positions[id] = position;
	}

  animation(){
		let step = () => {
			console.log(this.props.paused);
			if (this.step === this.buffer.length) {
				
				this.props.dispatch({
					type: actions.ARRAY_SORTED_SUCCESS,
				});

				this.props.dispatch({
					type: actions.ANIMATION_PAUSE,
				});

				return;
			}
			if(!this.props.animation){
				this.cy.nodes().style(this.nodeStyle);
				return;
			}
			const {elements, lines, duration} = this.buffer[this.step++];
			if(this.props.paused) return;
			this.loadGraph(elements);
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			console.log(duration);
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
		}
		step();
	}

  executeAnimation = (commands: Array<AnimationStep>, found?:boolean) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
		
		this.props.dispatch({
			type: actions.STARTING_BUBBLESORT_INFO,
		});
		this.step = 0;
		this.animation();
  }

	valuesToGraph(){
		const {values} = this.state;
    for(let i = 0; i < values.length; i++){
      this.addNode(i.toString(), values[i]);
		}
		this.refreshLayout();

	}

	clearGraph(){
		const nodes = this.cy.nodes();
		for(let i = 0; i < nodes.length; i++){
			this.cy.remove('node[id="'+nodes[i].id()+'"]');
		}
	}
	runButton = () => {
    if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_END,
			});
			this.clearGraph();
			this.valuesToGraph();
			clearTimeout(this.animationTimeout);
			return;
		}
    new Promise((resolve: () => void, reject) => { 
      this.props.dispatch({
        type: actions.ANIMATION_START,
      })
			const commands = Mergesort(this.state.values, this.cy.width(), this.cy.height());
			this.buffer = processCommands(this.exportGraph(), commands);     
			resolve();
    }).then(()=> {
      setTimeout(this.executeAnimation, 1000/this.props.speed);
    })
	}
	handleClose = () => {
		this.setState({show: false});
	}

	changeArray = (values: Array<number>) => {
		this.setState({values});
	}

  render(){
    return (
			<>
				<InputArrayModal 
					show={this.state.show} 
					handleClose={this.handleClose} 
					changeArray={(v:Array<number>) => {this.pushState(); this.changeArray(v)}}
					currentValues={this.state.values}
				/>
				<div id="canvas" className='standard-struct'/>
			</>
		)
  }
}

export default connect(mapStateToProps)(MergeSort);