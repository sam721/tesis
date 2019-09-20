const Styles = require('../Styles/Styles');

const BellmanFord = (param) => {
  const { cy, selection } = param;
  const source = selection.id;

  let dist = {};
  let pre = {};
  const commands = [];
  commands.push(
    {
      eles: cy.nodes().map(x => x.id()),
      distance: Array(cy.nodes().length).fill('\u221E'),
      duration: 1000,
      lines: [1,2],
    }
  )

  dist[source] = 0;
  commands.push(
    {
      eles: [source],
      distance: [0],
      lines: [3],
    }
  );
    
  const n = cy.nodes().length/2;
  for(let i = 0; i < n - 1; i++){
    for(let j = 1; j <= n; j++){
      const currentId = 'node-'+j;
      const current = cy.getElementById(currentId);
      current.outgoers('edge').forEach(edge => {
        const u = edge.data('source'),
              v = edge.data('target'),
              w = edge.data('weight');
        const edgeId = edge.id();
        commands.push(
          {
            eles: [u, v, edgeId],
            style: [Styles.NODE_BLACK, Styles.NODE_BLACK, Styles.EDGE_SELECTED],
            lines: [5],
          });
        if(dist[u] != null){
          const prev = (dist[v] == null) ? '\u221E' : dist[v].toString();
          if(dist[v] == null || dist[u] + w < dist[v]){
            commands.push({ eles: [v], distance: [(dist[u]+w).toString()+'\u003C'+prev], lines: [6,7]});
            dist[v] = dist[u] + w;
            pre[v] = {id: edgeId, u, v};
            commands.push({ eles: [v], distance: [dist[u] + w]});
          }else{
            commands.push({ eles: [v], distance: [prev + '\u2264' + (dist[u]+w).toString()]});
            commands.push({ eles: [v], distance: [prev]});
          }
        }
        commands.push(
          {
            eles: [u, v, edgeId],
            style: [Styles.NODE, Styles.NODE, Styles.EDGE_DIRECTED],
          });
      });
    };
  }

  let negativeCycle = false;
  for(let j = 1; j <= n && !negativeCycle; j++){
    const currentId = 'node-'+j;
    const current = cy.getElementById(currentId);
    const outgoers = current.outgoers('edge');
    outgoers.forEach(edge => {
      if(negativeCycle) return;
      let   u = edge.data('source'),
            v = edge.data('target'),
            w = edge.data('weight');
      const edgeId = edge.id();
      commands.push(
        {
          eles: [u, v, edgeId],
          style: [Styles.NODE_BLACK, Styles.NODE_BLACK, Styles.EDGE_SELECTED],
          lines: [9],
        });
      if(dist[u] != null){
        commands.push(
          {
            eles: [u, v, edgeId],
            style: [Styles.NODE, Styles.NODE, Styles.EDGE_DIRECTED],
            lines: [9],
            duration: 0,
          });
        if(dist[u] + w < dist[v]){
          const eles = [], style = [];
          const visited = {};
          while(true){
            const prev = pre[u];
            if(visited[prev.u] == null) visited[prev.u] = 1;
            else if(visited[prev.u] === 1){
              eles.push(prev.id, prev.u);
              style.push(Styles.EDGE_SELECTED, Styles.NODE_RED);
              visited[prev.u] = 2;
            }else break;
            u = prev.u;
          }
          commands.push(
            {
              eles, 
              style,
              inst: [{name:'negative_cycle'}],
              lines: [10,11],
            }
          );
          negativeCycle = true;
          return;
        }
      }
      commands.push(
        {
          eles: [u, v, edgeId],
          style: [Styles.NODE, Styles.NODE, Styles.EDGE_DIRECTED],
        });
    });
  };

  return commands;
}

export default BellmanFord;