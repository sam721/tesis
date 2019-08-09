import React from 'react';
import actions from '../Actions/actions';

import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import TreeBar from './TreeBar';
import { Row, Container} from 'react-bootstrap';
import PriorityQueue from '../Algorithms/DS/PriorityQueue'

import HeapArray from './HeapArray';
import { number, string } from 'prop-types';
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
	values: Array<Element>,
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

	state = {
		values: [{value: 0, class: 'heap-default'}],
	}

	layout = {
		run: () => { },
		stop: () => { },
	};

	nodeStyle = Styles.NODE;
	edgeStyle = Styles.EDGE;
	cy = cytoscape();

	heap = new PriorityQueue((x, y) => x <= y);

	componentDidMount() {

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
			wheelSensitivity: 1,
			pixelRatio: '1.0',

		});

		this.layout = this.cy.elements().makeLayout(layoutOptions);
		this.layout.run();
		this.props.dispatch({
			type: this.props.action,
		})
	}

	removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
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
					this.cy.edges().style(this.edgeStyle);
					
					let {values} = this.state;

					values = values.map(ele => { return {...ele, class:'heap-default'}});
					this.setState({values});

					this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					this.refreshLayout();
					return;
				}
				let { eles, style, duration, data, classes} = commands[pos++];
				if (style) {
					eles.forEach((ele, index) => {
						this.cy.getElementById(ele).style(style[index]);
					});
				}

				const {values} = this.state;

				eles.forEach((ele, index) => {
					if(data !== undefined){
						this.cy.getElementById(ele).data(data[index]);
						const id = parseInt(ele, 10);
						const {values} = this.state;
						values[id].value = data[index].value;
						this.setState({values});
					}
					if(classes !== undefined){
						const id = parseInt(ele, 10);
						values[id].class = classes[index];
					}
				})
				this.setState({values});
				this.refreshLayout();
				setTimeout(step, ((duration === undefined) ? 1000 : duration)/this.props.speed);
			}
			step();
		}
		animation();
	}

	refreshLayout() {
		this.layoutProcessing();
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout(layoutOptions);
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
			if (node.outgoers('node').length) setSep(node.outgoers('node')[0], nx - sep, ny + 50, sep / 2);
			if (node.outgoers('node').length === 2) setSep(node.outgoers('node')[1], nx + sep, ny + 50, sep / 2);
		}
		const vw = this.cy.width(), vh = this.cy.height();
		setSep(this.cy.getElementById("1"), vw / 2, vh / 4, sep);
		return true;
	}

	insert(val = 0) {
		if(this.props.animation) return;
		let commands:Array<AnimationStep> = [];
		if(this.cy.nodes().length === 31) return;
		if (this.cy.nodes().length === 0) {
			this.cy.add({
				group: 'nodes',
				data: { id: "1", value: val },
				grabbable: false,
				pannable: false,
			})
			commands = this.heap.push(val, true);
		} else {
			let nodeId = this.cy.nodes().length + 1;
			console.log(nodeId);
			let src = this.cy.getElementById(Math.floor(nodeId / 2).toString());
			this.cy.add(
				{
					group: 'nodes',
					data: { id: nodeId.toString(), value: val },
					grabbable: false,
					pannable: false,
				},
			)
			this.cy.add(
				{
					group: 'edges',
					data: { id: src.id() + '-' + nodeId.toString(), source: src.id(), target: nodeId.toString() }
				}
			)
			commands = this.heap.push(val, true);
		}

		const {values} = this.state;
		values.push({value: val, class: 'heap-default'});
		this.setState({values});

		this.refreshLayout();
		let animationPromise = new Promise((resolve, reject) => {

			this.props.dispatch({
				type: actions.ANIMATION_START,
			});

			resolve(commands);
		});
		animationPromise.then(commands => {
			//this.cy.autolock(true);
			setTimeout(this.executeAnimation, 1000, commands);
		});
	}

	remove() {
		if(this.props.animation) return;
		const n = this.cy.nodes().length;
		if (n === 0) return;
		const outgoers = this.cy.getElementById("1").outgoers('node');
		this.removeNode("1");
		let commands:Array<AnimationStep> = [];

		const {values} = this.state;
		const lastValue = values[n];
		values.pop();
		if(n > 0) values[1] = lastValue;
		this.setState({values});

		if (n === 1) return;

		const position = this.cy.getElementById(n.toString()).position();
		const value = this.cy.getElementById(n.toString()).data('value');
		this.removeNode(n.toString());

		this.cy.add({
			group: 'nodes',
			data: { id: "1", value },
			position,
		});

		for (let i = 0; i < outgoers.length; i++) {
			if (this.cy.getElementById(outgoers[i].id()).length === 0) continue;
			this.cy.add({
				group: 'edges',
				data: { id: "1-" + outgoers[i].id(), source: "1", target: outgoers[i].id() }
			});
		}
		commands = this.heap.pop(true);
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
			setTimeout(this.executeAnimation, 1000, commands);
		});
	}
	render() {
		const cols = new Array(32).fill(<td style={{borderStyle: 'solid', borderWidth: '2px', textAlign: 'center', width:'3.125%'}}/>);
		cols[0] = <td style={{borderStyle: 'solid', borderWidth: '2px', textAlign: 'center', width: '3.125%'}}>1</td>

		return (
			<Container fluid={true}>
				<Row id="canvas" />
				<HeapArray array={this.state.values}/>
				<TreeBar insert={(v: number) => this.insert(v)} remove={() => this.remove()} />
			</Container>
		);
	}
}

export default connect(mapStateToProps)(Heap);