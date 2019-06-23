import PriorityQueue from './DS/PriorityQueue';

const Dijkstra = (cy, source) => {
  let comp = (x, y) => {
    return x.distance < y.distance;
  }
  let pq = new PriorityQueue(comp);
  let dist = {};
  let visited = {};
  dist[source] = 0;
  pq.push({
    distance: 0,
    id: source,
  });

  while(!pq.isEmpty()){
    let {id, distance} = pq.top(); pq.pop();
    if(visited[id]) continue;
    visited[id] = true; 

    let current = cy.getElementById(id);
    current.outgoers('edge').forEach(
      edge => {
        let next = edge.target(), weight = edge.data('weight');
        let nextId = next.id();
        if(dist[nextId] === undefined || distance + weight < dist[nextId]){
          dist[nextId] = distance + weight;
          pq.push({
            distance: distance + weight,
            id: nextId,
          })
        }
      }
    )
  }
  
  console.log(dist);
  return [];
}

export default Dijkstra;