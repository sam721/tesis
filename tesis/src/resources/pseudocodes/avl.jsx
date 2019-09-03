export const insert = [
  {text: 'insertar(nodo u, entero v):', ind: 0},
  {text: 'Si u == NULL', ind: 1},
  {text: 'u = nuevo nodo(v)', ind: 2},
  {text: 'Sino si v < u.valor:', ind: 1},
  {text: 'insertar(u.hijoIzquierdo, v)', ind: 2},
  {text: 'Sino si v > u.valor:', ind: 1},
  {text: 'insertar(u.hijoDerecho, v)', ind: 2},
];

export const remove = [
  { text: 'eliminar(nodo u):', ind: 0},
  { text: 'Si es_hoja(u): borrar u', ind: 1},
  { text: 'Sino: ', ind: 1},
  { text: 'Si hijos(u) == 1:', ind: 2},
  { text: 'eliminar(hijo(u))', ind: 3},
  { text: 'Sino: ', ind: 2},
  { text: 'nodo s = sucesor(u)', ind: 3},
  { text: 'intercambiar(u.valor, s.valor)', ind: 3},
  { text: 'borrar s', ind: 3},
];

export const balance = [
  { text: 'balancear(nodo u)', ind: 0},
  { text: 'Caso 0: u esta balanceado', ind: 1},
  { text: 'Caso 1: factor(u)==2 y factor(u.hijoDerecho)>=0', ind: 1},
  { text: 'rotacionIzquierda(u)', ind: 2},
  { text: 'Caso 2: factor(u)==-2 y factor(u.hijoIzquierdo)<=0', ind: 1},
  { text: 'rotacionDerecha(u)', ind: 2},
  { text: 'Caso 3: factor(u)==2 y factor(u.hijoIzquierdo)<0', ind: 1},
  { text: 'rotacionDerecha(u.hijoDerecho), rotacionIzquierda(u)', ind: 2},
  { text: 'Caso 4: factor(u)==-2 y factor(u.hijoDerecho)>0', ind: 1},
  { text: 'rotacionIzquierda(u.hijoIzquiedo), rotacionDerecha(u)', ind: 2},
];

export const avl = [
  { text: 'AVL{', ind: 0},
  { text: 'Nodo raiz', ind: 1},
  { text: 'insertar(nodo u, entero v)', ind: 1},
  { text: 'eliminar(nodo u)', ind: 1},
  { text: 'buscar(nodo u, entero v)', ind: 1},
  { text: 'balancear(nodo u)', ind: 1},
  { text: 'sucesor(nodo u)', ind: 1},
  { text: '}', ind: 0},
]