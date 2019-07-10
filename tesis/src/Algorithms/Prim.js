import PriorityQueue from './DS/PriorityQueue';

const Prim = param => {
  const {cy} = param;

  const nodes = cy.nodes();
  const edges = cy.edges();
  const dist = {};
  const part_of_tree = {};
  const pq = new PriorityQueue((x, y) => x.weight <= y.weight);

  const commands = [{
    eles: edges.map(x => x.data('id')),
    style: Array(cy.edges().length).fill({'line-style': 'dashed', 'line-color': '#eee'}),
    duration: 1000,
  }];

  let mst = 0;
  pq.push({
    target: nodes[0].id(),
    edgeId: 'NONE',
    weight: 0,
  });
  dist[nodes[0].id()] = 0;
  const popped_edges = {};
  let tree_edges = 0;
  while(!pq.isEmpty()){
    const edge = pq.top(); pq.pop() ;
    const{target, edgeId, weight} = edge;

    if(part_of_tree[target]) continue;

    part_of_tree[target] = true;
    if(edgeId !== 'NONE'){
      commands.push({
        eles: [edgeId],
        style: [{'line-color': 'green'}],
        duration: 1000,
      });
    }

    commands.push(
      {
        eles: [target, edgeId],
        style: [
          {'background-color': 'red', 'color': 'black'},
          {'line-color': 'black', 'line-style': 'solid'}
        ],
        duration: 1000,
      }
    );

    
    mst += weight;
    tree_edges++;
    if(tree_edges === nodes.length) break;
    const neighborhood = cy.getElementById(target).connectedEdges();

    neighborhood.forEach(edge => {
      if(popped_edges[edge.id()]) return;
      popped_edges[edge.id()] = true;
      let t = edge.target().id();
      if(t === target) t = edge.source().id();
      let w = edge.data('weight');
      console.log(edge.id());
      if(dist[t] === undefined || dist[t] > w){
        dist[t] = w;
        pq.push({
          target: t,
          edgeId: edge.id(),
          weight: w,
        })
      }
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