import PriorityQueue from './DS/PriorityQueue';

const Styles = require('../Styles/Styles');
const Prim = param => {
  const {cy} = param;

  const nodes = cy.nodes();
  const edges = cy.edges();
  const dist = {};
  const part_of_tree = {};
  const pq = new PriorityQueue((x, y) => x.weight <= y.weight);
  const commands = [];
  commands.push(
    {
      eles: nodes.map(x => x.data('id')),
      distance: Array(cy.nodes().length).fill('\u221E'),
      lines: [1,2,3,4,5],
    },
    {
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill(Styles.EDGE_NO_MST),
      duration: 1000,
      lines: [1,2,3,4,5],
    }
  );
  
  nodes.forEach(node => {
    if(node.id().match('-popper')) return;
    pq.push({target: node.id(), edgeId: 'NONE', weight: Infinity})
  })
  while(!pq.isEmpty()){
    const edge = pq.top(); pq.pop() ;
    const{target, edgeId, weight} = edge;
    if(part_of_tree[target]) continue;
    if(weight === Infinity) dist[target] = 0;
    commands.push({lines: [6], duration: 1000});

    part_of_tree[target] = true;

    const current = cy.getElementById(target);
    commands.push(
      {
        eles: [target],
        style: [
          Styles.NODE_RED,
        ],
        duration: 1000,
        lines: [7,8],
        inst: [{
          name: 'change_element',
          position: parseInt(current.data('value'), 10) - 1,
          data: {
            value: dist[target].toString(),
            class: 'heap-wrong',
          }
        }],
      },
    );

    if(edgeId !== 'NONE'){
      commands.push({
        eles: [edgeId],
        style: [Styles.EDGE_MST],
        lines: [9, 10],
      });
      part_of_tree[edgeId] = true;
    }

    const neighborhood = cy.getElementById(target).connectedEdges();

    neighborhood.forEach(edge => {
      if(part_of_tree[edge.id()]) return;

      let t = edge.target().id();
      if(t === target) t = edge.source().id();
      if(part_of_tree[t]) return;
      let w = edge.data('weight');
      commands.push({
        eles: [edge.id()],
        style: [Styles.EDGE_TRAVERSE],
        lines: [11],
      });
      commands.push({lines: [12]});
      if(dist[t] === undefined || dist[t] > w){
        commands.push({
          lines: [13,14],
          eles: [t],
          style: [Styles.NODE_GRAY],
          distance: [w],
          inst: [{
            name: 'change_element',
            position: parseInt(cy.getElementById(t).data('value'), 10) - 1,
            data: {
              value: w.toString(),
              class: 'heap-default',
            }
          }],
        });
        dist[t] = w;
        pq.push({
          target: t,
          edgeId: edge.id(),
          weight: w,
        })
      }
      let nextStyle;
      if(part_of_tree[edge.id()]) nextStyle=Styles.EDGE_MST;
      else nextStyle=Styles.EDGE_NO_MST;
      commands.push({
        eles: [edge.id()],
        style: [nextStyle],
        duration: 10,
      });
    });
    commands.push({
      inst: [{
        name: 'change_element',
        position: parseInt(current.data('value'), 10) - 1,
        data: {
          value: (dist[target]===undefined ? '0' : (dist[target]).toString()),
          class: 'heap-default',
        }
      }], 
    });
  }
  return commands;
}

export default Prim;