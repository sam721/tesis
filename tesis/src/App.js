// @flow
import React from 'react';
import logo from './logo.svg';
import './App.css';
import cytoscape from 'cytoscape';

class App extends React.Component {
  componentDidMount() {
    let cy = cytoscape({

      container: document.getElementById('canvas'), // container to render in
    
      elements: [ // list of graph elements to start with
        { // node a
          data: { id: 'a' }
        },
        { // node b
          data: { id: 'b' }
        },
        { // edge ab
          data: { id: 'ab', source: 'a', target: 'b' }
        }
      ],
    
      style: [ // the stylesheet for the graph
        {
          selector: 'node',
          style: {
            'background-color': '#666',
            'label': 'data(id)'
          }
        },
    
        {
          selector: 'edge',
          style: {
            'width': 3,
            'line-color': '#ccc',
            'target-arrow-color': '#ccc',
            'target-arrow-shape': 'triangle'
          }
        }
      ],
    
      layout: {
        name: 'grid',
        rows: 1
      },
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      hideLabelsOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: 'auto'
    });
    cy.mount();
  }
  render(){
    return <div id = "canvas" style={{
      width: '300px',
      height: '300px',
      display: 'block',
    }}/>
  }
}

export default App;
