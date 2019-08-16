import BFS from './Algorithms/BFS';
import DFS from './Algorithms/DFS';
import Dijkstra from './Algorithms/Dijkstra';
import Prim from './Algorithms/Prim';
import Kruskal from './Algorithms/Kruskal';

import actions from './Actions/actions';
const properties = {
  BFS: {
    execute: BFS,
    directed: true,
    action: actions.SELECT_BFS,
  },
  DFS: {
    execute: DFS,
    directed: true,
    action: actions.SELECT_DFS,
  },
  Dijkstra: {
    execute: Dijkstra,
    directed: true,
    weighted: true,
    action: actions.SELECT_DIJKSTRA,
  },
  Prim: {
    execute: Prim,
    directed: false,
    weighted: true,
    action: actions.SELECT_PRIM,
  },
  Kruskal: {
    execute: Kruskal,
    directed: false,
    weighted: true,
    action: actions.SELECT_KRUSKAL,
  },
  Heap: {
    action: actions.SELECT_HEAP,
  },
  AVL: {
    action: actions.SELECT_AVL,
  },
  BubbleSort: {
    action: actions.SELECT_BUBBLESORT,
  },
  MergeSort: {
    action: actions.SELECT_MERGESORT,
  },
}

export default properties;