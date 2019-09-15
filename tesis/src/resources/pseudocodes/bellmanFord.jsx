const bellmanFord = [
  {text: 'BellmanFord(Grafo G(V,E), nodo inicio):', ind: 0},
  {text: 'Para cada u \u2208 V:', ind: 1},
  {text: 'distancia[u]=\u221E', ind: 2},
  {text: 'distancia[inicio]=0', ind: 1},
  {text: 'Para i=0 hasta |G|-1:', ind: 1},
  {text: 'Para cada arista (u, v) con peso w \u2208 E:', ind: 2},
  {text: 'Si distancia[u]+w<distancia[v]', ind: 3},
  {text: 'distancia[v]=distancia[u]+w', ind: 4},
  {text: '\u2063', ind: 0},
  {text: 'Para cada arista (u, v) con peso w \u2208 E:', ind: 1},
  {text: 'Si distancia[u]+w<distancia[v]', ind: 2},
  {text: 'Alertar existencia de ciclo negativo', ind: 3},
];

export default bellmanFord;