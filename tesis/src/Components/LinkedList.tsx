import React from 'react';
import MediaRecorder from '../utils/MediaRecorder';
import LinkedListSimulator from '../Algorithms/DS/LinkedListSimulator';
import ListProcessor from '../Processing/list-processing';
import actions from '../Actions/actions';
import { AnimationStep, CytoscapeElement, CytoEvent } from '../Types/types';
import InputModal from './InputModal';

const cytoscape = require('cytoscape');
const Styles = require('../Styles/Styles');
const { connect } = require('react-redux');

type pseudoSet = {
  main: Array<{text: string, ind: number}>,
  pushFront: Array<{text: string, ind: number}>,
  pushBack: Array<{text: string, ind: number}>,
  popFront: Array<{text: string, ind: number}>,
  popBack: Array<{text: string, ind: number}>,
  insertBefore: Array<{text: string, ind: number}>,
  insertAfter: Array<{text: string, ind: number}>,
  remove: Array<{text: string, ind: number}>,
}

type exportStep = {
  elements: Array<Object>
  lines: Array<number>,
  duration: number,
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

type Props = {
  dispatch: (action: Object) => Object,

  action: string,
  type: string,
	algorithm: string,

	animation: Boolean,
	selection: {
		type: string,
		id: string,
		weight: string,
	}
	speed: number,

  options: Array<{name: string, run: () => void}>,
	loadingGraph: Boolean,
  data: string,
  
  pseudoset: pseudoSet,
  paused: boolean,
}

type State = {
  showPushFrontModal: boolean,
  showPushBackModal: boolean,
  showPushAfterModal: boolean,
  showPushBeforeModal: boolean,
  showDeleteModal: boolean,
}
type storeState = {
  animation: boolean,
  speed: number,
  selection: Object,
  paused: boolean,
}

type stackState = {
  list: Array<Object>,
  elements: Array<Object>,
}

const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
    speed: state.speed,
    selection: state.selection,
    paused: state.paused,
  }
}
class LinkedList extends React.Component<Props, State>{
  _mediaRecorder = new MediaRecorder(this.props.dispatch);
  _isMounted = false;

  list = new LinkedListSimulator();
  undo: Array<stackState> = [];
  redo: Array<stackState> = [];

  ListProcessor:any;
  layout = {
		run: () => { },
		stop: () => { },
  };
  
  doublyLinked = false;

  state = {
    showDeleteModal: false,
    showPushBeforeModal: false,
    showPushBackModal: false,
    showPushFrontModal: false,
    showPushAfterModal: false,
  }

  cy = cytoscape();

  nodeStyle = {...Styles.NODE, shape: 'square'};  
  edgeStyle = {};
  buffer:Array<exportStep> =[];
  options:Array<{name: string, run: () => void}> = [];

  step = 0;
  animationTimeout = 0;
  constructor(props:Props){
    super(props);
    if(this.props.type === actions.SELECT_SINGLE_LINKED_LIST || this.props.type === actions.SELECT_DOUBLE_LINKED_LIST){
      this.options = [
        {
          name: 'Insertar al frente',
          run: () => 
              this.props.animation
              ? this.props.dispatch({type: actions.ANIMATION_RUNNING_ERROR})
              : this.setState({showPushFrontModal: true}),
        },
        {
          name: 'Insertar al final',
          run: () => 
              this.props.animation
              ? this.props.dispatch({type: actions.ANIMATION_RUNNING_ERROR})
              : this.setState({showPushBackModal: true}),
        },
        {
          name: 'Extraer frente',
          run: () => this.popFront(),
        },
        {
          name: 'Extraer final',
          run: () => this.popBack(!this.doublyLinked),
        },
        {
          name: 'Insertar antes de',
          run: () => 
            this.props.selection  
            ? this.setState({showPushBeforeModal: true})
            : this.props.dispatch({type: actions.NO_NODE_SELECTED_ERROR})
        },
        {
          name: 'Insertar despues de',
          run: () => 
            this.props.selection  
            ? this.setState({showPushAfterModal: true})
            : this.props.dispatch({type: actions.NO_NODE_SELECTED_ERROR})
        },
        {
          name: 'Eliminar nodo',
          run: () => this.remove(!this.doublyLinked),
        }
      ]
    }else if(this.props.type === actions.SELECT_STACK){
      this.options = [
        {
          name: 'Apilar',
          run: () => 
              this.props.animation
              ? this.props.dispatch({type: actions.ANIMATION_RUNNING_ERROR})
              : this.setState({showPushFrontModal: true}),
        },
        {
          name: 'Desapilar',
          run: () => this.popFront(),
        }
      ]
    }else if(this.props.type === actions.SELECT_QUEUE){
      this.options = [
        {
          name: 'Encolar',
          run: () =>
              this.props.animation
              ? this.props.dispatch({type: actions.ANIMATION_RUNNING_ERROR}) 
              : this.setState({showPushBackModal: true}),
        },
        {
          name: 'Desencolar',
          run: () => this.popFront(),
        }
      ]
    }
  }

  initialize(state: stackState){

    this.edgeStyle = {...Styles.EDGE, ...Styles.EDGE_DIRECTED};

    if(this.doublyLinked) this.edgeStyle = {...this.edgeStyle, ...Styles.EDGE_DOUBLE}
    const {list, elements} = state;
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

				{
					selector: 'edge',
					style: this.edgeStyle,
				}
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

    this.list._data = list;
    this.cy.on('click', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
    this.cy.on('tap', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
    this.cy.on('resize', () => this.refreshLayout(false))
    this.layout = this.cy.elements().makeLayout(layoutOptions);
    this.layout.run();
    this.refreshLayout(false);
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
								this.props.dispatch({ type: actions.ANIMATION_END })
							}
						}]
				}
			});
		}
  }
  componentDidMount(){
    this._isMounted = true;
    this.doublyLinked = this.props.type === actions.SELECT_DOUBLE_LINKED_LIST;

    this.list.type = this.props.type;
    this.initialize({list: [], elements: []});

    this.ListProcessor = new ListProcessor(this.cy.width(), this.cy.height(), this.doublyLinked, this.props.type);

    
    this.props.dispatch({
			type: this.props.action,
			payload:{
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				undo: this.handleUndo,
        redo: this.handleRedo,
        rewind: this.handleRewind,
        forward: this.handleForward,
        repeat: this.handleRepeat,
        end: this.handleEnd,
        pause: this.handlePauseContinue,
        remove: () => this.remove(!this.doublyLinked),
        clear: this.clearGraph,
        options: this.options,
        type: this.props.type,
			}
		});
  }

  componentWillUnmount() {
		this.props.dispatch({
			type: actions.ANIMATION_END,
		});
		clearTimeout(this.animationTimeout);
		this._isMounted = false;
		let nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			this.removeNode(node.id());
		});
  }
  
  layoutProcessing(){
    const n = this.list.length();
    if(n === 0) return;
    const mid = this.cy.width()/2;
    for(let i = 0; i < n; i++){
      const {id} = this.list._data[i];
      layoutOptions.positions[id] = {
        x: mid - (n-1)*(40) + 70*i,
        y: this.cy.height()/4,
      }
    }
  }
  refreshLayout(animate:boolean=true) {
    this.layout.stop();
    //this.layoutProcessing();
		this.layout = this.cy.elements().makeLayout({...layoutOptions, animate});
		this.layout.run();
  }
  
  clearGraph = () => {
		if(this.props.animation){
			this.props.dispatch({
				type: actions.ANIMATION_RUNNING_ERROR,
			});
			return;
		}
		this.props.dispatch({
			type: actions.CLEAR_GRAPH,
		});
		let nodes = this.cy.nodes();
    if(nodes.length === 0) return;
    this.pushState();
    this.ListProcessor.loadGraph();
		for (let i = 0; i < nodes.length; i++) {
			this.removeNode(nodes[i].id());
		}
	}

  handleClickOnNode = (node: CytoscapeElement) => {
		if (this.props.animation === true) return;
    let nodeId = node.id();
    let { selection } = this.props;
    if(selection && selection.type === 'node'){
      const prev = this.cy.getElementById(selection.id);
      prev.style(this.nodeStyle);
      if(selection.id === nodeId){
        this.props.dispatch({
          type: actions.NO_SELECTION,
        });
        return;
      }
    }
    node.style(Styles.NODE_SELECTED);
    this.props.dispatch({
      type: actions.SELECTION,
      payload: {
        selection: {
          id: nodeId, type: 'node'
        }
      }
    });
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
			this.redo.push({list: JSON.parse(JSON.stringify(this.ListProcessor.list._data)), elements: currentElements});
      this.loadGraph(state.elements);
      this.ListProcessor.loadGraph(state.elements, state.list);
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
			this.undo.push({list: JSON.parse(JSON.stringify(this.ListProcessor.list._data)), elements: currentElements});
			this.loadGraph(state.elements);
      this.ListProcessor.loadGraph(state.elements, state.list);
		}
	}

  pushState(){
    this.redo = [];
    this.undo.push({
      list: JSON.parse(JSON.stringify(this.ListProcessor.list._data)),
      elements: this.exportGraph(),
    });
  }
  
  handleRewind = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.max(this.step-1, 0);
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements, true);
		this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines }});
	}

	handleForward = () => { 
		clearTimeout(this.animationTimeout);
		this.props.dispatch({type: actions.ANIMATION_PAUSE});
		this.step = Math.min(this.step+1, this.buffer.length-1);
		const {elements, lines} = this.buffer[this.step];
		this.loadGraph(elements, true);
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
          position: {
            x: node.position().x,
            y: node.position().y,
          }
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
  
  animation(){
		let step = () => {
			if(!this._isMounted) return;
			if(this.step === this.buffer.length){
				this.props.dispatch({
					type: actions.FINISHED_ALGORITHM_SUCCESS,
        });
        this.props.dispatch({
          type: actions.ANIMATION_PAUSE,
        });
				return;
			}
			if (!this.props.animation) {
				this.cy.nodes().style(this.nodeStyle);
				this.cy.edges().style(this.edgeStyle);
				this.props.dispatch({
					type: actions.ANIMATION_END,
				});
				this.cy.autolock(false);
				return;
			}
      const {elements, lines, duration} = this.buffer[this.step++];
      if(this.props.paused) return;
			this.loadGraph(elements);
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			//this.refreshLayout();
			this.animationTimeout = window.setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
		}
		step();
  }
  
  removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
  }
  
  removeEdge = (edge: string) => {
		this.cy.remove('edge[id="' + edge + '"]');
  }
  
  addNode(id: string, value: number, position: {x: number, y: number} = {x: 0, y: 0}){
    this.cy.add({
      group: 'nodes',
      data: {
        id,
        value,
      },
      position:{
        x: position.x,
        y: position.y,
      }
    });
    layoutOptions.positions[id] = position;
  }
  
  addEdge(x: string, y: string) {
    //this.pushState();
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				source: x,
        target: y,
        weight: 'sig',
      },
    });
  }
  
  pushFront(value: number = 0){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    this.step = 0;
    this.pushState();

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.pushFront,
      }
    });
    this.buffer = this.ListProcessor.pushFront(value);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation());
  }


  pushBack(value: number = 0, slow:boolean = false){

    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.pushBack,
      }
    });

    this.step = 0;
    this.pushState();
    this.buffer = this.ListProcessor.pushBack(value, slow);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation());
  }

  
  popFront(){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popFront,
      }
    });

    if(this.ListProcessor.list.length() === 0){
      this.props.dispatch({
        type: actions.CHANGE_LINE,
        payload: { lines: [1] }
      });
      this.props.dispatch({
        type: actions.EMPTY_LIST_WARNING,
      });
      return;
    }

    this.step = 0;
    this.pushState();

    this.buffer = this.ListProcessor.popFront();
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation());
  }

  popBack(slow:boolean=false){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popBack,
      }
    });

    if(this.ListProcessor.list.length() === 0){
      this.props.dispatch({
        type: actions.EMPTY_LIST_WARNING,
      });
      return;
    }

    this.step = 0;
    this.pushState();

    this.buffer = this.ListProcessor.popBack(slow);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation());
  }

  remove(slow = false){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    const {selection} = this.props;

    if(!selection) {
      this.props.dispatch({
        type: actions.NO_NODE_SELECTED_ERROR,
      });
      return;
    }

    
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.remove,
      }
    });
    
    this.step = 0;
    this.pushState();

    const nodeId = selection.id;

    this.buffer = this.ListProcessor.remove(slow, nodeId);
    new Promise((resolve, reject) => {
        this.props.dispatch({
          type: actions.ANIMATION_START,
        });
        resolve();
      }).then(() => this.animation());
  }

  insert(value:number = 0, where:string, slow = false){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    const {selection} = this.props;
    if(!selection) {
      this.props.dispatch({
        type: actions.NO_NODE_SELECTED_ERROR,
      });
      return;
    }

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: (where === 'before' ? this.props.pseudoset.insertBefore : this.props.pseudoset.insertAfter),
      }
    });

    this.step = 0;
    this.pushState();
    const nodeId = selection.id;

    this.buffer = this.ListProcessor.insert(value, where, slow, nodeId);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation());
  }
  render(){
    return(
      <>
        <InputModal 
          show={this.state.showPushFrontModal}
          handleClose={() => this.setState({showPushFrontModal: false})}
          callback={(v:number) => this.pushFront(v)}
        />
        <InputModal 
          show={this.state.showPushBackModal}
          handleClose={() => this.setState({showPushBackModal: false})}
          callback={(v:number) => this.pushBack(v, this.props.type === actions.SELECT_SINGLE_LINKED_LIST)}
        />
        <InputModal 
          show={this.state.showPushBeforeModal}
          handleClose={() => this.setState({showPushBeforeModal: false})}
          callback={(v:number) => this.insert(v, 'before', this.props.type === actions.SELECT_SINGLE_LINKED_LIST)}
        />
        <InputModal 
          show={this.state.showPushAfterModal}
          handleClose={() => this.setState({showPushAfterModal: false})}
          callback={(v:number) => this.insert(v, 'after')}
        />
        <div id="canvas" className='standard-struct'/>
      </>
    )
  }
}

export default connect(mapStateToProps)(LinkedList);