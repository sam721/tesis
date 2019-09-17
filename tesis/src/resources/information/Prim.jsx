

const Prim = (
  <div>
    <h1>Prim</h1>
    <p>
      El algoritmo de Prim (por uno de sus publicadores, Robert C. Prim) es un algoritmo utilizado 
      sobre grafos con peso para obtener un árbol recubridor de costo mínimo.

      El árbol recubridor T se inicializa como vacío. Al igual que el algoritmo de Dijkstra 
      para cálculo de caminos de peso mínimo, el algoritmo de Prim explora los vecinos de cada nodo,
      con una ligera diferencia en el proceso de relajación. Al relajar una arista (u,v,w), el nodo v 
      actualiza su arista incidente de peso mínimo, en lugar de la distancia total de llegada.

      Cada nodo es explorado en orden de prioridad con respecto al peso de su arista mínima incidente. 
      Al explorar un nodo, se añade a T su menor arista incidente, con la excepción del nodo inicial (el cual
      no posee ninguna arista incidente en la exploración).

      Al haber explorado cada uno de los nodos de V, T contendrá un árbol recubridor de costo mínimo.
      Si el grafo de entrada es desconectado, entonces T contendrá un bosque de árboles recubridores mínimos.
      Similarmente al algoritmo de Dijkstra, para explorar cada nodo por orden de prioridad, suele usarse
      alguna estructura de datos eficiente, como las <b>colas de prioridad</b>.
    </p>
  </div>
)
