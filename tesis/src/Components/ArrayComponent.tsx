import React from 'react';
import { CytoscapeElement, AnimationStep } from '../Types/types';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
import InputArrayModal from './InputArrayModal';
import InputModal from './InputModal';
import BinarySearchAlgo from '../Algorithms/BinarySearch';
import Sort from '../Algorithms/BubbleSort-util';
import processCommands from '../Processing/graph-processing';
import processCommandsMerge from '../Processing/mergesort-processing';
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
  execute: (param: Object) => Array<AnimationStep>,
  process: (graph: Array<Object>, commands: Array<AnimationStep>) => Array<{elements: Array<Object>, lines: Array<number>, duration: number}>,
}

type stackState = Array<number>;

type State = {
  show: boolean,
  showInputModal: boolean,
	values: Array<number>,
}

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

const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
		speed: state.speed,
		paused: state.paused,
  }
}

class ArrayComponent extends React.Component<Props, State> {
	_isMounted = false;
	
	_mediaRecorder = new MediaRecorder();

  cy = cytoscape();

	undo:Array<stackState> = [];
	redo:Array<stackState> = [];

	state = {
    show: false,
    showInputModal: false,
		values: [6,8,1,2,4,3,7,5],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	options:Array<{name: string, run: () => void}>;
	buffer: Array<{elements: Array<Object>, lines: Array<number>, duration: number}> = [];
	animationTimeout = 0;
  step = 0;
  found = false;
	constructor(props:Props){
    super(props);
		this._mediaRecorder = new MediaRecorder(props.dispatch);
		this.options = [
			{
				name: (this.props.action === actions.SELECT_BINARY_SEARCH ? "Buscar" : "Ordenar"),
        run: this.props.action === actions.SELECT_BINARY_SEARCH 
            ?  () => this.setState({showInputModal: true})
            :  () => this.runButton(),
        
			},
			{
				name: 'Cambiar arreglo',
				run: () => this.setState({show: true}),
			}
    ]
    if(props.action === actions.SELECT_BINARY_SEARCH){
      this.state.values = [1,2,3,4,5,6,7,8];
    }
	}
	
  componentDidMount() {

		this._isMounted = true;
		
    
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
				pause: this.handlePauseContinue,
				repeat: this.handleRepeat,
				end: this.handleEnd,
			}
    })
		
		this.initialize([]);
		this.valuesToGraph();
	}
	
	componentDidUpdate(prevProps: Props, prevState: State){
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
	componentWillUnmount(){
    this.props.dispatch({
      type: actions.ANIMATION_END,
    });
    
		this._isMounted = false;
		clearTimeout(this.animationTimeout);
		let nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			let id = node.id();
			let popper = document.getElementById(id + 'popper');
			if (popper) {
				document.body.removeChild(popper);
			}
		});
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
	
	pushState(){
		this.redo = [];
		this.undo.push([...this.state.values]);
	}

  loadGraph(elements: Array<Object>, keep=false) {
    const nodes = this.cy.nodes();
    const positions:{[id:string]:{x:number,y:number}} = {};
		nodes.forEach((node: CytoscapeElement) => {
      if(keep) positions[node.id()] = JSON.parse(JSON.stringify(node.data('position')));
			this.cy.remove(node);
		})

		for (let i = 0; i < elements.length; i++) {
			this.cy.add(JSON.parse(JSON.stringify(elements[i])));
		}

		this.cy.nodes().forEach((node: CytoscapeElement) => {
			const style = node.data('style');
			if (style != null) node.style(style);
      const position = node.data('position');
      if(keep && positions[node.id()]) node.position({x:positions[node.id()].x, y:positions[node.id()].y});
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
				x: this.cy.width()/2 - (this.state.values.length-1)*(40/2) + 40*(parseInt(id)),
				y: this.cy.height()/4,
			},
		});
		layoutOptions.positions[id] = {
			x: this.cy.width()/2 - (this.state.values.length-1)*(40/2) + 40*(parseInt(id)),
			y: this.cy.height()/4,
		}
  }
	
	animation(){
		let step = () => {
			if(!this.props.animation){
				this.cy.nodes().style(this.nodeStyle);
				return;
			}
			if (this.step === this.buffer.length) {
        if(this.props.action === actions.SELECT_BINARY_SEARCH){
          this.props.dispatch({
            type: this.found ? actions.BINARY_SEARCH_FOUND_SUCCESS : actions.BINARY_SEARCH_NOT_FOUND_INFO,
          });
        }else{
          this.props.dispatch({ type: actions.ARRAY_SORTED_SUCCESS});
        }
				this.props.dispatch({
					type: actions.ANIMATION_PAUSE,
				});
				return;
			}

			if(this.props.paused) return;
			const {elements, lines, duration} = this.buffer[this.step++];
      this.loadGraph(elements);
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
		}
		step();
	}
  executeAnimation = () => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
		
		this.props.dispatch({
			type: actions.STARTING_BINARY_SEARCH_INFO,
		});
		this.step = 0;
		this.animation();
  }

	valuesToGraph(){
		const {values} = this.state;
		this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
    for(let i = 0; i < values.length; i++){
      this.addNode(i.toString(), values[i]);
    }
    this.refreshLayout();
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
	clearGraph(){
		const nodes = this.cy.nodes();
		for(let i = 0; i < nodes.length; i++){
			this.cy.remove('node[id="'+nodes[i].id()+'"]');
		}
	}
  runButton = (value?:number) => {
    if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_END,
      });
      clearTimeout(this.animationTimeout);
			this.clearGraph();
			this.valuesToGraph();
			return;
		}
    new Promise((resolve, reject) => { 
      this.props.dispatch({
        type: actions.ANIMATION_START,
      })
      let param = {};
      if(this.props.action === actions.SELECT_BINARY_SEARCH){
        param = {values: this.state.values, value}
      }else if(this.props.action === actions.SELECT_BUBBLESORT){
        param = {values: this.state.values}
      }else{
        param = {values: this.state.values, width: this.cy.width(), height: this.cy.height()}
      }
			const commands = this.props.execute(param);
			this.buffer = this.props.process(this.exportGraph(), commands);
      this.found = this.cy.nodes('[value = '+value+']').length > 0;
      resolve();
    }).then(() => {
      setTimeout(this.executeAnimation, 1000/this.props.speed);
    })
	}

	handleClose = () => {
		this.setState({show: false});
	}
	

	changeArray = (values: Array<number>) => {
    if(this.props.action === actions.SELECT_BINARY_SEARCH){
      const sorted = Sort(values);
      this.setState({values: sorted});
    }else this.setState({values});
	}

  render(){
    return (
			<>
        <InputModal
          show={this.state.showInputModal}
          handleClose={()=>this.setState({showInputModal: false})}
          callback={(v:number)=>this.runButton(v)}
          currentValue={0}
        />
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

export default connect(mapStateToProps)(ArrayComponent);