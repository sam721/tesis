import BFS from '../resources/pseudocodes/BFS';
import DFS from '../resources/pseudocodes/DFS';
import dijkstra from '../resources/pseudocodes/dijkstra';
import kruskal from '../resources/pseudocodes/kruskal';
import bellmanFord from '../resources/pseudocodes/bellmanFord';
import bubblesort from '../resources/pseudocodes/bubblesort';
import mergesort from '../resources/pseudocodes/mergesort';
import prim from '../resources/pseudocodes/prim';
import {heap} from '../resources/pseudocodes/heap';
import {avl, bst} from '../resources/pseudocodes/bst';
import binarySearch from '../resources/pseudocodes/binarySearch';
import listPseudo from '../resources/pseudocodes/list';


import BFSInfo from '../resources/information/BFS';
import DFSInfo from '../resources/information/DFS';
import DijkstraInfo from '../resources/information/Dijkstra';
import BellmanFordInfo from '../resources/information/BellmanFord';
import PrimInfo from '../resources/information/Prim';
import KruskalInfo from '../resources/information/Kruskal';
import bubbleSortInfo from '../resources/information/BubbleSort';
import mergeSortInfo from '../resources/information/MergeSort';
import HeapInfo from '../resources/information/Heap';
import BSTInfo from '../resources/information/BST';
import binarySearchInfo from '../resources/information/BinarySearch';
import LinkedListInfo from '../resources/information/LinkedList';
import QueueInfo from '../resources/information/Queue';
import StackInfo from '../resources/information/Stack';
import DequeInfo from '../resources/information/Deque';
import AVLInfo from '../resources/information/AVL';
import actions from '../Actions/actions'
const algorithmReducer = (state = {}, action) => {
  const control = (action.payload ? 
    {
      options: action.payload.options,
      photo: action.payload.photo,
      gif: action.payload.gif,
      undo: action.payload.undo,
      redo: action.payload.redo,
      rewind: action.payload.rewind,
      forward: action.payload.forward,
      pause: action.payload.pause,
      repeat: action.payload.repeat,
      end: action.payload.end,
      remove: action.payload.remove || null,
      clear: action.payload.clear || null,
      selection: null,
    } : {});

  switch (action.type) {
    case actions.HOME:
      return {
        ...state,
        algorithm: 'none',
        selection: null,
        pseudo: null,
      }

    case actions.SELECT_BFS:
      return {
        ...state,
        ...control,
        algorithm: 'BFS',
        selection: null,
        pseudo: BFS,
        article: BFSInfo,
        run: action.payload.run,
      }

    case actions.SELECT_DFS:
      
      return {
        ...state,
        ...control,
        algorithm: 'DFS',
        pseudo: DFS,
        article: DFSInfo,
        run: action.payload.run,
      }

    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        ...control,
        algorithm: 'Dijkstra',
        pseudo: dijkstra,
        article: DijkstraInfo,
        run: action.payload.run,
      }

    case actions.SELECT_BELLMAN_FORD:
      return {
        ...state,
        ...control,
        algorithm: 'BellmanFord',
        pseudo: bellmanFord,
        article: BellmanFordInfo,
        run: action.payload.run,
      }

    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        ...control,
        algorithm: 'Kruskal',
        pseudo: kruskal,
        article: KruskalInfo,
        run: action.payload.run,
      }

    case actions.SELECT_PRIM:
      return {
        ...state,
        ...control,
        algorithm: 'Prim',
        pseudo: prim,
        article: PrimInfo,
        run: action.payload.run,
      }

    case actions.SELECT_HEAP:
      return {
        ...state,
        ...control,
        algorithm: 'Heap',
        pseudo: heap,
        article: HeapInfo,
      }

    case actions.SELECT_BST:
      return {
        ...state,
        ...control,
        algorithm: 'BST',
        pseudo: bst,
        article: BSTInfo,
      }

    case actions.SELECT_AVL:
      return {
        ...state,
        ...control,
        algorithm: 'AVL',
        pseudo: avl,
        article: AVLInfo,
      }

    case actions.SELECT_BUBBLESORT:
      return {
        ...state,
        ...control,
        algorithm: 'BubbleSort',
        pseudo: bubblesort,
        article: bubbleSortInfo,
      }

    case actions.SELECT_MERGESORT:
      return {
        ...state,
        ...control,
        algorithm: 'MergeSort',
        pseudo: mergesort,
        article: mergeSortInfo,
      }

    case actions.SELECT_BINARY_SEARCH:
      return {
        ...state,
        ...control,
        algorithm: 'BinarySearch',
        pseudo: binarySearch,
        article: binarySearchInfo,
      }

    case actions.SELECT_LINKED_LIST:
      const nextState = {
        ...state,
        ...control,
      }
      switch(action.payload.type){
        case actions.SELECT_SINGLE_LINKED_LIST:
          return {
            ...nextState,
            algorithm: 'SingleLinkedList',
            pseudo: listPseudo.singlySet.main,
            article: LinkedListInfo,
          }
        case actions.SELECT_DOUBLE_LINKED_LIST:
          return {
            ...nextState,
            algorithm: 'DoubleLinkedList',
            pseudo: listPseudo.doublySet.main,
            article: DequeInfo,
          }
        case actions.SELECT_QUEUE:
          return {
            ...nextState,
            algorithm: 'Queue',
            pseudo: listPseudo.queueSet.main,
            article: QueueInfo,
          }
        case actions.SELECT_STACK:
          return {
            ...nextState,
            algorithm: 'Stack',
            pseudo: listPseudo.stackSet.main,
            article: StackInfo,
          }
        default:
          return {...nextState}
      }
      
    default:
      return state;
  }
}

export default algorithmReducer;