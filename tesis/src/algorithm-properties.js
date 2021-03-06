import BFS from './Algorithms/BFS';
import DFS from './Algorithms/DFS';
import Dijkstra from './Algorithms/Dijkstra';
import BellmanFord from './Algorithms/BellmanFord';
import Prim from './Algorithms/Prim';
import Kruskal from './Algorithms/Kruskal';

import MergeSort from './Algorithms/MergeSort';
import BubbleSort from './Algorithms/BubbleSort';
import BinarySearch from './Algorithms/BinarySearch';

import process from './Processing/graph-processing';
import mergeSortProcess from './Processing/mergesort-processing';

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
  BST: {
    action: actions.SELECT_BST,
    balanced: false,
  },

  AVL: {
    action: actions.SELECT_AVL,
    balanced: true,
  },
  
  BubbleSort: {
    action: actions.SELECT_BUBBLESORT,
    execute: BubbleSort,
    process,
  },
  MergeSort: {
    action: actions.SELECT_MERGESORT,
    execute: MergeSort,
    process: mergeSortProcess,
  },
  BinarySearch: {
    action: actions.SELECT_BINARY_SEARCH,
    execute: BinarySearch,
    process,
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