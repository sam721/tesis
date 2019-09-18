import actions from '../Actions/actions';
import { CytoscapeElement, AnimationStep } from '../Types/types';
const Styles = require('../Styles/Styles');
const cytoscape = require('cytoscape');

const exportGraph = (cy: any) => {
  const elements:Array<Object> = [];
  cy.nodes().forEach((node:CytoscapeElement) => {
    elements.push({
      group: 'nodes',
      data: {
        id: node.id(),
        value: node.data('value'),
        style: node.data('style'),
        position: node.data('position'),
      },
      position: node.data('position'),
    })
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


const processCommands = (elements: Array<Object>, commands:Array<AnimationStep>) => {
  
  const cy = cytoscape({
    elements: JSON.parse(JSON.stringify(elements)),
    headless: true,
  });

  const steps:Array<{elements:Array<Object>, lines: Array<number>, duration: number, action?: string}>=[];

  let lastLines:Array<number> = [];
  let action:string|undefined;
  for(let pos = 0; pos < commands.length; pos++){
    let { eles, distance, style, duration, inst, lines, data } = commands[pos];

    if(duration == null) duration = 1000;
    if(lines == null) lines = lastLines;

    steps.push({elements: exportGraph(cy), lines: lastLines, duration});
    lastLines = lines;
    if (eles) {
      eles.forEach((ele, index) => {
        let prevStyle = cy.getElementById(ele).data('style');
        if(style) cy.getElementById(ele).data('style', {...prevStyle, ...style[index]});
        if(data) cy.getElementById(ele).data('value', data[index].value);
        if (distance !== undefined){
          cy.getElementById(ele+'-popper').data('style', Styles.NODE_POPPER);
          cy.getElementById(ele+'-popper').data('value', distance[index]);
        }
      });
    }

    if(inst){
      for(const ele of inst){
        if(ele.name === 'update_level'){
          const {data} = ele;
          if(data){
            const id = data.id, value = data.value;
            if(id != null && value != null){
              cy.getElementById(id+'-popper').data('style', Styles.NODE_POPPER);
              cy.getElementById(id+'-popper').data('value', value);
            }
          }
        }else if(ele.name === 'negative_cycle'){
          action = actions.NEGATIVE_CYCLE_FOUND;
        }
      }
    }
  }
  steps.push({elements: exportGraph(cy), lines: lastLines, duration: 0, action});

  return steps;
}

export default processCommands;