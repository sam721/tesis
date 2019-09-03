const binarySearch = [
  { text: 'BusquedaBinaria(Arreglo A[0..n), entero v):', ind: 0},
  { text: 'inf=0, sup=n-1', ind: 1},
  { text: 'Mientras inf \u2264 sup:', ind: 1},
  { text: 'medio=(inf+sup)/2', ind: 2},
  { text: 'Si v == A[medio]:', ind: 2},
  { text: 'Retornar Verdadero', ind: 3},
  { text: 'Si v \u003c A[medio]:', ind: 2},
  { text: 'sup=medio-1', ind: 3},
  { text: 'Sino', ind: 2},
  { text: 'inf=medio+1', ind: 3},
  { text: 'Retornar falso', ind: 1},
];
export default binarySearch;