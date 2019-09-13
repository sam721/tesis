import { CytoscapeElement, CytoEvent, AnimationStep } from '../Types/types';
import PriorityQueue from '../Algorithms/DS/PriorityQueue'
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');
const { connect } = require('react-redux');

class HeapProcessor{
	heap = new PriorityQueue((x, y) => x < y, (x, y) => x === y);
  cy = cytoscape();
  vh:number;
  vw:number;
  constructor(vw: number, vh: number){
    this.vh = vh; this.vw = vw; 
  }

  loadGraph(elements:Array<Object>){
    this.cy = cytoscape({
      elements: JSON.parse(JSON.stringify(elements)),
    });

    this.heap._data = [0];
    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')){
        this.heap._data[parseInt(node.id())] = node.data('value');
        node.data('style', Styles.NODE);
      }else{
        node.data('style', Styles.NODE_POPPER);
      }
    });
    console.log(this.heap._data);
  }
  
	exportGraph = () => {
    const elements:Array<Object> = [];
    this.layoutProcessing();
    this.cy.nodes().forEach((node:CytoscapeElement) => {
      let prev = node.data('prevPosition');
      if(!prev) prev = node.data('position');
      elements.push({
        group: 'nodes',
        data: {
          id: node.id(),
          value: node.data('value'),
          style: node.data('style'),
          position: node.data('position'),
        },
        position: prev,
      })
    });
    this.cy.edges().forEach((edge:CytoscapeElement) => {
      elements.push({
        group: 'edges',
        data: {
          id: edge.id(),
          source: edge.source().id(), target: edge.target().id(),
          weight: edge.data('weight'),
          style: edge.data('style'),
          /*
          style: {
            lineColor: edge.style('line-color'),
            targetArrowShape: edge.style('target-arrow-shape'),
            targetArrowColor: edge.style('target-arrow-color'),
            lineStyle: edge.style('line-style'),
          }
          */
        }
      })
    });
    //console.log(elements);
    return JSON.parse(JSON.stringify(elements));
  }
  
  createPopper(nodeId: string, value: number){
		const ele = this.cy.getElementById(nodeId);
		const position = ele.data('position');
		this.cy.add({
			group: 'nodes',
			data: {
        id : nodeId+'-popper', 
        value,
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

	addNode(node: string, value: number, position: {x: number, y: number} = {x: 0, y: 0}){
		this.cy.add(
			{
				group: 'nodes',
				data: { 
          id: node.toString(), 
          value, 
          position: {x:position.x, y: position.y}
        },
        position: {x:position.x, y: position.y},
      },
		)
		this.createPopper(node, parseInt(node));
  }
  
  layoutProcessing() {
    if(this.heap._data.length === 0) return;
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
      const prevPosition = node.data('position');
      node.data('prevPosition', prevPosition);
      node.data('position', { x: nx, y: ny });
      const popper = this.cy.getElementById(node.id() + '-popper');
      const prevPopPosition = popper.data('position');
      popper.data('prevPosition', prevPopPosition);
			popper.data('position', { x: nx, y: ny + 30 });
			if (node.outgoers('node').length) setSep(node.outgoers('node')[0], nx - sep, ny + 50, sep / 2);
			if (node.outgoers('node').length === 2) setSep(node.outgoers('node')[1], nx + sep, ny + 50, sep / 2);
		}
		setSep(this.cy.getElementById("1"), this.vw / 2, this.vh / 4, sep);
		return true;
  }
  
	processCommands(commands: Array<AnimationStep>){
		this.cy.nodes().forEach((node: CytoscapeElement) => {
			if(!node.id().match('-popper')){
				node.style({
					'background-color': 'white',
					'color': 'black',
				})
			}
    })
    let steps:Array<{elements:Array<Object>, lines: Array<number>, duration: number}>=[];
    let lastLines:Array<number> = [];
    let lastDuration = 0;
    for(let pos = 0; pos < commands.length; pos++){
      let { eles, style, duration, data, classes, lines} = commands[pos];
      if(duration == null) duration = 1000;
      if(lines == null) lines = [];

      steps.push({elements: this.exportGraph(), lines: lastLines, duration: lastDuration});
      lastLines = lines;
      lastDuration = duration;
      if (eles) {
        eles.forEach((ele, index) => {
          if(style){
            const node = this.cy.getElementById(ele);
            node.data('style', style[index]);
          }
          if(data != null){
            this.cy.getElementById(ele).data(data[index]);
          }
        });
      }
    }
    steps.push({elements: this.exportGraph(), lines: lastLines, duration: 1000});
    return steps;
  }

	insert(val = 0) {
    let steps:Array<{elements:Array<Object>, lines: Array<number>, duration: number}>=[];

		if (this.heap.length()-1 === 0) {
      this.addNode("1", val);
      steps.push({
        elements: this.exportGraph(),
        duration: 1000,
        lines: [1,2,3,4]
      });
      const commands = this.heap.push(val, true);
      steps = steps.concat(this.processCommands(commands));
		} else {
			let nodeId = this.heap.length();
			console.log(nodeId);
			let src = this.cy.getElementById(Math.floor(nodeId / 2).toString());
			this.addNode(nodeId.toString(), val, src.data('position'));
			this.cy.add(
				{
					group: 'edges',
					data: { id: src.id() + '-' + nodeId.toString(), source: src.id(), target: nodeId.toString() }
				}
      )
      steps.push({
        elements: this.exportGraph(),
        duration: 1000,
        lines: [1,2,3,4]
      });
      const commands = this.heap.push(val, true);
      steps = steps.concat(this.processCommands(commands));
		}

    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')){
        node.data('style', Styles.NODE);
      }
    });
    steps.push({elements: this.exportGraph(), lines: [], duration: 0});
    return steps;
	}

  removeNode = (node: string) => {
		this.cy.remove('node[id="' + node + '"]');
		this.cy.remove('node[id="' + node + '-popper"]');
  }
  
	remove = () => {
		const n = this.heap.length()-1;
		const outgoers = this.cy.getElementById("1").outgoers('node');
		this.removeNode("1");
    let commands:Array<AnimationStep>;
		commands = this.heap.pop(true);

		if (n === 1) {
			return [{ elements: this.exportGraph(), lines: [], duration: 1000}];
		}

		const position = this.cy.getElementById(n.toString()).data('position');
		const value = this.cy.getElementById(n.toString()).data('value');
		this.removeNode(n.toString());

		this.addNode("1", value, position);

    let steps:Array<{elements:Array<Object>, lines: Array<number>, duration: number}>=[];    
		for (let i = 0; i < outgoers.length; i++) {
			if (this.cy.getElementById(outgoers[i].id()).length === 0) continue;
			this.cy.add({
				group: 'edges',
				data: { id: "1-" + outgoers[i].id(), source: "1", target: outgoers[i].id() }
			});
		}
    steps = steps.concat({elements: this.exportGraph(), lines: [], duration: 1000});

    steps = steps.concat(this.processCommands(commands));

    this.cy.nodes().forEach((node:CytoscapeElement) => {
      if(!node.id().match('popper')){
        node.data('style', Styles.NODE);
      }
    });
    steps.push({elements: this.exportGraph(), lines: [], duration: 0});
    return steps;
	}
}

export default HeapProcessor;