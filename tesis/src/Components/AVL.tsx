import React from 'react';
import actions from '../Actions/actions';

import downloadGif from '../utils/gifshot-utils'
import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import TreeBar from './TreeBar';
import InputModal from './InputModal';
import InputAVLModal from './InputAVLModal';
import { Row, Container } from 'react-bootstrap';
import PriorityQueue from '../Algorithms/DS/PriorityQueue'

import HeapArray from './HeapArray';
import { number, string } from 'prop-types';

import {isLeaf, getChildren, getHeight, lca, parseAVL} from '../utils/avl-utils';
import {edgeId} from '../utils/cy-utils';
import MediaRecorder from '../utils/MediaRecorder';
import {remove, insert, balance, search} from '../resources/pseudocodes/avl';
import AVLProcessor from '../Processing/avl-proccesing';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');
const popper = require('cytoscape-popper');

cytoscape.warnings(false);
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

type exportStep = {
  elements: Array<Object>
  lines: Array<number>,
  duration: number,
  pseudo?: Array<Object>,
  treeRoot: string,
  refresh?: boolean,
}

type storeState = {
  animation: string,
  selection: Object,
  speed: number,
  paused: boolean,
}

type Element = {
  value: number,
  class: string,
}

type State = {
  show: boolean,
  showSearchModal: boolean,
  showInsertModal: boolean,
  showRemoveModal: boolean,
}

type stackState = {
  root: string,
  elements: Array<Object>,
}

type Props = {
  action: string,
  animation: boolean,
  speed: number,
  selection: {
		type: string,
		id: string,
		weight: string,
  }
  paused: boolean,
  dispatch: (action: Object) => Object,
}

const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
    speed: state.speed,
    selection: state.selection,
    paused: state.paused,
  }
}

class AVL extends React.Component<Props, State>{

  _isMounted = false;
  _mediaRecorder = new MediaRecorder();
  layout = {
    run: () => { },
    stop: () => { },
  };

  treeRoot = "";

  state = {
    show: false,
    showSearchModal: false,
    showInsertModal: false,
    showRemoveModal: false,
  }

  undo:Array<stackState>=[];
  redo:Array<stackState>=[];

  nodeStyle = Styles.NODE;
  edgeStyle = Styles.EDGE;
  AVLProcessor:any;
  cy = cytoscape();

  buffer:Array<exportStep> = [];
  options: Array<{ name: string, run: () => void }>;

  step = 0;
  animationTimeout = 0;
  constructor(props:Props){
    super(props);
    this._mediaRecorder = new MediaRecorder(props.dispatch);
    this.options = [
      {
        name: 'Insertar',
        run: () => this.setState({showInsertModal: true}),
      },
      {
        name: 'Eliminar',
        run: () => this.setState({showRemoveModal: true}),
      },
      {
        name: 'Buscar',
        run: () => this.setState({showSearchModal: true}),
      },
      {
        name: 'Limpiar canvas',
        run: this.clearGraph,
      },
      {
        name: 'Subir AVL',
        run: () => this.setState({show: true}),
      },
      {
        name: 'Descargar AVL',
        run:  () => parseAVL(this.cy.getElementById(this.treeRoot)),
      }
    ];
  }
  
  componentDidMount() {
    this._isMounted = true;
    this.initialize({ root: '', elements: []});
    this.AVLProcessor = new AVLProcessor(this.cy.width(), this.cy.height());
    this.props.dispatch({
      type: this.props.action,
      payload:{
        photo: () => this._mediaRecorder.takePicture(this.cy),
        gif: () => this._mediaRecorder.takeGif(this.cy),
        undo: this.handleUndo,
        redo: this.handleRedo,
        options: this.options,
        rewind: this.handleRewind,
        forward: this.handleForward,
        pause: this.handlePauseContinue,
        repeat: this.handleRepeat,
      }
    })
  }

  initialize(state: stackState){
    const {root, elements} = state;    
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
    this.treeRoot = root;
		//this.cy.on('resize', () => { this.layoutProcessing(); this.refreshLayout(false)});
		this.layout = this.cy.elements().makeLayout({...layoutOptions, animate: false});
		this.layout.run();

    this.refreshLayout();
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
      this.redo.push({ root: this.treeRoot, elements: currentElements});
      this.treeRoot = state.root;
      this.loadGraph(state.elements);
      this.AVLProcessor.loadGraph(state.elements, state.root);
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
		  this.undo.push({ root: this.treeRoot, elements: currentElements});
      this.treeRoot = state.root;
      this.loadGraph(state.elements);
      this.AVLProcessor.loadGraph(state.elements, state.root);
    }
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

	exportGraph(){
		const elements:Array<Object> = [];
		this.cy.nodes().forEach((node:CytoscapeElement) => {
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
          value: node.data('value'),
          prev: node.data('prev'),
          height: node.data('height'),
          balance: node.data('balance'),
          style: node.style(),
          position: { x: node.position().x, y: node.position().y }
				},
				position: {
					x: node.position().x,
					y: node.position().y,
				}
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

	pushState(){
    console.log('pushed');
		this.redo = [];
		this.undo.push({root: this.treeRoot, elements: this.exportGraph()});
  }
  
  handleRewind = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
    this.step = Math.max(this.step-1, 0);
    const {treeRoot, elements, pseudo, lines} = this.buffer[this.step];
    this.treeRoot = treeRoot;
    this.loadGraph(elements, true);
    if(pseudo) this.props.dispatch({type: actions.CHANGE_PSEUDO, payload: { pseudo }});
    if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleForward = () => { 
		clearTimeout(this.animationTimeout);
    this.props.dispatch({type: actions.ANIMATION_PAUSE});
    this.step = Math.min(this.step+1, this.buffer.length-1);
    const {treeRoot, elements, pseudo, lines} = this.buffer[this.step];
    this.treeRoot = treeRoot;
    this.loadGraph(elements, true);
    if(pseudo) this.props.dispatch({type: actions.CHANGE_PSEUDO, payload: { pseudo }});
    if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleRepeat = () => {
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
    this.step = 0;
    const {treeRoot, elements, pseudo, lines} = this.buffer[this.step];
    this.treeRoot = treeRoot;
    this.loadGraph(elements, true);
    if(pseudo) this.props.dispatch({type: actions.CHANGE_PSEUDO, payload: { pseudo }});
    if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
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
  
  componentWillUnmount(){
    this.props.dispatch({
      type: actions.ANIMATION_END,
    });
    clearTimeout(this.animationTimeout);
    this._isMounted = false;

  }
  componentDidUpdate(prevProps:Props){
    layoutOptions.animationDuration = 500/this.props.speed;

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
                clearTimeout(this.animationTimeout);
                this.loadGraph(this.buffer[this.buffer.length-1].elements);
                this.treeRoot = this.buffer[this.buffer.length-1].treeRoot;
                this.props.dispatch({ type: actions.ANIMATION_END });
                console.log(getChildren(this.cy.getElementById(this.treeRoot)));
							}
						}]
				}
			});
		}
  }

  removeNodePopper(node: string) {
    this.cy.remove(this.cy.getElementById(node + '-popper'));
	}

  removeNode = (node: CytoscapeElement) => {
    let id = node.id();
    this.cy.remove(node);
    this.removeNodePopper(id);
  }
  
  removeEdge = (source: string, target: string) => {
    this.cy.remove('edge[id="'+edgeId(source, target)+'"]');
  }

  createPopper(nodeId: string){
		const ele = this.cy.getElementById(nodeId);
		const position = ele.position();
		this.cy.add({
			group: 'nodes',
			data: {id : nodeId+'-popper', value: 0},
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
  
  addNode = (id: string, value: number, height:number=0, balance:number=0, position:{x:number, y:number}={x:0,y:0}) => {
    this.cy.add({
      group: 'nodes',
      data: {
        id,
        value,
        height,
        balance,
      },
      position: {
        x: position.x,
        y: position.y,
      }
    });
    this.createPopper(id);
  }
  
  addEdge = (source: string, target: string) => {
    this.cy.add({
      group: 'edges',
      data: {
        id: edgeId(source, target), source, target,
      }
    });
    this.cy.getElementById(target).data('prev', source);
  }

  isLeaf(node: CytoscapeElement){
    return node.outgoers('node').length === 0;
  }

  getChildren(node: CytoscapeElement){
    let left = null, right = null;
    let outgoers = node.outgoers('node');

    if (outgoers.length >= 1) left = outgoers[0];
    if (outgoers.length === 2) right = outgoers[1];
    if (left != null && right != null && left.data('value') > right.data('value')) {
      [left, right] = [right, left];
    }else if(left != null && left.data('value') > node.data('value')){
      [left, right] = [right, left];
    }else if(right != null && right.data('value') < node.data('value')){
      [left, right] = [right,left];
    }

    return [left, right];
  }
  refreshLayout(animate:boolean = true) {
    this.layout.stop();
    this.layout = this.cy.elements().makeLayout({...layoutOptions, animate});
    this.layout.run();
  }

  propagate(node: CytoscapeElement | null, val: number){
    if(node == null) return;
    node.data('X', node.data('X') + val);
    const [left, right] = getChildren(node);
    if(left) this.propagate(left, val);
    if(right) this.propagate(right, val);
  }
  layoutProcessing() {

    if(this.treeRoot === '') return;
    const levels:{[lvl: number]: Array<string>} = {};

    const dfs = (node: CytoscapeElement, depth: number, x: number) => {
      console.log(node.data('value'));
      node.data('depth', depth);
      node.data('X', x);
      
      if(levels[depth] === undefined) levels[depth] = Array();
      levels[depth].push(node.id());

      let [left, right] = getChildren(node);
      let hleft = 0, hright = 0;
      if(left) hleft = dfs(left, depth+1, x-1);
      if(right) hright = dfs(right, depth+1, x+1);

      let bal = hright - hleft;
      let popper = this.cy.getElementById(node.id() + '-popper');
      popper.data('value', bal);
      return Math.max(hleft, hright)+1;
    }

    let height = dfs(this.cy.getElementById(this.treeRoot), 0, 0);
    let iter = 0;
    while(iter++ < 1000){
      let correct = true;
      for(let i = height-1; i >= 0; i--){
        const current = levels[i];
        for(let j = 0; j < current.length - 1; j++){
          const a = this.cy.getElementById(current[j]);
          const b = this.cy.getElementById(current[j+1]);
          if(a.data('X') + 1 >= b.data('X')){
            const anc = lca(this.cy, a, b);
            const [left, right] = getChildren(anc);
            const dif = Math.max(a.data('X') - b.data('X'), 1);
            this.propagate(left, -dif);
            this.propagate(right, dif);
            correct = false;
            break;
          }
        }
      }
      if(correct) break;
    }
    if(iter === 1001){
      console.error('ALERT, INFINITE LOOP AVOIDED');
    }

    const setSep = (node: CytoscapeElement, nx: number, ny: number) => {
      layoutOptions.positions[node.id()] = { x: node.data('X')*24 + nx, y: ny }
      layoutOptions.positions[node.id()+'-popper'] =  { x: node.data('X')*24 + nx, y: ny + 30};
      let [left, right] = getChildren(node);
      if (left) setSep(left, nx, ny + 50);
      if (right) setSep(right, nx, ny + 50);
    }

    const vw = this.cy.width(), vh = this.cy.height();
    setSep(this.cy.getElementById(this.treeRoot), vw / 2, vh / 4);
    return true;
  }

  animation(){
		let step = () => {
      if (!this.props.animation) return;
			if (this.step === this.buffer.length) {
				this.props.dispatch({
					type: actions.FINISHED_ALGORITHM_SUCCESS,
        });
        this.props.dispatch({
          type: actions.ANIMATION_PAUSE,
        })
				return;
			}
      const { elements, lines, duration, pseudo, treeRoot, refresh} = this.buffer[this.step++];
      if(this.props.paused) return;
      this.loadGraph(elements, refresh);
      if(pseudo) this.props.dispatch({ type: actions.CHANGE_PSEUDO, payload: { pseudo}});
      if (lines) this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines } });
      if(treeRoot != null) this.treeRoot = treeRoot;
			console.log(duration);
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration) / (this.props.speed));
		}
		step();
  }

  insert(value=0){
    const nodes = this.cy.nodes();
    for(let i = 0; i < nodes.length; i++){
      if(nodes[i].id().match('popper')) continue;
      if(nodes[i].data('value') === value){
        this.props.dispatch({
          type: actions.AVL_ELEMENT_ALREADY_INFO,
        })
        return;
      }
    }
    this.pushState();
    this.buffer = this.AVLProcessor.insert(value);
    this.step = 0;
    new Promise((resolve, reject) => {
      this.props.dispatch({type: actions.ANIMATION_START});
      resolve();
    }).then(() => this.animation());
  }

  search(value=0){
    let {found, buffer} = this.AVLProcessor.search(value);
    this.buffer = buffer;
    console.log(buffer);
    this.step = 0;
    new Promise((resolve, reject) => {
      this.props.dispatch({type: actions.ANIMATION_START});
      resolve();
    }).then(() => this.animation());
  }

  remove(value=0){ 
    this.pushState();
    this.buffer = this.AVLProcessor.remove(value);
    console.log(this.buffer);
    this.step = 0;
    new Promise((resolve, reject) => {
      this.props.dispatch({type: actions.ANIMATION_START});
      resolve();
    }).then(() => this.animation());
  }

  handleClose = (update: boolean = false) => {
    this.setState({show: false});
    if(update){
      this.treeRoot = "0";
      this.layoutProcessing();
      this.refreshLayout();
      this.AVLProcessor.loadGraph(this.exportGraph(), "0");
    }
  }

  clearGraph = () => {
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }
    this.pushState();
		this.cy.nodes().forEach((node:CytoscapeElement) => this.cy.remove(node));
  }

  render() {
    return (
      <>
        <InputModal 
          show={this.state.showInsertModal} 
          handleClose={() => this.setState({showInsertModal: false})}
          callback={(v:number) => this.insert(v)}
        />
        <InputModal 
          show={this.state.showSearchModal} 
          handleClose={() => this.setState({showSearchModal: false})}
          callback={(v:number) => this.search(v)}
        />
        <InputModal
          show={this.state.showRemoveModal}
          handleClose={() => this.setState({showRemoveModal: false})}
          callback={(v:number) => this.remove(v)}
        />
        <InputAVLModal 
          show={this.state.show} 
          handleClose={this.handleClose} 
          addNode={this.addNode} 
          addEdge={this.addEdge} 
          clearGraph={this.clearGraph}
        />
        <div id="canvas" className='standard-struct'/>
      </>
    );
  }
}

export default connect(mapStateToProps)(AVL);