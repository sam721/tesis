import DisjointSet from './DS/DisjointSet';
import PriorityQueue from './DS/PriorityQueue';

const Kruskal = param => {
  const {cy} = param;

  const nodes = cy.nodes();
  const edges = cy.edges();


  const sorted = new PriorityQueue((x, y) => { return x.data('weight') <= y.data('weight')});
  edges.forEach(edge => sorted.push(edge));

  const commands = [
    {
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill({'line-style': 'dashed', 'line-color': '#eee'}),
      duration: 1000,
      line: 2,
    },
    {
      line: 3,
    }
  ];

  const ds = new DisjointSet(nodes);
  let weight = 0;
  let edges_used = 0;
  
  while(!sorted.isEmpty()){
    const edge = sorted.top(); sorted.pop();
    const x = edge.source().id(), y = edge.target().id();
    commands.push({
      eles: [edge.id()],
      style: [{'line-color': 'green'}],
      duration: 1000,
      line: 4,
    })
    if(!ds.connected(x, y)){
      ds.join(x, y);
      weight += edge.data('weight');
      commands.push(
        {
          eles: [edge.id()],
          style: [{'line-style': 'solid', 'line-color': 'black'}],
          duration: 1000,
          line: 6,
        },
        {
          line: 7,
        }
      );
      edges_used++;
    }else{
      commands.push({
        eles: [edge.id()],
        style: [{'line-color': '#ccc'}],
        duration: 1000,
        line: null,
      })
    }
  }

  commands.push({
    eles: edges.map(x => x.data('id')),
    style: Array(cy.edges().length).fill({'line-style': 'solid', 'line-color': '#ccc'}),
    duration: 10,
  })
  return commands;
}

export default Kruskal;