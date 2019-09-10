import DisjointSet from './DS/DisjointSet';
import PriorityQueue from './DS/PriorityQueue';

const Styles = require('../Styles/Styles');
const Kruskal = param => {
  const {cy} = param;

  const nodes = cy.nodes();
  const edges = cy.edges();


  const sorted = new PriorityQueue((x, y) => { return x.data('weight') <= y.data('weight')});
  edges.forEach(edge => sorted.push(edge));

  const commands = [
    {
      eles: edges.map(x => x.data('id')),
      style: Array(cy.edges().length).fill(Styles.EDGE_NO_MST),
      duration: 1000,
      lines: [1,2],
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
      style: [Styles.EDGE_TRAVERSE],
      duration: 1000,
      lines: [3],
    })
    if(!ds.connected(x, y)){
      ds.join(x, y);
      weight += edge.data('weight');
      const source = edge.source(), target = edge.target();
      commands.push(
        {
          eles: [edge.id(), source.id(), target.id()],
          style: [
            Styles.EDGE_MST,
            Styles.NODE_RED,
            Styles.NODE_RED,
          ],
          duration: 1000,
          lines: [4,5],
        }
      );
      edges_used++;
    }else{
      commands.push({
        eles: [edge.id()],
        style: [Styles.EDGE_NO_MST],
        duration: 1000,
        lines: null,
      })
    }
  }

  return commands;
}

export default Kruskal;