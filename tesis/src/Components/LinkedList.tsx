import React from 'react';
import MediaRecorder from '../utils/MediaRecorder';
import LinkedListSimulator from '../Algorithms/DS/LinkedListSimulator';
import actions from '../Actions/actions';
import { AnimationStep } from '../Types/types';
import InputModal from './InputModal';
const cytoscape = require('cytoscape');
const Styles = require('../Styles/Styles');
const { connect } = require('react-redux');

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
}

type State = {
  showPushFrontModal: boolean,
  showPushBackModal: boolean,
  showDeleteModal: boolean,
}
type storeState = {
  animation: boolean,
  speed: number,
}

type stackState = {
  list: Array<Object>,
  elements: Array<Object>,
}


const mapStateToProps = (state: storeState) => {
  return {
    animation: state.animation,
    speed: state.speed,
  }
}
class LinkedList extends React.Component<Props, State>{
  _mediaRecorder = new MediaRecorder(this.props.dispatch);
  _isMounted = false;

  list = new LinkedListSimulator();
  undo: Array<stackState> = [];
  redo: Array<stackState> = [];

  layout = {
		run: () => { },
		stop: () => { },
  };
  
  state = {
    showDeleteModal: false,
    showPushBackModal: false,
    showPushFrontModal: false,
  }

  cy = cytoscape();

  nodeStyle = {...Styles.NODE, shape: 'square'};
  edgeStyle = {...Styles.EDGE, ...Styles.EDGE_DIRECTED};
  initialize(state: stackState){

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
			wheelSensitivity: 1,
      pixelRatio: '1.0',
      autoungrabify: true,
    });
    this.layout = this.cy.elements().makeLayout(layoutOptions);
    this.layout.run();
    this.cy.center();
  }  

  componentDidMount(){
    this._isMounted = true;
    this.initialize({list: [], elements: []});
    let options:Array<{name: string, run: () => void}> = [];
    if(this.props.type === actions.SELECT_SINGLE_LINKED_LIST){
      options = [

        {
          name: 'Insertar',
          run: () => this.setState({showPushBackModal: true}),
        },
        {
          name: 'Eliminar primero',
          run: () => this.popFront(),
        },
        {
          name: 'Eliminar ultimo',
          run: () => this.popBack(true),
        },
        {
          name: 'Eliminar posicion',
          run: () => this.setState({showDeleteModal: true}),
        }
      ]
    }else if(this.props.type === actions.SELECT_STACK){
      options = [
        {
          name: 'Apilar',
          run: () => this.setState({showPushBackModal: true}),
        },
        {
          name: 'Desapilar',
          run: () => this.popBack(),
        }
      ]
    }else if(this.props.type === actions.SELECT_QUEUE){
      options = [
        {
          name: 'Encolar',
          run: () => this.setState({showPushFrontModal: true}),
        },
        {
          name: 'Desencolar',
          run: () => this.popBack(),
        }
      ]
    }
    this.props.dispatch({
			type: this.props.action,
			payload:{
				photo: () => this._mediaRecorder.takePicture(this.cy),
				gif: () => this._mediaRecorder.takeGif(this.cy),
				undo: (this.handleUndo),
				redo: this.handleRedo,
        options,
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
      console.log(this.list._data[i]);
      layoutOptions.positions[id] = {
        x: mid - (n-1)*(35) + 70*i,
        y: this.cy.height()/4,
      }
    }
  }
  refreshLayout() {
    this.layout.stop();
    this.layoutProcessing();
		this.layout = this.cy.elements().makeLayout(layoutOptions);
		this.layout.run();
  }
  
  handleUndo = () => {}
  handleRedo = () => {}
  pushState(){}
  

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
				if (style) {
					eles.forEach((ele, index) => {
						this.cy.getElementById(ele).style(style[index]);
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
                this.addNode(id, value);
                this.list._data.push({id, value});
                if(source != null) this.addEdge(source, id);
              }
            }else if(ele.name === 'push_front'){
              if(id != null && value != null){
                this.addNode(id, value);
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
        console.log(duration);
				setTimeout(step, ((duration === undefined) ? 1000 : duration)/(this.props.speed));
			}
			step();
    }
    console.log(commands);
		animation();
  }
  
  removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
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
			}
		});
  }
  
  pushBack(value: number = 0, slow:boolean = false){

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
    //this.refreshLayout();
  }

  pushFront(value: number = 0){
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
  }

  popFront(){
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.pop_front();
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
  }

  popBack(slow:boolean=false){
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.pop_back(slow);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
  }

  search(){

  }

  remove(pos:number){
    new Promise((resolve: (commands: Array<AnimationStep>) => void, reject) => {
      this.props.dispatch({
				type: actions.ANIMATION_START,
      });
      const commands = this.list.delete_position(pos);
      resolve(commands);
    }).then((commands: Array<AnimationStep>) => {
      this.executeAnimation(commands);
    })
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
          show={this.state.showDeleteModal}
          handleClose={() => this.setState({showDeleteModal: false})}
          callback={(v:number) => this.remove(v)}
        />
        <div id="canvas" className='standard-struct'/>
      </>
    )
  }
}

export default connect(mapStateToProps)(LinkedList);