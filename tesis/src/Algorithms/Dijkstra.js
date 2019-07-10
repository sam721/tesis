import PriorityQueue from './DS/PriorityQueue';

const Dijkstra = (param) => {
  const { cy, selection } = param;
  const source = selection.id;
  let comp = (x, y) => {
    return x.distance < y.distance;
  }
  let commands = [];
  let pq = new PriorityQueue(comp);
  let dist = {};
  let visited = {};
  dist[source] = 0;
  pq.push({
    distance: 0,
    id: source,
  });
  commands.push(
    {
      eles: cy.nodes().map(x => x.id()),
      distance: Array(cy.nodes().length).fill('\u221E'),
      duration: 500,
    }
  )

  while (!pq.isEmpty()) {
    let { id, distance } = pq.top(); pq.pop();
    if (visited[id]) continue;
    visited[id] = true;
    let current = cy.getElementById(id);
    commands.push(
      {
        eles: [id],
        distance: [distance.toString()],
        style: [{ "background-color": 'red', 'color': 'black' }],
        duration: 1000,
      }
    )
    current.outgoers('edge').forEach(
      edge => {
        let next = edge.target(), weight = edge.data('weight');
        let nextId = next.id();
        commands.push(
          {
            eles: [edge.id()],
            style: [{ 'line-color': 'green', 'target-arrow-color': 'green' }],
            duration: 1000,
          }
        )
        let prevDistance = dist[nextId];
        if (prevDistance === undefined) prevDistance = 'inf';
        if (dist[nextId] === undefined || distance + weight < dist[nextId]) {
          dist[nextId] = distance + weight;
          pq.push({
            distance: distance + weight,
            id: nextId,
          })
          if (prevDistance !== 'inf') {
            commands.push(
              {
                eles: [nextId],
                distance: [(distance + weight) + '\u2264' + prevDistance],
                duration: 1000,
              }
            );
          }
          commands.push(
            {
              eles: [nextId],
              distance: [distance + weight],
              duration: 500,
            }
          )
        } else {
          commands.push(
            {
              eles: [nextId],
              distance: [prevDistance + '\u2264' + (distance + weight)],
              duration: 1000,
            },
            {
              eles: [nextId],
              distance: [prevDistance],
              duration: 500,
            }
          )
        }
        commands.push(
          {
            eles: [edge.id()],
            style: [{ 'line-color': '#ccc', 'target-arrow-color': '#ccc' }],
            duration: 10,
          }
        )
      }
    )
    commands.push(
      {
        eles: [id],
        distance: [distance.toString()],
        style: [{ "background-color": 'black', 'color': 'white' }],
        duration: 1000,
      }
    )
  }

  return commands;
}

export default Dijkstra;