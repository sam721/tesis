import { CytoscapeElement, AnimationStep } from '../Types/types';

const cytoscape = require('cytoscape');

const exportGraph = (cy: any) => {
  const elements:Array<Object> = [];
  cy.nodes().forEach((node:CytoscapeElement) => {
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
    node.data('prevPosition', node.data('position'));
  });
  cy.edges().forEach((edge:CytoscapeElement) => {
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
  return JSON.parse(JSON.stringify(elements));
}


const addShadow = (cy: any, id: string, position: {x: number, y: number}) => {
  cy.add({
    group: 'nodes',
    data: { 
      id,
      style: {
        zIndex: 1
      },
      position: {x: position.x, y: position.y}
    },
    position: {x: position.x, y: position.y}
  });
}

const processCommands = (elements: Array<Object>, commands:Array<AnimationStep>) => {
  
  const cy = cytoscape({
    elements: JSON.parse(JSON.stringify(elements)),
    headless: true,
  });

  const steps:Array<{elements:Array<Object>, lines: Array<number>, duration: number}>=[];

  let lastLines:Array<number> = [];
  let lastDuration = 0;
  for(let pos = 0; pos < commands.length; pos++){
    let {nodes, duration, lines, style, positions, shadows} = commands[pos];
    if(duration == null) duration = 1000;
    if(lines == null) lines = lastLines;

    steps.push({elements: exportGraph(cy), lines: lastLines, duration: lastDuration});
    lastLines = lines;
    lastDuration = duration;
    if(nodes){
      nodes.forEach((node, index) => {
        let ele = cy.getElementById(node.id);
        ele.data('prevPosition', ele.data('position'));
        let prevStyle = ele.data('style');
        if(style) ele.data('style', {...prevStyle, ...style[index]});
        if(positions){
          ele.data('position', positions[index]);
        }
      })
    }
    if(shadows){
      shadows.forEach(shadow => {
        if(shadow.value === '+') addShadow(cy, shadow.id, shadow.position);
        else cy.remove('node[id="'+shadow.id+'"]');
      });
    }
  }
  steps.push({elements: exportGraph(cy), lines: lastLines, duration: 0});
  return steps;
}

export default processCommands;