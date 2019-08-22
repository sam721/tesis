const BFS = [
  { text: 'BFS(Grafo G(V,E), nodo inicio):', ind: 0 },
  { text: 'Para cada nodo u \u2208 V:', ind: 1 },
  { text: 'color[u]=Blanco', ind: 2 },
  { text: 'color[inicio]=Gris:', ind: 1 },
  { text: 'encolar(cola, inicio)', ind: 1 },
  { text: 'Mientras no vacio(cola):', ind: 1},
  { text: 'u=extraer(cola)', ind:2},
  { text: 'color[u]=Negro', ind:2},
  { text: 'Para cada v adyacente a u:', ind:2},
  { text: 'Si color[v] es Blanco:', ind: 3},
  { text: 'color[v]=Gris', ind: 4},
  { text: 'encolar(cola, v)', ind: 4}
];

export default BFS;