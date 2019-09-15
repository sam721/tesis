import React from 'react';
import example from '../resources/default_examples/example';
import { CytoEvent, CytoscapeElement } from '../Types/types';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');

const getNodeIdString = (nodeId: string) => {
	return 'node-' + nodeId;
}

class FreeGraph extends React.Component<{}>{
  cy = cytoscape();
  nodeStyle = Styles.NODE;
  edgeStyle = Styles.EDGE;
  
  selection:{type:string, id: string} | null = null;

  layout = {
		run: () => { },
		stop: () => { },
  };
  
  componentDidMount(){
    this.cy = cytoscape({
      container: document.getElementById('examplecanvas'),
      elements: JSON.parse(JSON.stringify(example)),  
      style: [ // the stylesheet for the graph
				{
					selector: 'node',
					style: this.nodeStyle,
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
			pixelRatio: '1.0'
    });

    this.cy.on('click', (event: CytoEvent) => this.handleClickViewport(event));
		this.cy.on('click', 'node', (event: CytoEvent) => this.handleClickOnNode(event.target));
		this.cy.on('click', 'edge', (event: CytoEvent) => this.handleClickOnEdge(event.target));
		this.cy.autopanOnDrag({ enabled: true, speed: 0.01 });
		this.layout = this.cy.elements().makeLayout({
			name: 'preset',
		});
		this.layout.run();
  }

  
  handleClickOnNode = (node: CytoscapeElement) => {
		let nodeId = node.id();
		let { selection } = this;

		if (!selection || selection.type !== 'node') {
			node.style(Styles.NODE_SELECTED);

			if (selection && selection.type === 'edge') {
				let edge = this.cy.getElementById(selection.id);
				edge.style(this.edgeStyle);
			}

      this.selection = {
        type: 'node',
        id: nodeId,
      };
			return;
		}
		if (selection.type === 'node') {
			let prevNode = selection.id;
			if (prevNode === nodeId) {
				node.style(Styles.NODE);
				this.selection = null;
			} else {
				let previous = this.cy.getElementById(prevNode);
				if (prevNode) {
					if (!previous.outgoers().contains(node))  {
						this.createEdge(prevNode, nodeId);
          }
          this.selection = null;
				}
				previous.style(Styles.NODE);
			}
		}
	}

	handleClickOnEdge = (edge: CytoscapeElement) => {
		let edgeId = edge.id();

		let { selection } = this;

		let prevId = null;
		if (selection) {
			prevId = selection.id;
			let previous = this.cy.getElementById(prevId);
			if (selection.type === 'edge') {
				previous.style(this.edgeStyle);
			} else if (selection.type === 'node') {
				previous.style(this.nodeStyle);
			}
		}

		if (prevId === edgeId) {
      this.selection = null;
			let previous = this.cy.getElementById(prevId);
			previous.style(this.edgeStyle);
		} else {
      this.selection = { type: 'edge', id: edgeId };
			edge.style(Styles.EDGE_SELECTED);
		}
	}

	createNode(x: string, y: string) {
		let id = 1;
		while (this.cy.getElementById(getNodeIdString(id.toString())).length > 0) {
			id++;
		}
		let nodeId = getNodeIdString(id.toString());
		this.cy.add({
			group: 'nodes',
			data: { id: nodeId, value: id },
			position: { x, y }
		});
	}

  createEdge(x: string, y: string) {
		this.cy.add({
			group: 'edges',
			data: {
				id: x + '-' + y,
				weight: Math.floor(Math.random() * 15),
				source: x,
				target: y,
			}
		});
  }
  
  handleClickViewport = (event: CytoEvent) => {

		let { selection } = this;
		if (event.target === this.cy) {
			if (selection) {
				let previous = this.cy.getElementById(selection.id);
				if (selection.type === 'node') {
					previous.style(Styles.NODE);
				} else if (selection.type === 'edge') {
					previous.style(this.edgeStyle);
        }
        this.selection = null;
			} else {
				let { x, y } = event.position;
				this.createNode(x, y);
				this.refreshLayout();
			}
		}
  }
  
  refreshLayout() {
		this.layout.stop();
		this.layout = this.cy.elements().makeLayout({ name: 'preset' });
		this.layout.run();
	}

  render(){
    return <div id = "examplecanvas" className="modal-struct"/>
  }
} 

export default FreeGraph;