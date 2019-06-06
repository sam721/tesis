import React from 'react';
import logo from './logo.svg';
import './App.css';
import cytoscape from 'cytoscape';
import { isFulfilled } from 'q';

import BFS from './Algorithms/BFS';
const autopanOnDrag = require('cytoscape-autopan-on-drag');
autopanOnDrag(cytoscape);

const nodeStyle = {
  'background-color': 'white',
  'border-style': 'solid',
  'width': '50',
  'height': '50',
  'border-width': '1',
  'border-opacity': '1',
  'border-color': 'black',
  'label': 'data(value)',
  'text-valign': 'center',
  'text-halign': 'center',
};

const getNodeIdString = nodeId => {
  return 'node-'+nodeId;
}

class Canvas extends React.Component{

    layout = null; 

    constructor(props){
        super(props);
        this.state = {
          cy: null,
          selection: null,
      }
    }

    componentDidMount() {
      let cy = cytoscape({

        container: document.getElementById('canvas'), // container to render in
      
        elements: [
        ],
      
        style: [ // the stylesheet for the graph
          {
            selector: 'node',
            style: nodeStyle,
          },
      
          {
            selector: 'edge',
            style: {
              'width': 3,
              'line-color': '#ccc',
              'target-arrow-color': '#ccc',
              'target-arrow-shape': 'triangle',
              'curve-style': 'bezier',
            }
          }
        ],
      
        layout: {
          name: 'preset',
          height: '50',
          width: '50',
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
        pixelRatio: '1.0'
      });

      cy.on('click', (event) => this.handleClickViewport(event));
      cy.on('click', 'node', (event) => this.handleClickOnNode(event));
      cy.on('click', 'edge', (event) => this.handleClickOnEdge(event));
      cy.autopanOnDrag({enabled: true, speed: 0.01});
      this.layout = cy.elements().makeLayout( { name: 'preset',
      height: '50',
      width: '50',});
      this.layout.run();

      this.setState({cy});
    }
    
    refreshLayout(cy){
      this.layout.stop();
      this.layout = cy.elements().makeLayout( { name: 'preset',
      height: '50',
      width: '50',});
      this.layout.run();  
    }

    removeNode = (node) => {
      let {cy} = this.state;
      cy.remove('node[id="' + node + '"]');
      if(node === this.state.selection.id){
        this.setState({selection: null});
      }
      this.setState({cy});
    }
    
    removeEdge = (edge) => {
      let {cy} = this.state;
      cy.remove('edge[id="' + edge + '"]');
      if(edge === this.state.selection.id){
        this.setState({selection: null});
      }
      this.setState({cy});
    }

    removeButton = () => {
      let {selection} = this.state;
      if(selection) {
        if(selection.type === 'node'){
          this.removeNode(selection.id);
        }else if(selection.type === 'edge'){
          this.removeEdge(selection.id);
        }
      }
    }

    BFSButton = () => {
     
      let {cy} = this.state;
      let commands = BFS(cy, 'node-1');
      let animation = () => {
        let pos = 0;
        let step = () => {
            if(pos === commands.length){
                cy.nodes().style({
                    'background-color': 'white',
                    'color': 'black',
                });
                return;
            }
            let {node, paint} = commands[pos++];
            cy.getElementById(node).style({
                'background-color': paint,
                'color': (paint === 'gray' ? 'black' : 'white'),
            });
            this.refreshLayout(cy);
            setTimeout(step, 1000);
        }
        step();
      }
      animation();
    }

    handleClickOnNode = (event) => {
      let node = event.target;
      let nodeId = node.id();
      let {cy} = this.state;

      let {selection} = this.state;

      if(!selection || selection.type !== 'node'){
        node.style('background-color', '#00FFFF');
        this.setState({selection: {
          id: nodeId, type: 'node'
          }
        });
        if(selection && selection.type === 'edge'){
          let edge = cy.getElementById(selection.id);
          edge.style({
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
          })
        }
        return;
      }
      if(selection.type === 'node'){
        let prevNode = selection.id;
        if(prevNode === nodeId){
          node.style('background-color', 'white');
          this.setState({selection: null});
        }else{
          let previous = this.state.cy.getElementById(prevNode);
          if(prevNode){
            if(!previous.outgoers().contains(node)){
              cy.add({
                group: 'edges',
                data: {
                  id: prevNode+'-'+nodeId,
                  source: prevNode,
                  target: nodeId,
                }
              });
            }
            this.setState({selection: null});
          }
          previous.style('background-color', 'white');
        }
      }
    }

    handleClickOnEdge = (event) => {
      let edge = event.target;
      let edgeId = edge.id();
      
      let {selection} = this.state;

      let prevId = null;
      if(selection){
        prevId = selection.id;
        let previous = this.state.cy.getElementById(prevId);
        if(selection.type === 'edge'){
          previous.style({
            'line-color': '#ccc',
            'target-arrow-color': '#ccc'
          });
        }else if(selection.type === 'node'){
          previous.style('background-color', 'white');
        }
      }

      if(prevId === edgeId){
        this.setState({selection: null});
        let previous = this.state.cy.getElementById(prevId);
        previous.style({
          'line-color': '#ccc',
          'target-arrow-color': '#ccc'
        });
      }else{
        this.setState({
          selection:{
            type: 'edge',
            id: edgeId,
          }
        });
        edge.style({
          'line-color': 'black',
          'target-arrow-color': 'black'
        });
      }
    }

    createNode(x, y){
      let {cy} = this.state;
      let id = 1;
      while(cy.getElementById(getNodeIdString(id)).length > 0){
        id++;
      }
      cy.add({
        group: 'nodes',
        data: { id: getNodeIdString(id), value: id},
        position: {x, y}
      });
      this.setState({cy});
    }

    handleClickViewport = (event) => {
      if(event.target === this.state.cy){
        if(this.state.selection){
          let previous = this.state.cy.getElementById(this.state.selection.id);
          if(this.state.selection.type === 'node'){
            previous.style('background-color', 'white');
          }else if(this.state.selection.type === 'edge'){
            previous.style({
              'line-color' : '#ccc',
              'target-arrow-color' : '#ccc',
            });
          }
          this.setState({selection : null});
        }else{
          let {x, y} = event.position;
          this.createNode(x, y);
          this.refreshLayout(this.state.cy);
        }
      }
    }

    render(){
      return (
        <div style={{margin: 'auto'}}>
          <div 
            id = "canvas" 
            style={{
              width: '70%',
              height: '4in',
              borderStyle: 'solid',
              borderColor: 'black',
              margin: 'auto'
            }}
          />
          <button onClick = {this.removeButton}>Eliminar elemento</button>
          <button onClick = {this.BFSButton}>Correr BFS</button>
        </div>
      )
    }
}


export default Canvas;