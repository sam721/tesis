const mergesort = [
  {text: 'mergeSort(Arreglo A[n]):', ind: 0},
  {text: 'Si n==1:', ind: 1},
  {text: 'Retornar A', ind: 2},
  {text: 'Arreglo L=mergeSort(A[0..n/2))', ind:1},
  {text: 'Arreglo R=mergeSort(A[n/2..n))', ind:1},
  {text: 'retornar merge(L,R)', ind: 1},
  {text: '\u2063', ind: 0},
  {text: 'merge(Arreglo L[n], Arreglo R[m]):', ind: 0},
  {text: 'Arreglo M[n+m]', ind: 1},
  {text: 'p=0, i=0, j=0', ind: 1},
  {text: 'Mientras i<n o j<m :', ind: 1},
  {text: 'Si j==m o (i<n y L[i]'+'\u2264'+'R[j]):', ind: 2},
  {text: 'M[p]=L[i], p=p+1, i=i+1', ind: 3},
  {text: 'Sino:', ind:2},
  {text: 'M[p]=R[j], p=p+1, j=j+1', ind: 3},
  {text: 'Retornar M', ind: 1}
];

export default mergesort;