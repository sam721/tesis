import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import { getChildren, lca, getHeight, isLeaf } from '../utils/avl-utils';
import {edgeId} from '../utils/cy-utils';
import {insert, remove, balance, search} from '../resources/pseudocodes/avl';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

type exportStep = {
  elements: Array<Object>
  lines: Array<number>,
  duration: number,
  pseudo?: Array<Object>,
  treeRoot: string,
  refresh?: boolean,
}
class AVLProcessor { 

  cy = cytoscape();
  vh:number;
  vw:number;
  treeRoot:string="";

  buffer:Array<exportStep> = [];

  pseudo:Array<Object> = [];
  constructor(vw: number, vh: number){
    this.vh = vh; this.vw = vw; 
  }

  loadGraph(elements:Array<Object>, root: string){
    this.cy = cytoscape({
      elements: JSON.parse(JSON.stringify(elements)),
    });
    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')){
        node.data('style', Styles.NODE);
      }else{
        node.data('style', Styles.NODE_POPPER);
      }
    });
    this.treeRoot = root;
  }
  exportGraph(updateLayout=true){
		const elements:Array<Object> = [];
    if(updateLayout) this.layoutProcessing();
		this.cy.nodes().forEach((node:CytoscapeElement) => {
      let prev = node.data('prevPosition');
      if(!prev) prev = node.data('position');
			elements.push({
				group: 'nodes',
				data: {
					id: node.id(),
          value: node.data('value'),
          prev: node.data('prev'),
          height: node.data('height'),
          balance: node.data('balance'),
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

  pushStep(lines:Array<number> = [], duration:number = 1000, refresh=true){
    this.buffer.push({
      elements: this.exportGraph(refresh),
      lines,
      duration,
      treeRoot: this.treeRoot,
      pseudo: this.pseudo,
    })
  }
  createPopper(nodeId: string){
		const ele = this.cy.getElementById(nodeId);
		const position = ele.data('position');
		this.cy.add({
			group: 'nodes',
			data: {
        id : nodeId+'-popper', 
        style: Styles.NODE_POPPER,
        position: {
          x: position.x,
          y: position.y+30,
        },
      },
			position: {
				x: position.x,
				y: position.y+30,
			},
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
        position: { x: position.x, y: position.y },
      },
      position: {
        x: position.x,
        y: position.y,
      }
    });
    this.createPopper(id);
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
      const prevPosition = node.data('position');
      node.data('prevPosition', prevPosition);
      node.data('position', { x: node.data('X')*24 + nx, y: ny });
      const popper = this.cy.getElementById(node.id() + '-popper');
      const prevPopPosition = popper.data('position');
      popper.data('prevPosition', prevPopPosition);
			popper.data('position', {x: node.data('X')*24 + nx, y: ny + 30});
      let [left, right] = getChildren(node);
      if (left) setSep(left, nx, ny + 50);
      if (right) setSep(right, nx, ny + 50);
    }

    const vw = this.vw, vh = this.vh;
    setSep(this.cy.getElementById(this.treeRoot), vw / 2, vh / 4);
    return true;
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

  removeEdge = (source: string, target: string) => {
    this.cy.remove('edge[id="'+edgeId(source, target)+'"]');
  }

  rotateLeft(x: CytoscapeElement){
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
    this.pushStep([], 1000);
  }

 rotateRight(y: CytoscapeElement){
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
    this.pushStep();
  }
  balance(start: CytoscapeElement){
    let node = start;
    /*
    this.props.dispatch({
      type: actions.CHANGE_PSEUDO,
      payload: {
        pseudo: balance,
      }
    });
    */
    //this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: []}});
    this.pseudo = balance;
    this.pushStep();

    const recursion = () => {
      const [left, right] = getChildren(node);
      const lh = getHeight(left), rh = getHeight(right);
      node.data('height', Math.max(lh, rh)+1);
      const bal = rh - lh;
      node.data('balance', bal);
      if(bal === 2){
        if(right.data('balance') >= 0){
          this.pushStep([2,3]);
          //this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [2, 3]}});
          this.rotateRight(node);
        }else{
          this.pushStep([6,7]);
          //this.props.dispatch({type: actions.CHANGE_LINE, payload: { lines: [6, 7]}});
          this.rotateLeft(right);
          this.rotateRight(node);
        }
      }else if(bal === -2){
        if(left.data('balance') <= 0){
          this.pushStep([4,5]);
          this.rotateLeft(node);
        }else{
          this.pushStep([8,9]);
          this.rotateRight(left);
          this.rotateLeft(node);
        }
      }else{
        this.pushStep([1]);
      }
      if(node.id() !== this.treeRoot){
        node.data('style', Styles.NODE);
        node = this.cy.getElementById(node.data('prev'));
        node.data('style', {
          'background-color': 'red',
          'color': 'black',
        })
        recursion();
      }
    }  
    this.pushStep([1]);
    //this.props.dispatch({type: actions.CHANGE_LINE, payload: {lines: [1]}});
    
    node.data('style', {
      'background-color': 'red',
      'color': 'black',
    })
    
    //setTimeout(recursion, 1000/this.props.speed);
    recursion();
  }

  insert(value: number) {
    this.buffer = [];
    let id = 0;
    while(this.cy.getElementById(id.toString()).length > 0) id++;
    let n = this.cy.nodes().length/2 + 1;
    let newNode:(CytoscapeElement | null) = null;
    this.pseudo = insert;
    this.pushStep();

    if(n > 1){
      let insertion = (current: CytoscapeElement, prev: CytoscapeElement | null) => {
        console.log(current);
        
        if(prev) prev.data('style',{
          'color': 'black',
          'background-color': 'white',
        });
        
        if(current){
          
          current.data('style', {
            'color': 'white',
            'background-color': 'black',
          });
          
          let [left, right] = getChildren(current);
          if (value < current.data('value')) {
            this.pushStep([3, 4]);
            //this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [3, 4]}});
            //setTimeout(insertion, 1000/this.props.speed, left, current);  
            insertion(left, current);
          } else {
            this.pushStep([5, 6]);
            //this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [5, 6]}});
            //setTimeout(insertion, 1000/this.props.speed, right, current);
            insertion(right, current);
          }
        }else{
          //this.props.dispatch({ type: actions.CHANGE_LINE, payload: { lines: [1, 2]}});
          if(prev){
            this.addNode(id.toString(), value, 0, 0, prev.data('position'));
            newNode = this.cy.getElementById(id.toString());
            if(newNode){
              this.addEdge(prev.id(), newNode.id());
              newNode.data(
                'prev', prev.id(),
              );
            }
          }
          this.pushStep([1,2]);
          //this.refreshLayout();
          //setTimeout(resolve, 1000/this.props.speed, null);
        } 
      }
      insertion(this.cy.getElementById(this.treeRoot), null);
    }else{
      this.addNode(id.toString(), value);
      newNode = this.cy.getElementById(id.toString());
      this.treeRoot = id.toString();
      this.pushStep([1,2]);
    }
    if(newNode) this.balance(newNode);
    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')) node.data('style', Styles.NODE);
    })
    this.pushStep();
    return this.buffer;
  }

  search(value: number){
    this.buffer = [];
    this.pseudo = search;
    this.pushStep();

    let found = false;
    const bsearch = (node: CytoscapeElement | null, prev: CytoscapeElement | null) => {
      if(prev){
        prev.data('style',{
          'background-color': 'white',
          'color': 'black',
        });
      }
      if(node){
        node.data('style', {
          'background-color': 'black',
          'color': 'white',
        });
        const [left, right] = getChildren(node);
        if(node.data('value') === value){
          node.data('style',{
            'background-color': 'lightgreen',
            'color': 'black',
          });
          found = true;
          this.pushStep([2]);

          //setTimeout(bsearch, 1000/this.props.speed, null, node);
          bsearch(null, node);
        }else if(node.data('value') < value){
          this.pushStep([5,6]);
          bsearch(right, node);
        }else{
          this.pushStep([3,4]);
          bsearch(left, node);
        }
      }
    }
    bsearch(this.cy.getElementById(this.treeRoot), null);

    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')) node.data('style', Styles.NODE);
    });

    this.pushStep();
    return {found, buffer: this.buffer}
  }

  inorderSuccessor(node: CytoscapeElement){
    this.pushStep();
    let suc = node;
    const getNext = (node: CytoscapeElement, prev: CytoscapeElement | null) => {
      if(prev){
        prev.data('style', {
          'background-color': 'white',
          'color': 'black',
        });
        suc = prev;
      }
      if(node){
        node.data('style', {
          'background-color': 'red',
          'color' : 'black',
        });
        const left = getChildren(node)[0];
        this.pushStep();
        getNext(left, node);
      }
    }
    let right = getChildren(node)[1];
    node = right;
    getNext(node, null);
    return suc;
  }
  
  removeNodePopper(node: string) {
    this.cy.remove(this.cy.getElementById(node + '-popper'));
	}

  removeNode = (node: CytoscapeElement) => {
    let id = node.id();
    this.cy.remove(node);
    this.removeNodePopper(id);
  }
  
  remove = (value: number) => {
    this.buffer = [];
    this.search(value);
    this.pseudo = remove;
    let node = this.cy.getElementById(this.treeRoot);
    let found = false;
    this.cy.nodes().forEach((ele:CytoscapeElement) => {
      if(!ele.id().match('popper') && ele.data('value') === value){
        node = ele;
        found = true;
      }
    });
    if(!found) return this.buffer;
    let anc = '';

    this.pushStep();

    if(isLeaf(node)){
      if(node.id() !== this.treeRoot) anc = node.data('prev');
      this.removeNode(node);
      this.pushStep([1]);
      if(anc !== '') this.balance(this.cy.getElementById(anc));
    }else if(node.outgoers('node').length === 1){
      //this.props.dispatch({type: actions.CHANGE_LINE, payload: {lines: [3, 4]}});
      if(node.id() === this.treeRoot){
        this.treeRoot = node.outgoers('node')[0].id();
        anc = this.treeRoot;
        this.removeNode(node);
        this.pushStep([3,4]);
      }else{
        let prev = '';
        prev = node.data('prev');
        const newChild = node.outgoers('node')[0];
        newChild.data(prev);
        this.removeNode(node);
        this.addEdge(prev, newChild.id());
        anc = newChild.id();
        this.pushStep([3,4]);
      }
      this.balance(this.cy.getElementById(anc));
    }else{
      this.pushStep([6]);
      const suc = this.inorderSuccessor(node);
      console.log('NODE', node);
      console.log('SUC', suc);
      this.pushStep([7,8]);
      node.data('value', suc.data('value'));
      suc.data('value', value);
      this.pushStep([7,8], 1000, false);

      if(!isLeaf(suc)){
        console.log("ERROR");
        console.log(getChildren(suc));
        const right = getChildren(suc)[1];
        right.data('prev', suc.data('prev'));
        this.addEdge(suc.data('prev'), right.id());
      }
      anc = suc.data('prev');
      this.removeNode(suc);
      this.pushStep();
      this.balance(this.cy.getElementById(anc))
    }
    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')) node.data('style', Styles.NODE);
    });

    this.pushStep();
    return this.buffer;
  }
}

export default AVLProcessor;