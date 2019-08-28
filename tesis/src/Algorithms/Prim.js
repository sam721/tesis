import PriorityQueue from './DS/PriorityQueue';

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
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill({'line-style': 'dashed', 'line-color': '#eee'}),
      duration: 1000,
      lines: [1,2,3,4,5],
    }
  );
  
  nodes.forEach(node => {
    pq.push({target: node.id(), edgeId: 'NONE', weight: Infinity})
  })
  let mst = 0;
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
          {'background-color': 'red', 'color': 'black'},
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
        style: [{'line-color': 'black', 'line-style': 'solid'}],
        lines: [9, 10],
      });
      part_of_tree[edgeId] = true;
    }

    mst += weight;
    const neighborhood = cy.getElementById(target).connectedEdges();

    neighborhood.forEach(edge => {
      if(part_of_tree[edge.id()]) return;
      commands.push({
        eles: [edge.id()],
        style: [{'line-color':'green'}],
        lines: [11],
      });
      commands.push({lines: [12]});
      let t = edge.target().id();
      if(t === target) t = edge.source().id();
      let w = edge.data('weight');
      if(dist[t] === undefined || dist[t] > w){
        commands.push({
          lines: [13,14],
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
      let col;
      if(part_of_tree[edge.id()]) col = 'black';
      else col = '#ccc';
      commands.push({
        eles: [edge.id()],
        style: [{'line-color':col}],
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