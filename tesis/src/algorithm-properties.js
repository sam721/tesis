import BFS from './Algorithms/BFS';
import DFS from './Algorithms/DFS';
import Dijkstra from './Algorithms/Dijkstra';
import BellmanFord from './Algorithms/BellmanFord';
import Prim from './Algorithms/Prim';
import Kruskal from './Algorithms/Kruskal';

import pseudocodes from './resources/pseudocodes/list';
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
  BellmanFord: {
    execute: BellmanFord,
    directed: true,
    weighted: true,
    action: actions.SELECT_BELLMAN_FORD,
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
  BinarySearch: {
    action: actions.SELECT_BINARY_SEARCH,
  },
  SingleLinkedList: {
    action: actions.SELECT_LINKED_LIST,
    type: actions.SELECT_SINGLE_LINKED_LIST,
    pseudoset: pseudocodes.singlySet,
  },
  DoubleLinkedList: {
    action: actions.SELECT_LINKED_LIST,
    type: actions.SELECT_DOUBLE_LINKED_LIST,
    pseudoset: pseudocodes.doublySet,
  },
  Stack: {
    action: actions.SELECT_LINKED_LIST,
    type: actions.SELECT_STACK,
    pseudoset: pseudocodes.stackSet,
  },
  Queue: {
    action: actions.SELECT_LINKED_LIST,
    type: actions.SELECT_QUEUE,
    pseudoset: pseudocodes.queueSet,
  },

}

export default properties;