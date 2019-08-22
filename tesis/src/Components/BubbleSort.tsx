import React from 'react';
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { Container, Row } from 'react-bootstrap';
import ControlBar from './ControlBar';
import Bubblesort from '../Algorithms/BubbleSort';
import actions from '../Actions/actions';
import MediaRecorder from '../utils/MediaRecorder';
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
const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
    speed: state.speed,
  }
}

class BubbleSort extends React.Component<Props> {
	_isMounted = false;
	
	_mediaRecorder = new MediaRecorder();

  cy = cytoscape();

  values = [1,4,8,1,4,3,6,9,10,-1];

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
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
    });
    this.cy.center();
    this.layout.run();
    
		this.props.dispatch({
			type: this.props.action,
    })
    
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
    this.cy.center();

	}
  
  addNode = (id: string, value: number) => {
    this.cy.add({
      group: 'nodes',
      data: {
        id,
        value,
      },
      position:{
        x: parseInt(id, 10)*35,
        y: 0,
      }
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
				let { eles, style, duration, data, line} = commands[pos++];
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
				if(this._isMounted && line != null){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {
							line,
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

  runButton = () => {
    this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
    console.log(this.values);
    for(let i = 0; i < this.values.length; i++){
      this.addNode(i.toString(), this.values[i]);
      this.refreshLayout();
    }
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => { 
      this.props.dispatch({
        type: actions.ANIMATION_START,
      })
      const commands = Bubblesort(this.values);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      setTimeout(this.executeAnimation, 1000/this.props.speed, commands);
    })
   
	}
  render(){
    return (
			<Container fluid={true}>
				<Row id="canvas" />
				<ControlBar
					run={this.runButton}
				/>
				<button onClick={() => this._mediaRecorder.takePicture(this.cy)}>Test picture</button>
				<button onClick={() => this._mediaRecorder.takeGif(this.cy)}>Test gif</button>
			</Container>
		)
  }
}

export default connect(mapStateToProps)(BubbleSort);