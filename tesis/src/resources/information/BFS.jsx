const BFS = (
  <div>
    <h1>BFS</h1>
    <p>El algoritmo BFS (Breadth-First Search, Búsqueda en Anchura) es un algoritmo
      de búsqueda sobre grafos. A partir de un nodo inicial, cada uno de los vecinos
      son explorados, aumentando así el nivel de profundidad de la búsqueda.

      Cada uno de los nodos son explorados por orden de profundidad (o expansión).
      Debido a este orden de exploración, el algoritmo es comúnmente implementado
      utilizando algún tipo de estructura de datos especial. Las colas, al ser tipo
      FIFO (First In, First Out - Primero en Entrar, Primero en Salir) son una natural
      elección para la implementación del algoritmo BFS
    </p>
  </div>
);

const DFS = (
  <div>
    <h1>DFS</h1>
    <p>El algoritmo DFS (Depth-First Search, Búsqueda en Profundidad) es un algoritmo
      de búsqueda sobre grafos. A partir de un nodo inicial, se explora cada vecino
      recursivamente hasta lo mas profundo del espacio de búsqueda. Una vez alcanzado
      el nivel mas profundo (un nodo sin vecinos a los cuales visitar), se realiza 
      <i>vuelta atrás</i>, continuando la exploración de los vecinos del nodo anteriormente 
      visitado.

      Debido a su naturaleza recursiva, el algoritmo DFS es implementado usando funciones 
      recursivas, aunque existen variantes iterativas en las que se utilizan estructuras de datos
      tipo pila. De hecho, las versiones recursivas hacen uso de la pila del sistema.
    </p>
  </div>
);

const Dijkstra = (
  <div>
    <h1>Dijkstra</h1>
    <p>El algoritmo de Dijkstra (por su publicador, Edsger Dijkstra) es un algoritmo 
      utilizado sobre grafos con pesos no negativos, el cual calcula el costo mínimo para llegar desde un
      nodo inicial hasta los demás vertices del grafo (o algún nodo en específico).

      Similar al algoritmo BFS, se realiza una exploración hacia los vecinos de cada nodo. 
      Sin embargo, al examinar una arista <i>(u,v,w)</i>, se realiza una actualización del costo para
      llegar hasta el nodo v, habiendo obtenido el costo mínimo para llegar a u. Este proceso es conocido
      como <b>relajación</b>

      En el algoritmo de Dijkstra, los nodos son explorados en orden de prioridad, siendo los nodos
      mas prioritarios aquellos cuyo costo de llegada sea el menor posible. Diferentes estructuras
      suelen ser utilizadas para esto, siendo una de las mas eficientes la <b>cola de prioridad</b>,
      las cuales son usualmente implementadas con <b>Heaps</b></p>

      <h1>Pesos negativos y ciclos negativos</h1>
      <p>Debido a la naturaleza <i>greedy</i> del algoritmo, el proceso de relajación siempre
      es aplicado asumiendo que se ha calculado el costo mínimo de llegada desde el punto inicial
      de una arista. Por esto, si existen aristas con peso negativo en el grafo, el proceso de relajación
      puede fallar, ignorando por completo caminos de menor costo, o cayendo en <b>ciclos negativos</b></p>.
  </div>
);

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

const Kruskal = (
  <div>
    <h1>Kruskal</h1>
    <p>
      El algoritmo de Kruskal (por su publicador, Joseph Kruskal) es un algoritmo utilizado 
      sobre grafos con peso para obtener un árbol recubridor de costo mínimo.

      El árbol recubridor T se inicializa como vacío. Las aristas del grafo son procesadas
      por orden de peso. Aquellas cuyo costo es menor son procesadas primero. 

      Una arista <i>(u,v,w)</i> es añadida si no existe algún camino de <i>u</i> a <i>v</i> 
      en T. De existir algún camino, añadir dicha arista generaría la formación de un ciclo, 
      y por ende T dejaría de ser un árbol

      Si el grafo de entrada es desconectado, el algoritmo obtiene un bosque de árboles recubridores
      de costo mínimo
    </p>
    <h1>Detección de ciclo en T</h1>
    <p>
      El paso mas complejo del algoritmo es verificar la existencia de algún camino en T. 
      Sin embargo, solo hace falta verificar la existencia de caminos en T, no el camino en sí.
      Es por esto que, en lugar de encontrar caminos, basta con verificar que ambos nodos se encuentren
      en la misma componente conexa de T. Esto suele realizarse por medio de alguna estructura de datos,
      usualmente siendo usados los <b>conjuntos disjuntos</b>, debido a su eficiencia en tiempo.
    </p>
  </div>
)

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
