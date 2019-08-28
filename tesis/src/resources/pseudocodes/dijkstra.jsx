const dijkstra = [
  {text: 'Dijkstra(Grafo G(V,E), nodo inicio):', ind: 0},
  {text: 'Para cada u \u2208 V:', ind: 1},
  {text: 'distancia[u]=\u221E', ind: 2},
  {text: 'encolar(cola, <inicio,0>)', ind:1},
  {text: 'Mientras no vacio(cola):', ind: 1},
  {text: 'u=extraer_minimo(cola)', ind: 2},
  {text: 'Para cada v adyacente a u:', ind: 2},
  {text: 'Si distancia[u]+peso(u,v)<distancia[v]:', ind:3},
  {text: 'distancia[v]=distancia[u]+peso(u,v)', ind:  4},
  {text: 'actualizar(cola, <v,distancia[v]>)', ind: 4},
];

export default dijkstra;