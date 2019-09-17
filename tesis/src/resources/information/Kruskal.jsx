


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