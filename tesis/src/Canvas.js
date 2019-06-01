import React from 'react';
import logo from './logo.svg';
import './App.css';
import cytoscape from 'cytoscape';

class Canvas extends React.Component{

    layout = null; 

    constructor(props){
        super(props);
        this.state = {
          cy: null,
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
            style: {
              'background-color': 'white',
              'border-style': 'solid',
              'width': '50',
              'height': '50',
              'border-width': '1',
              'border-opacity': '1',
              'border-color': 'black',
              'label': 'data(id)',
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
      this.layout = cy.createLayout({ name: 'preset'});
      this.layout.run();

      this.setState({cy});
    }

    handleClick = () => {
        let {cy} = this.state;
        let n = cy.elements().length;
        cy.add({
          group: 'nodes',
          data: { id: n + 1},
          position: {
            x: 100,
            y: 100,
          }
        });
        this.setState({cy});
        this.layout.stop();
        this.layout = cy.elements().makeLayout( {name: 'preset'});
        this.layout.run();
    }
    
    handleClickViewport = (event) => {
      console.log(event);
      if(event.target === this.state.cy){
        let {x, y} = event.position;
        let {cy} = this.state;
        let n = cy.elements().length;
        cy.add({
          group: 'nodes',
          data: { id: n + 1},
          position: {x, y}
        });
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
          <button onClick={this.handleClick}>Click me!</button>
        </div>
      )
    }
}


export default Canvas;