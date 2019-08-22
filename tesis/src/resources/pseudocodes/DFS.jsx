const DFS = [
  { text: 'DFS_visitar(nodo u):', ind: 0},
  { text: 'color[u]=Gris', ind: 1},
  { text: 'Para cada v adyacente a u:', ind: 1},
  { text: 'Si color[v] es blanco:', ind: 2},
  { text: 'DFS_visitar(v)', ind: 3},
  { text: 'color[u]=Negro', ind: 1},
  { text: '\u2063', ind: 0},
  { text: 'DFS(Grafo G(V,E), Nodo inicio):', ind: 0},
  { text: 'Para cada u \u2208 V', ind: 1 },
  { text: 'color[u]=blanco:', ind: 2 },
  { text: 'DFS_visitar(u)', ind: 1 },
]
export default DFS;