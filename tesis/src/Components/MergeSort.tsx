import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import InputArrayModal from './InputArrayModal';
import Mergesort from '../Algorithms/MergeSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
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
}

type Props = {
  action: string,
  animation: boolean,
  speed: number,
  dispatch: (action: Object) => Object,
}
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

  state = {
		show: false,
		values: [1,4,8,1,4,3,6,9,10,-10],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
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
			pixelRatio: '1.0'
		});

		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout(layoutOptions);
    this.layout.run();
    
		this.props.dispatch({
			type: this.props.action,
    })
		
		this.initialize();
	}
	
	componentDidUpdate(_prevProps:Props, prevState:State){
		layoutOptions.animationDuration = 500/this.props.speed;
		if(prevState.values !== this.state.values){
			this.initialize();
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
	
  refreshLayout() {
		this.layout.stop();
    this.layout = this.cy.elements().makeLayout(layoutOptions);
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
				y: this.cy.height()/2,
			},
		});
		layoutOptions.positions[id] = {
			x: this.cy.width()/2 - (this.state.values.length-1)*(35/2) + 35*(parseInt(id)),
			y: this.cy.height()/2,
		}
  }
  
  executeAnimation = (commands: Array<AnimationStep>) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});
    
		let animation = () => {
			let pos = 0;
			let step = () => {
				if (pos === commands.length || !this.props.animation) {
					this.cy.nodes().style(this.nodeStyle);
					this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					this.refreshLayout();
					return;
				}
        let {nodes, duration, lines, style, positions} = commands[pos++];
        if(nodes){
					console.log(nodes);
          nodes.forEach((node, index) => {
						let ele = this.cy.getElementById(node.id);
						ele.style({visibility: 'visible'})
						if(style) ele.style(style[index]);
						if(positions) layoutOptions.positions[node.id] = positions[index];
          })
				}
				if(this._isMounted && lines != null){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {lines},
					});
				}
				this.refreshLayout();
				console.log(this.cy.nodes());
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
      const commands = Mergesort(this.state.values, this.cy.width(), this.cy.height());
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
					changeArray={this.changeArray}
					currentValues={this.state.values}
				/>
				<Container fluid={true}>
					<Row id="canvas" />
					<ControlBar
						run={this.runButton}
					/>
					<button onClick={() => this._mediaRecorder.takePicture(this.cy)}>Test picture</button>
					<button onClick={() => this._mediaRecorder.takeGif(this.cy)}>Test gif</button>
					<button onClick={() => this.setState({show: true})}>Change array</button>
				</Container>
			</>
		)
  }
}

export default connect(mapStateToProps)(BubbleSort);