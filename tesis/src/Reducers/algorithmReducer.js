import BFS from '../resources/pseudocodes/BFS';
import DFS from '../resources/pseudocodes/DFS';
import dijkstra from '../resources/pseudocodes/dijkstra';
import kruskal from '../resources/pseudocodes/kruskal';
import bellmanFord from '../resources/pseudocodes/bellmanFord';
import bubblesort from '../resources/pseudocodes/bubblesort';
import mergesort from '../resources/pseudocodes/mergesort';
import prim from '../resources/pseudocodes/prim';
import {heap} from '../resources/pseudocodes/heap';
import {avl} from '../resources/pseudocodes/avl';
import binarySearch from '../resources/pseudocodes/binarySearch';

import listPseudo from '../resources/pseudocodes/list';
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
        run: action.payload.run,
      }

    case actions.SELECT_DFS:
      
      return {
        ...state,
        ...control,
        algorithm: 'DFS',
        pseudo: DFS,
        run: action.payload.run,
      }

    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        ...control,
        algorithm: 'Dijkstra',
        pseudo: dijkstra,
        run: action.payload.run,
      }

    case actions.SELECT_BELLMAN_FORD:
      return {
        ...state,
        ...control,
        algorithm: 'BellmanFord',
        pseudo: bellmanFord,
        run: action.payload.run,
      }

    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        ...control,
        algorithm: 'Kruskal',
        pseudo: kruskal,
        run: action.payload.run,
      }

    case actions.SELECT_PRIM:
      return {
        ...state,
        ...control,
        algorithm: 'Prim',
        pseudo: prim,
        run: action.payload.run,
      }

    case actions.SELECT_HEAP:
      return {
        ...state,
        ...control,
        algorithm: 'Heap',
        pseudo: heap,
      }

    case actions.SELECT_AVL:
      return {
        ...state,
        ...control,
        algorithm: 'AVL',
        pseudo: avl,
      }

    case actions.SELECT_BUBBLESORT:
      return {
        ...state,
        ...control,
        algorithm: 'BubbleSort',
        pseudo: bubblesort,
      }

    case actions.SELECT_MERGESORT:
      return {
        ...state,
        ...control,
        algorithm: 'MergeSort',
        pseudo: mergesort,
      }

    case actions.SELECT_BINARY_SEARCH:
      return {
        ...state,
        ...control,
        algorithm: 'BinarySearch',
        pseudo: binarySearch,
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
          }
        case actions.SELECT_DOUBLE_LINKED_LIST:
          return {
            ...nextState,
            algorithm: 'DoubleLinkedList',
            pseudo: listPseudo.doublySet.main,
          }
        case actions.SELECT_QUEUE:
          return {
            ...nextState,
            algorithm: 'Queue',
            pseudo: listPseudo.queueSet.main,
          }
        case actions.SELECT_STACK:
          return {
            ...nextState,
            algorithm: 'Stack',
            pseudo: listPseudo.stackSet.main,
          }
      }
      
    default:
      return state;
  }
}

export default algorithmReducer;