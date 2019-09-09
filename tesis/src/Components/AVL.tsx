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
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');
const popper = require('cytoscape-popper');

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

type storeState = {
  animation: string,
  selection: Object,
  speed: number,
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
  dispatch: (action: Object) => Object,
}

const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
    speed: state.speed,
    selection: state.selection,
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
  cy = cytoscape();

  constructor(props:Props){
    super(props);
    this._mediaRecorder = new MediaRecorder(props.dispatch);
  }
  
  componentDidMount() {
    this._isMounted = true;
    this.initialize({ root: '', elements: []});
    this.props.dispatch({
      type: this.props.action,
      payload:{
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
        ]
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
    this.treeRoot = root;
		this.cy.on('resize', () => this.refreshLayout(false));
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
		  this.undo.push({ root: this.treeRoot, elements: currentElements});
		  this.initialize(state);
    }
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
  
  componentWillUnmount(){
    this.props.dispatch({
      type: actions.ANIMATION_END,
    });
    
    this._isMounted = false;

  }
  componentDidUpdate(){
    layoutOptions.animationDuration = 500/this.props.speed;
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
    /*
    let node = this.cy.getElementById(id);

    let popper = node.popper({
			content: () => {
				let div = document.createElement('div');
				div.setAttribute('id', id + 'popper');
				document.body.appendChild(div);

				return div;
			}
    });
    
    let update = () => {
			popper.scheduleUpdate();
		};

    node.on('position', update);
    */
  }
  
  addEdge = (source: string, target: string) => {
    console.log(source, target);
    this.cy.add({
      group: 'edges',
      data: {
        id: edgeId(source, target), source, target,
      }
    });
    this.cy.getElementById(target).data('prev', source);
    //this.refreshLayout();
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
    this.layoutProcessing();
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

  async rotateLeft(x: CytoscapeElement){
    let promise = new Promise((resolve: () => void, reject) => {
        const [y, C] = getChildren(x);
        if(y == null) return;
        const [A, B] = getChildren(y);
        this.removeEdge(x.id(), y.id());
        if(B){
          this.removeEdge(y.id(), B.id());
          this.addEdge(x.id(), B.id());
          //B.data('prev', x.id());
        }
        const prev = x.data('prev');
        this.addEdge(y.id(), x.id());

        if(this.treeRoot !== x.id()){
          this.removeEdge(prev, x.id());
          this.addEdge(prev, y.id());
          //y.data('prev', prev);
        }else{
          this.treeRoot = y.id();
          console.log(this.treeRoot);
        }
        //x.data('prev', y.id());

        x.data('height', Math.max(getHeight(B), getHeight(C))+1);
        y.data('height', Math.max(getHeight(A), getHeight(x))+1);
        x.data('balance', getHeight(C)-getHeight(B));
        y.data('balance', getHeight(x) - getHeight(A));
        this.refreshLayout();
        setTimeout(resolve, 1000/this.props.speed);
      }
    );

    let result = await promise;
    return result;
  }
  

  async rotateRight(y: CytoscapeElement){
    let promise = new Promise((resolve: () => void, reject) => {
        const [A, x] = getChildren(y);
        if(x == null) return;
        const [B, C] = getChildren(x);
        this.removeEdge(y.id(), x.id());
        if(B){
          this.removeEdge(x.id(), B.id());
          this.addEdge(y.id(), B.id());
          //B.data('prev', y.id());
        }
        const prev = y.data('prev');
        this.addEdge(x.id(), y.id());
        
        if(this.treeRoot !== y.id()){
          this.removeEdge(prev, y.id());
          this.addEdge(prev, x.id());
          //x.data('prev', prev);
        }else{
          this.treeRoot = x.id();
          console.log(this.treeRoot);
        }
        //y.data('prev', x.id());

        y.data('height', Math.max(getHeight(A), getHeight(B))+1);
        x.data('height', Math.max(getHeight(y), getHeight(C))+1);
        y.data('balance', getHeight(B) - getHeight(A));
        x.data('balance', getHeight(C) - getHeight(y));
        this.refreshLayout();
        setTimeout(resolve, 1000/this.props.speed);
      }
    );
    let result = await promise;
    return result;
  }

  balance(start: CytoscapeElement){
    let node = start;
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: balance,
      }
    });
    this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: []}});
    let promise = new Promise((resolve, reject) => {
      const recursion = () => {
        const [left, right] = getChildren(node);
        const lh = getHeight(left), rh = getHeight(right);
        node.data('height', Math.max(lh, rh)+1);
        const bal = rh - lh;
        node.data('balance', bal);
        console.log('NODO ' + node.id() + ' BAL ' + bal);
        let first = () => new Promise((resolve)=>{resolve()}), second = () => new Promise((resolve) => {resolve()});
        if(bal === 2){
          if(right.data('balance') >= 0){
            this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [2, 3]}});
            first = () => this.rotateRight(node);
          }else{
            this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [6, 7]}});
            first = () => this.rotateLeft(right);
            second = () => this.rotateRight(node);
          }
        }else if(bal === -2){
          if(left.data('balance') <= 0){
            this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [4, 5]}});
            first = () => this.rotateLeft(node);
          }else{
            this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [8, 9]}});
            first = () => this.rotateRight(left);
            second = () => this.rotateLeft(node);
          }
        }else this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [1]}});
        
        first().then(() => {
          second().then(() => {
            console.log('hello');
            node.style({
              'background-color': 'white',
              'color': 'black',
            })
            if(node.id() === this.treeRoot){
              resolve();
              return;
            }   
            node = this.cy.getElementById(node.data('prev'));
            node.style({
              'background-color': 'red',
              'color': 'black',
            })
            //console.log(node.id());
            setTimeout(recursion, 1000/this.props.speed);
          })
        });
      }  
      this.props.dispatch({type: actions.CHANGE_LINE, payload: {lines: [1]}});
      node.style({
        'background-color': 'red',
        'color': 'black',
      })
      setTimeout(recursion, 1000/this.props.speed);
    });
    return promise;
  }

  insert(value: number) {
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: insert,
      }
    });

    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    let n = this.cy.nodes().length/2 + 1;
    let newNode:CytoscapeElement;
    new Promise((resolve : (found: String | null) => void, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      if(n > 1){
        let insertion = (current: CytoscapeElement, prev: CytoscapeElement | null) => {
          console.log(current);
          if(prev) prev.style({
            'color': 'black',
            'background-color': 'white',
          });
          if(current){
            current.style({
              'color': 'white',
              'background-color': 'black',
            });
            let [left, right] = getChildren(current);
            if(value === current.data('value')){
              this.props.dispatch({
                type: actions.AVL_ELEMENT_ALREADY_INFO,
              })
              setTimeout(resolve, 1000/this.props.speed, current.id());
              return;
            }
            if (value < current.data('value')) {
              this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [3, 4]}});
              setTimeout(insertion, 1000/this.props.speed, left, current);  
            } else {
              this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [5, 6]}});
              setTimeout(insertion, 1000/this.props.speed, right, current);
            }
          }else{
            this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [1, 2]}});
            if(prev){
              this.pushState();
              this.addNode(id.toString(), value, 0, 0, prev.position());
              newNode = this.cy.getElementById(id.toString());
              this.addEdge(prev.id(), newNode.id());
              /*newNode.data(
                'prev', prev.id(),
              );*/
            }
            this.refreshLayout();
            setTimeout(resolve, 1000/this.props.speed, null);
          } 
        }
        insertion(this.cy.getElementById(this.treeRoot), null);
      }else{
        this.pushState();
        this.addNode(id.toString(), value);
        newNode = this.cy.getElementById(id.toString());
        this.treeRoot = id.toString();
        this.refreshLayout();
        resolve(null);
      }
    }).then( (found: String | null) => {
      if(!found){
        this.balance(newNode).then(() => {
          this.props.dispatch({
            type: actions.ANIMATION_END,
          });
        });
      }else{
        this.cy.getElementById(found).style({
          'background-color': 'white',
          'color': 'black',
        });
        this.props.dispatch({
          type: actions.ANIMATION_END,
        });
      }
    })
  }

  async inorderSuccessor(node: CytoscapeElement){
    let promise = new Promise((resolve: (node:CytoscapeElement) => void, reject) => {
      const getNext = (node: CytoscapeElement, prev: CytoscapeElement | null) => {
        if(prev){
          prev.style({
            'background-color': 'white',
            'color': 'black',
          });
        }
        if(node){
          node.style({
            'background-color': 'red',
            'color' : 'black',
          });
          const left = getChildren(node)[0];
          setTimeout(getNext, 1000/this.props.speed, left, node);
        }else prev && resolve(prev);
      }
      let right = getChildren(node)[1];
      node = right;
      getNext(node, null);
    });
    let result = await promise;
    return result;
  }
  
  async search(value: number, stopAnimation: boolean = true){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }
    this.props.dispatch({
      type: actions.ANIMATION_START,
    });
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload:{
        pseudo: search,
      }
    })
    let promise = new Promise((resolve: (node: CytoscapeElement) => void, reject) => {
      let found = false;
      const bsearch = (node: CytoscapeElement, prev: CytoscapeElement | null) => {
        if(prev){
          prev.style({
            'background-color': 'white',
            'color': 'black',
          });
        }
        if(node){
          node.style({
            'background-color': 'red',
            'color': 'black',
          });
          const [left, right] = getChildren(node);
          if(node.data('value') === value){
            node.style({
              'background-color': 'lightgreen',
              'color': 'black',
            });
            found = true;
            this.props.dispatch({
              type: actions.CHANGE_LINE,
              payload: {lines: [2]}
            });
            setTimeout(bsearch, 1000/this.props.speed, null, node);
          }else if(node.data('value') < value){
            this.props.dispatch({
              type: actions.CHANGE_LINE,
              payload: {lines: [5,6]}
            });
            setTimeout(bsearch, 1000/this.props.speed, right, node);
          }else{
            this.props.dispatch({
              type: actions.CHANGE_LINE,
              payload: {lines: [3,4]}
            });
            setTimeout(bsearch, 1000/this.props.speed, left, node);
          }
        }else{
          this.props.dispatch({
            type: (found ? actions.AVL_FOUND_SUCCESS : actions.AVL_NOT_FOUND_INFO),
          });

          if(stopAnimation){
            this.props.dispatch({
              type: actions.ANIMATION_END,
            });
          }

          if(!found){
            this.props.dispatch({
              type: actions.CHANGE_LINE,
              payload: {lines: [1]},
            });

            setTimeout(reject, 1000/ this.props.speed);
          }
          setTimeout(resolve, 1000/this.props.speed, prev);
        }
      }
      bsearch(this.cy.getElementById(this.treeRoot), null);
    });
    let result = await promise;
    return result;
  }
  remove = (value: number) => {
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    const searchPromise = this.search(value, false);
    searchPromise.then((node?: CytoscapeElement) => {
      if(node === undefined) return;
      let anc = '';
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      this.props.dispatch({
        type: actions.CHANGE_PSEUDO,
        payload: { pseudo: remove}
      });

      this.pushState();
      if(isLeaf(node)){
        this.props.dispatch({ type: actions.CHANGE_LINE, payload: {lines: [1]}});
        if(node.id() !== this.treeRoot) anc = node.data('prev');
        this.removeNode(node);
        this.refreshLayout();
        if(anc !== '') this.balance(this.cy.getElementById(anc)).then(() => {
          this.props.dispatch({type: actions.ANIMATION_END});
        });
        else this.props.dispatch({type: actions.ANIMATION_END});
      }else if(node.outgoers('node').length === 1){
        this.props.dispatch({type: actions.CHANGE_LINE, payload: {lines: [3, 4]}});
        if(node.id() === this.treeRoot){
          this.treeRoot = node.outgoers('node')[0].id();
          anc = this.treeRoot;
          this.removeNode(node);
          this.refreshLayout();
        }else{
          let prev = '';
          prev = node.data('prev');
          const newChild = node.outgoers('node')[0];
          newChild.data(prev);
          this.removeNode(node);
          this.addEdge(prev, newChild.id());
          anc = newChild.id();
          this.refreshLayout();
        }
        setTimeout(() => 
          this.balance(this.cy.getElementById(anc)).then(() => {
            this.props.dispatch({type: actions.ANIMATION_END});
          }),
          1000/this.props.speed
        );
      }else{
        this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [6]}});
        let promise = this.inorderSuccessor(node);
        promise.then((suc: CytoscapeElement) => {
          this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [7, 8]}});
          node.data('value', suc.data('value'));
          suc.data('value', value);
          setTimeout(
            () => {
                if(!isLeaf(suc)){
                  const right = getChildren(suc)[1];
                  right.data('prev', suc.data('prev'));
                  this.addEdge(suc.data('prev'), right.id());
                }
                anc = suc.data('prev');
                this.removeNode(suc);
                this.refreshLayout();
                setTimeout(() => 
                  this.balance(this.cy.getElementById(anc)).then(() => {
                    this.props.dispatch({type: actions.ANIMATION_END});
                  }),
                  1000/this.props.speed
                );
                node.style(Styles.NODE);
              },
              1000/this.props.speed);
        });
      }
    }).catch(() => {
      this.props.dispatch({
        type: actions.ANIMATION_END,
      });
    });
  }
  testRotation(mode: number){
    let {selection} = this.props;
    if(!selection) return;
    if(mode === 0) this.rotateLeft(this.cy.getElementById(selection.id));
    else this.rotateRight(this.cy.getElementById(selection.id));
  }

  handleClose = (update: boolean = false) => {
    this.setState({show: false});
    if(update){
      this.treeRoot = "0";
      this.refreshLayout();
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
          callback={(v:number) => this.search(v).catch(() => {})}
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