import React from 'react';
import logo from './logo.svg';
import './App.css';
import cytoscape from 'cytoscape';

const nodeStyle = {
  'background-color': 'white',
  'border-style': 'solid',
  'width': '50',
  'height': '50',
  'border-width': '1',
  'border-opacity': '1',
  'border-color': 'black',
  'label': 'data(id)',
};

class Canvas extends React.Component{

    layout = null; 

    constructor(props){
        super(props);
        this.state = {
          cy: null,
          selectedNode: null,
      }
    }

    componentDidMount() {
      let cy = cytoscape({

        container: document.getElementById('canvas'), // container to render in
      
        elements: [
          { // node a
            data: { id: 1 },
            position: {
              x: 100,
              y: 100,
            }
          }
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
        },
        headless: false,
        styleEnabled: true,
        hideEdgesOnViewport: false,
        hideLabelsOnViewport: false,
        zoomingEnabled: false,
        textureOnViewport: false,
        motionBlur: false,
        motionBlurOpacity: 0.2,
        wheelSensitivity: 1,
        pixelRatio: '1.0'
      });

      cy.on('click', (event) => this.handleClickViewport(event));
      cy.on('click', 'node', (event) => this.handleClickOnNode(event));
      this.layout = cy.createLayout({ name: 'preset'});
      this.layout.run();

      this.setState({cy});
    }
    
    handleClickOnNode = (event) => {
      let node = event.target;
      let nodeId = node.id();
      let prevNode = this.state.selectedNode;
      if(prevNode === nodeId){
        node.style('background-color', 'white');
        this.setState({selectedNode: null});
      }else{
        let previous = this.state.cy.getElementById(prevNode);
        let {cy} = this.state;
        if(prevNode){
          cy.add({
            group: 'edges',
            data: {
              id: prevNode+'-'+nodeId,
              source: prevNode,
              target: nodeId,
              directed: true,
            }
          });
          this.setState({selectedNode: null});
        }else{
          node.style('background-color', 'red');
          this.setState({selectedNode: nodeId});
        }
        previous.style('background-color', 'white');
      }
    }

    handleClickViewport = (event) => {
      if(event.target === this.state.cy){
        let {x, y} = event.position;
        let {cy} = this.state;
        let n = cy.elements().length;
        cy.add({
          group: 'nodes',
          data: { id: n + 1},
          position: {x, y}
        });
        if(this.state.selectedNode){
          let previous = this.state.cy.getElementById(this.state.selectedNode);
          previous.style('background-color', 'white');
          this.setState({selectedNode : null});
        }
        this.setState({cy});
        this.layout.stop();
        this.layout = cy.elements().makeLayout( {name: 'preset'});
        this.layout.run();  
      }
    }
    render(){
      return (
        <div>
          <div 
            id = "canvas" 
            style={{
              width: '500px',
              height: '500px',
              display: 'block',
            }}
          />
          <div>
            {
              !this.state.selectedNode ? 
              <h1>No node selected</h1> :
              <h1>Node {this.state.selectedNode} selected</h1>
            }
          </div>
        </div>
      )
    }
}


export default Canvas;