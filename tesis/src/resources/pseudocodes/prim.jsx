const prim = [
  {text: 'Prim(Grafo G(V,E)):', ind: 0},
  {text: 'F=Vacio', ind: 1},
  {text: 'Para cada u \u2208 V', ind: 1},
  {text: 'distancia[u]=\u221E', ind: 2},
  {text: 'padre[u]=u', ind: 2},
  {text: 'encolar(cola,<u,\u221E>)', ind: 2},
  {text: 'Mientras no vacio(cola):', ind: 1},
  {text: 'u=extraer_minimo(cola)', ind: 2},
  {text: 'Añadir u a F', ind: 2},
  {text: 'Si padre[u]!=u:', ind: 2},
  {text: 'Añadir (padre[u], u) a F', ind: 3},
  {text: 'Para cada v adyacente a u:', ind: 2},
  {text: 'Si v \u2209 F y peso(u,v)<distancia[v]:', ind: 3},
  {text: 'Actualizar(cola,<v,peso(u,v)>)', ind: 4},
  {text: 'distancia[v]=peso(u,v)', ind: 4},
  {text: 'retornar F', ind: 1}
];

export default prim;