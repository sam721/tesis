import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import Bubblesort from '../Algorithms/BubbleSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
import InputArrayModal from './InputArrayModal';
import processCommands from '../Processing/graph-processing';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

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

type State = {
	show: boolean,
	values: Array<number>,
}

type stackState = Array<number>;

const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
		speed: state.speed,
		paused: state.paused,
  }
}


class BubbleSort extends React.Component<Props, State> {
	_isMounted = false;
	
	_mediaRecorder = new MediaRecorder();

  cy = cytoscape();

	undo:Array<stackState> =[];
	redo:Array<stackState> =[];

	state = {
		show: false,
		values: [1,4,8,1,4,3,6,9,10,-1],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	options:Array<{name: string, run: () => void}>;
	buffer:Array<{elements:Array<Object>, lines: Array<number>, duration: number}> = [];
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
	
	animationTimeout = 0;
	step = 0;
  componentDidMount() {

		this._isMounted = true;
		
		this.initialize([]);
		this.valuesToGraph();

		this.props.dispatch({
			type: this.props.action,
			payload:{
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				options: this.options,
				undo: this.handleUndo,
				redo: this.handleRedo,
				rewind: this.handleRewind,
				forward: this.handleForward,
				repeat: this.handleRepeat,
				pause: this.handlePauseContinue,
			}
    })
		

	}
	
	componentDidUpdate(prevProps: Props, prevState: State){
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

	componentWillUnmount(){
    this.props.dispatch({
      type: actions.ANIMATION_END,
    });
		clearTimeout(this.animationTimeout);
    this._isMounted = false;
		let nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			let id = node.id();
			let popper = document.getElementById(id + 'popper');
			if (popper) {
				document.body.removeChild(popper);
			}
		});
	}
	
	initialize(elements: Array<Object>){
    this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements,

			style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: {
            ...Styles.NODE,
            shape: 'square',
          }
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

		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
    });
    this.layout.run();
	}

	handleUndo = () => {
		console.log('UNDO');
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
	
	handleRewind = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.max(this.step-1, 0);
		this.loadGraph(this.buffer[this.step].elements);
	}

	handleForward = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.min(this.step+1, this.buffer.length-1);
		this.loadGraph(this.buffer[this.step].elements);
	}

	handleRepeat = () => {
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = 0;
		this.loadGraph(this.buffer[0].elements);
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
	
	pushState(){
		this.redo = [];
		this.undo.push([...this.state.values]);
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
		})
		this.cy.edges().forEach((edge:CytoscapeElement) => {
			const style = edge.data('style');
			if(style != null) edge.style(style);
		})
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
    this.layout = this.cy.elements().makeLayout({ name: 'preset' });
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
  }
  
  animation(){
		let step = () => {
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
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			if(this.props.paused) return;
			this.loadGraph(elements);
			this.refreshLayout();
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
		this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
    for(let i = 0; i < values.length; i++){
      this.addNode(i.toString(), values[i]);
      this.refreshLayout();
    }
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
			return;
		}
    new Promise((resolve: () => void, reject) => { 
      this.props.dispatch({
        type: actions.ANIMATION_START,
      })
			const commands = Bubblesort(this.state.values);
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

export default connect(mapStateToProps)(BubbleSort);