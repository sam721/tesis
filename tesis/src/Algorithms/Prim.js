import PriorityQueue from './DS/PriorityQueue';

const Prim = param => {
  const {cy} = param;

  const nodes = cy.nodes();
  const edges = cy.edges();
  const dist = {};
  const part_of_tree = {};
  const pq = new PriorityQueue((x, y) => x.weight <= y.weight);
  const commands = [{line: 0}];
  commands.push(
    {
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill({'line-style': 'dashed', 'line-color': '#eee'}),
      duration: 1000,
      line: 1,
    },
    {
      line: 2, duration: 1000,
    },
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
    commands.push({line: 6, duration: 1000}, {line: 7, duration: 1000});

    part_of_tree[target] = true;
    if(edgeId !== 'NONE'){
      commands.push({
        eles: [edgeId],
        style: [{'line-color': 'green'}],
        duration: 1000,
      });
      part_of_tree[edgeId]=true;
    }

    const current = cy.getElementById(target);
    commands.push(
      {
        eles: [target],
        style: [
          {'background-color': 'red', 'color': 'black'},
        ],
        duration: 1000,
        line: 8,
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

    commands.push({line:9});
    if(edgeId !== 'NONE'){
      commands.push({
        eles: [edgeId],
        style: [{'line-color': 'black', 'line-style': 'solid'}],
        line: 10,
      });
    }

    mst += weight;
    const neighborhood = cy.getElementById(target).connectedEdges();

    neighborhood.forEach(edge => {
      commands.push({
        eles: [edge.id()],
        style: [{'line-color':'green'}],
        line: 11,
      });
      commands.push({line: 12});
      let t = edge.target().id();
      if(t === target) t = edge.source().id();
      let w = edge.data('weight');
      if(dist[t] === undefined || dist[t] > w){
        commands.push({
          line: 13,
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
   
  commands.push(
    {
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill({'line-style': 'solid', 'line-color': '#ccc'}),
      duration: 10,
    },
    {
      eles: nodes.map(x => x.id()),
      style: Array(cy.nodes().length).fill({'background-color':'white', 'color':'black'}),
      duration: 10,
    }
  )
  return commands;
}

export default Prim;