import { CytoscapeElement, AnimationStep } from '../Types/types';
import LinkedListSimulator from '../Algorithms/DS/LinkedListSimulator';
const cytoscape = require('cytoscape');

type exportStep = {
  elements: Array<Object>
  lines: Array<number>,
  duration: number,
  pseudo?: Array<Object>,
  list?: Array<Object>,
}

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

class ListProcessor{
  cy = cytoscape();
  vh:number;
  vw:number;
  list = new LinkedListSimulator();
  buffer:Array<exportStep> = [];
  doublyLinked:boolean;
  constructor(vw: number, vh: number, doubly:boolean, type: string){
    this.vh = vh; this.vw = vw; 
    this.doublyLinked = doubly;
    this.list = new LinkedListSimulator([], type);
  }

  loadGraph(elements:Array<Object>=[], list:Array<Object>=[]){
    this.cy = cytoscape({
      elements: JSON.parse(JSON.stringify(elements)),
    });
    this.list._data = [...list];
  }
  
  exportGraph(){
		const elements:Array<Object> = [];
		this.cy.nodes().forEach((node:CytoscapeElement) => {
      let prev = node.data('prevPosition');
      if(!prev) prev = node.data('position');
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
          value: node.data('value'),
          position: node.data('position'),
          style: node.data('style'),
				},
				position: prev,
			});
		});
		this.cy.edges().forEach((edge:CytoscapeElement) => {
			elements.push({
				group: 'edges',
				data: {
					id: edge.id(),
					source: edge.source().id(), target: edge.target().id(),
          weight: edge.data('weight'),
          style: edge.data('style'),
				}
			})
		});
		return elements;
  }

  layoutProcessing(){
    const n = this.list.length();
    if(n === 0) return;
    const mid = this.vw/2;
    for(let i = 0; i < n; i++){
      const {id} = this.list._data[i];
      const node = this.cy.getElementById(id);
      const prevPosition = node.data('position');
      node.data('prevPosition', {x: prevPosition.x, y: prevPosition.y});
      node.data('position', { x: mid - (n-1)*(40) + 70*i, y: this.vh/4 });
    }
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
        position: {
          x: position.x,
          y: position.y,
        }
      },
    });
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
  
  pushStep(lines: Array<number> = [], duration: number = 0){
    this.buffer.push({
      elements: this.exportGraph(),
      lines,
      duration,
      list: this.list._data,
    });
  }
  processCommands(commands: Array<AnimationStep>){
		this.cy.nodes().style({
			'background-color': 'white',
			'color': 'black',
    });
    this.buffer = [];
    let lastLines:Array<number> = [];
    let lastDuration = 0;
    this.pushStep([], 0);
    console.log(commands);
    for(let pos = 0; pos < commands.length; pos++){
      let { eles, style, duration, inst, lines} = commands[pos];
      if(duration == null) duration = 1000;
      if(lines == null) lines = lastLines;
      this.layoutProcessing();
      this.pushStep(lastLines, lastDuration);
      lastLines = lines;
      lastDuration = duration;

      if (eles) {
        eles.forEach((ele, index) => {
          if(style) this.cy.getElementById(ele).data('style', style[index]);
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
              this.addNode(id, value, {x: this.vw/2 + n*40, y: this.vh/4 - 70});
              this.list._data.push({id, value});
              if(source != null) this.addEdge(source, id);
            }
          }else if(ele.name === 'push_front'){
            if(id != null && value != null){
              this.addNode(id, value, {x: this.vw/2 - this.list.length()*40, y: this.vh/4 - 70});
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
              const x = this.vw/2 - (this.list.length()-1)*(40) + 70*pos;
              this.addNode(id, value, {x, y: this.vh/4 - 70});
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
              const x = this.vw/2 - (this.list.length()-1)*(40) + 70*pos;
              this.addNode(id, value, {x, y: this.vh/4 - 70});
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
    }
    this.layoutProcessing();
    this.pushStep(lastLines, lastDuration);
  }

  pushFront(value: number = 0){
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.pushFront,
      }
    });
    */
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    const commands = this.list.push_front({id: id.toString(), value});
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    //console.log(this.buffer);
    return this.buffer;
  }


  pushBack(value: number = 0, slow:boolean = false){
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.pushBack,
      }
    });
    */
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    const commands = this.list.push_back({id: id.toString(), value}, slow);
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    return this.buffer;
  }

  popFront(){
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popFront,
      }
    });
    */
    const commands = this.list.pop_front();
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    return this.buffer;
  }

  popBack(slow:boolean=false){
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.popBack,
      }
    });
    */
    const commands = this.list.pop_back(slow);
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    return this.buffer;
  }

  insert(value:number = 0, where:string, slow = false, nodeId: string){
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: (where === 'before' ? this.props.pseudoset.insertBefore : this.props.pseudoset.insertAfter),
      }
    });
    */
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    let commands;
    console.log(nodeId);
    console.log(this.list._data);
    if(where === 'before') commands = this.list.insert_before(nodeId, id.toString(), value, slow);
    else commands = this.list.insert_after(nodeId, id.toString(), value, slow);
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    return this.buffer;
  }

  remove(slow = false, nodeId: string){

    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: this.props.pseudoset.remove,
      }
    });
    */
    const commands = this.list.delete_position(nodeId, slow);  
    this.processCommands(commands);
    this.layoutProcessing();
    this.pushStep();
    return this.buffer;
  }
}

export default ListProcessor;