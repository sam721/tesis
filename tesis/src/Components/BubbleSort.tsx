import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import Bubblesort from '../Algorithms/BubbleSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
import InputArrayModal from './InputArrayModal';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

type storeState = {
	animation: string,
	speed: number,
}

type Props = {
	action: string,
  animation: boolean,
  speed: number,
  dispatch: (action: Object) => Object,
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
		this.cy = cytoscape({

			container: document.getElementById('canvas'), // container to render in

			elements: [
			],

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
			wheelSensitivity: 1,
			pixelRatio: '1.0',
			autoungrabify: true,
		});

		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
    });
    this.layout.run();
    
		this.props.dispatch({
			type: this.props.action,
			payload:{
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				options: this.options,
				undo: this.handleUndo,
				redo: this.handleRedo,
			}
    })
		
		this.initialize();
	}
	
	componentDidUpdate(prevProps: Props, prevState: State){
		if(prevState.values !== this.state.values){
			this.initialize();
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

	pushState(){
		this.redo = [];
		this.undo.push([...this.state.values]);
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
  
  executeAnimation = (commands: Array<AnimationStep>) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
		
		this.props.dispatch({
			type: actions.STARTING_BUBBLESORT_INFO,
		});

		let animation = () => {
			let pos = 0;
			let step = () => {
				if(!this.props.animation){
					this.cy.nodes().style(this.nodeStyle);
					return;
				}
				if (pos === commands.length) {
					this.cy.nodes().style(this.nodeStyle);
					this.props.dispatch({
						type: actions.ARRAY_SORTED_SUCCESS,
					});
					this.refreshLayout();
					return;
				}
				let { eles, style, duration, data, lines} = commands[pos++];
				if (eles) {
					eles.forEach((ele, index) => {
						if(style) this.cy.getElementById(ele).style(style[index]);
					});
					eles.forEach((ele, index) => {
						if(data !== undefined){
							this.cy.getElementById(ele).data(data[index]);
						}
					});
				}
				
				if(this._isMounted && lines != null){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {
							lines,
						}
					})
				}
				this.refreshLayout();
				setTimeout(step, ((duration === undefined) ? 1000/this.props.speed : duration)/this.props.speed);
			}
			step();
		}
		animation();
  }

	initialize(){
		this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
    for(let i = 0; i < this.state.values.length; i++){
      this.addNode(i.toString(), this.state.values[i]);
      this.refreshLayout();
    }
	}

  runButton = () => {
    if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_END,
			});
			this.initialize();
			return;
		}
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => { 
      this.props.dispatch({
        type: actions.ANIMATION_START,
      })
      const commands = Bubblesort(this.state.values);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      setTimeout(this.executeAnimation, 1000/this.props.speed, commands);
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