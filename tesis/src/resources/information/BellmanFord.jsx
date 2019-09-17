
const BellmanFord = (
  <div>
    <h1>Bellman-Ford</h1>
    <p>El algoritmo Bellman-Ford (por sus publicadores, Richard Bellman y Lester Ford Jr.
      es un algoritmo utilizado sobre grafos con pesos no negativos, el cual calcula el costo mínimo
      para llegar desde un nodo inicial hasta los demás vertices del grafo (o algún nodo en específico).

      A pesar de ser más lento que el algoritmo de Dijkstra, Bellman-Ford puede manejar aristas con 
      pesos negativos, y a su vez puede detectar ciclos de costo negativo sobre el grafo.

      El algoritmo primero inicializa el costo de llegada hacia todos los nodos como infinito,
      excepto el nodo inicial, cuyo costo de llegada es naturalmente 0. Luego, por cada arista 
      <i>(u,v,w)</i> se actualiza el costo de llegada a <b>v</b>, basándose en el costo <b>parcial</b> de llegada
      a <b>u</b>. Este proceso es repetido |V|-1 veces, basándose en el hecho de que la longitud de un camino
      entre cada par de nodos es a lo sumo |V|-1.</p>

      <h1>Ciclos negativos</h1>
      <p>
      Como último paso, se realiza el proceso de relajación. Si alguna de las distancias es relajada,
      se dice que se ha encontrado un ciclo negativo en el grafo. Todo ciclo negativo alcanzable desde
      un nodo hace que no exista camino mínimo hacia diferentes nodos en el grafo.
      </p>
  </div>
);
