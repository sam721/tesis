import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import Bubblesort from '../Algorithms/BubbleSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
import InputArrayModal from './InputArrayModal';
import InputModal from './InputModal';
import BinarySearch from '../Algorithms/BinarySearch';
import Sort from '../Algorithms/BubbleSort-util';
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
  showInputModal: boolean,
	values: Array<number>,
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
    showInputModal: false,
		values: [1,2,3,4,5,6,7,8],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	constructor(props:Props){
    super(props);
    this._mediaRecorder = new MediaRecorder(props.dispatch);
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
    this.cy.center();
    this.layout.run();
    
		this.props.dispatch({
			type: this.props.action,
			payload:{
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				options: [
					{
						name: 'Buscar',
						run: () => this.setState({showInputModal: true}),
					},
					{
						name: 'Cambiar arreglo',
						run: () => this.setState({show: true}),
					}
				],
			}
    })
		
		this.initialize();
	}
	
	componentDidUpdate(prevProps: Props, prevState: State){
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
				x: this.cy.width()/3 - (this.state.values.length-1)*(35/2) + 35*(parseInt(id)),
				y: this.cy.height()/4,
			},
		});
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
				let { eles, style, duration, data, lines} = commands[pos++];
				if (style) {
					eles.forEach((ele, index) => {
						this.cy.getElementById(ele).style(style[index]);
					});
				}
				eles.forEach((ele, index) => {
					if(data !== undefined){
						this.cy.getElementById(ele).data(data[index]);
					}
				});
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
    const {values} = this.state;
		this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
    for(let i = 0; i < values.length; i++){
      this.addNode(i.toString(), values[i]);
      this.refreshLayout();
    }
	}

  runButton = (value:number) => {
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
      const commands = BinarySearch(this.state.values, value);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      setTimeout(this.executeAnimation, 1000/this.props.speed, commands);
    })
	}

	handleClose = () => {
		this.setState({show: false});
	}
	

	changeArray = (values: Array<number>) => {
    const sorted = Sort(values);
		this.setState({values: sorted});
	}

  render(){
    return (
			<Container fluid={true}>
        <InputModal
          show={this.state.showInputModal}
          handleClose={()=>this.setState({showInputModal: false})}
          callback={(v:number)=>this.runButton(v)}
          currentValue={0}
        />
				<InputArrayModal 
					show={this.state.show} 
					handleClose={this.handleClose} 
					changeArray={this.changeArray}
					currentValues={this.state.values}
				/>
				<div id="canvas" className='standard-struct'/>
			</Container>
		)
  }
}

export default connect(mapStateToProps)(BubbleSort);