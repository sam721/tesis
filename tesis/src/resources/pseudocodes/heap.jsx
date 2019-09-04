export const remove = [
  {text: 'extraer_minimo(Arreglo A de longitud n)', ind: 0},
  {text: 'intercambiar(A[1], A[n])', ind: 1},
  {text: 'n--', ind: 1},
  {text: 'hundir(1)', ind: 1},
  {text: '\u2063', ind: 0},
  {text: 'hundir(Entero i): ', ind: 0},
  {text: 'Si no es_hoja(i):', ind: 1},
  {text: 'Si A[2*i] < A[2*i+1]:', ind: 2},
  {text: 'h = 2*i', ind: 3},
  {text: 'Sino: ', ind : 2},
  {text: 'h = 2*i+1', ind: 3},
  {text: 'Si A[i] > A[h]:', ind: 2},
  {text: 'hundir(h)', ind: 3},
]

export const insert = [

  {text: 'insertar(Arreglo A de longitud n, Entero v):', ind: 0},
  {text: 'A[n++] = v', ind: 1},
  {text: 'flotar(n)', ind: 1},
  {text: '\u2063', ind: 0},
  {text: 'flotar(entero i):', ind: 0},
  {text: 'Si i/2 > 0 y A[i/2] > A[i]:', ind: 1},
  {text: 'intercambiar(A[i/2], A[i])', ind: 2},
  {text: 'flotar(i/2)', ind: 2},
];

export const heap = [
  { text: 'MinHeap{', ind: 0},
  { text: 'Arreglo A', ind: 1},
  { text: 'insertar(entero v)', ind: 1},
  { text: 'extraer_minimo()', ind: 1},
  { text: '}', ind: 0},
];
