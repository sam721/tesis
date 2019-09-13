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
        options: this.options,
        type: this.props.type,
			}
		});
  }

  layoutProcessing(){
    const n = this.list.length();
    if(n === 0) return;
    const mid = this.cy.width()/2;
    for(let i = 0; i < n; i++){
      const {id} = this.list._data[i];
      layoutOptions.positions[id] = {
        x: mid - (n-1)*(35) + 70*i,
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
  
  loadGraph(elements: Array<Object>) {
		const nodes = this.cy.nodes();
		nodes.forEach((node: CytoscapeElement) => {
			this.cy.remove(node);
		})

		for (let i = 0; i < elements.length; i++) {
			this.cy.add(elements[i]);
		}

		this.cy.nodes().forEach((node: CytoscapeElement) => {
			const style = node.data('style');
			if (style != null) node.style(style);
			const position = node.data('position');
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
  
  animation(start:number=0){
    let pos = start;
    console.log(this.props.animation);
		let step = () => {
			if(!this._isMounted) return;
			if(pos === this.buffer.length){
				this.props.dispatch({
					type: actions.FINISHED_ALGORITHM_SUCCESS,
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
			const {elements, lines, duration} = this.buffer[pos++];
			this.loadGraph(elements);
			if(lines) this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines }});
			//this.refreshLayout();
			setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
		}
		step();
  }
  
  executeAnimation = (commands: Array<AnimationStep>) => {
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
		});

		let animation = () => {
			let pos = 0;
			let step = () => {
				if(!this._isMounted) return;
				if(pos === commands.length){
          this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					return;
				}
				if (!this.props.animation) {
					this.cy.nodes().style(this.nodeStyle);
					this.cy.edges().style(this.edgeStyle);
					this.props.dispatch({
						type: actions.ANIMATION_END,
					});
					return;
				}
				let { eles, style, duration, inst, lines} = commands[pos++];
				if (eles) {
					eles.forEach((ele, index) => {
						if(style) this.cy.getElementById(ele).style(style[index]);
					});
        }
        
				if(inst){
					inst.forEach(ele => {
            if(ele.data == null) return;
            const {id, value, source, target} = ele.data;

						if(ele.name === 'remove'){
              if(id !== undefined) this.removeNode(id);
              if(source != null && target != null) this.addEdge(source, target);
              if(value !== undefined) this.list._data.splice(value, 1);
						}else if(ele.name === 'add'){
              if(id !== undefined && value !== undefined){
                this.addNode(id, value);
                this.list._data.push({id, value});
                if(source !== undefined) this.addEdge(source, id);
                if(target !== undefined) this.addEdge(id, target);
              }
            }else if(ele.name === 'push_back'){
              if(id != null && value != null){
                const n = this.list.length();
                this.addNode(id, value, {x: this.cy.width()/2 + n*35, y: this.cy.height()/4 - 70});
                this.list._data.push({id, value});
                if(source != null) this.addEdge(source, id);
              }
            }else if(ele.name === 'push_front'){
              if(id != null && value != null){
                this.addNode(id, value, {x: this.cy.width()/2 - this.list.length()*35, y: this.cy.height()/4 - 70});
                this.list._data.unshift({id, value});
                if(target != null) this.addEdge(id, target);
              }
            }else if(ele.name === 'pop_front'){
              if(id != null){
                this.removeNode(id);
                this.list._data.shift();
              }
            }else if(ele.name === 'pop_back'){
              if(id != null){
                this.removeNode(id);
                this.list._data.pop();
              }
            }else if(ele.name === 'add_node_before'){
              let {id, value, pos} = ele.data;
              if(id != null && value != null && pos != null){
                const x = this.cy.width()/2 - (this.list.length()-1)*(35) + 70*pos;
                this.addNode(id, value, {x, y: this.cy.height()/4 - 70});
                if(pos === 0) this.list._data.unshift({id, value});
                else{

                  let rest = this.list._data.splice(pos);
                  this.list._data.push({id, value});
                  this.list._data = this.list._data.concat(...rest);
                }
              }
            }else if(ele.name === 'add_node'){
              let {id, value, pos} = ele.data;
              if(id != null && value != null && pos != null){
                const x = this.cy.width()/2 - (this.list.length()-1)*(35) + 70*pos;
                this.addNode(id, value, {x, y: this.cy.height()/4 - 70});
                pos++;
                if(pos === this.list.length()) this.list._data.push({id, value});
                else{
                  let rest = this.list._data.splice(pos);
                  this.list._data.push({id, value});
                  this.list._data = this.list._data.concat(...rest);
                }
              }
            }else if(ele.name === 'add_edge'){
              let {source, target} = ele.data;
              if(source && target){
                console.log('ADD', source, target);
                this.addEdge(source, target);
              }
            }else if(ele.name === 'remove_edge'){
              let {source, target} = ele.data;
              if(source && target){
                this.removeEdge(source+'-'+target);
                if(this.doublyLinked) this.removeEdge(target+'-'+source);
              }
            }
					});
				}
				if(lines != null && this._isMounted){
					this.props.dispatch({
						type: actions.CHANGE_LINE,
						payload: {lines}
					})
				}
        this.refreshLayout();
				setTimeout(step, ((duration === undefined) ? 500 : duration)/(this.props.speed));
			}
			step();
    }
		animation();
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

    this.pushState();

    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.pushFront,
      }
    });
    /*
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.push_front({id: id.toString(), value});
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
    this.buffer = this.ListProcessor.pushFront(value);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
    //this.animation(0);
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

    this.pushState();
    /*
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.push_back({id: id.toString(), value}, slow);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
    this.buffer = this.ListProcessor.pushBack(value, slow);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
    //this.refreshLayout();
  }

  
  popFront(){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    /*
    if(this.list.length() === 0){
      this.props.dispatch({
        type: actions.EMPTY_LIST_WARNING,
      });
      return;
    }
    */
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popFront,
      }
    });

    this.pushState();
    /*
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.pop_front();
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
    this.buffer = this.ListProcessor.popFront();
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
  }

  popBack(slow:boolean=false){
    if(this.props.animation){
      this.props.dispatch({
        type: actions.ANIMATION_RUNNING_ERROR,
      });
      return;
    }

    /*
    if(this.list.length() === 0){
      this.props.dispatch({
        type: actions.EMPTY_LIST_WARNING,
      });
      return;
    }
    */
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popBack,
      }
    });

    this.pushState();
    
    /*
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.pop_back(slow);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
    this.buffer = this.ListProcessor.popBack(slow);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
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
    
    this.pushState();

    const nodeId = selection.id;
    /*
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.delete_position(nodeId, slow);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
   this.buffer = this.ListProcessor.remove(slow, nodeId);
   new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
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

    this.pushState();
    const nodeId = selection.id;

    /*
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;

    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      let commands;
      if(where === 'before') commands = this.list.insert_before(nodeId, id.toString(), value, slow);
      else commands = this.list.insert_after(nodeId, id.toString(), value, slow);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
    */
    this.buffer = this.ListProcessor.insert(value, where, slow, nodeId);
    new Promise((resolve, reject) => {
      this.props.dispatch({
        type: actions.ANIMATION_START,
      });
      resolve();
    }).then(() => this.animation(0));
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