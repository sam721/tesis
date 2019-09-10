import BFS from '../resources/pseudocodes/BFS';
import DFS from '../resources/pseudocodes/DFS';
import dijkstra from '../resources/pseudocodes/dijkstra';
import kruskal from '../resources/pseudocodes/kruskal';
import bubblesort from '../resources/pseudocodes/bubblesort';
import mergesort from '../resources/pseudocodes/mergesort';
import prim from '../resources/pseudocodes/prim';
import {heap} from '../resources/pseudocodes/heap';
import {avl} from '../resources/pseudocodes/avl';
import binarySearch from '../resources/pseudocodes/binarySearch';

import listPseudo from '../resources/pseudocodes/list';
import actions from '../Actions/actions'
const algorithmReducer = (state = {}, action) => {
  switch (action.type) {
    case actions.SELECT_BFS:
      return {
        ...state,
        algorithm: 'BFS',
        selection: null,
        pseudo: BFS,
        run: action.payload.run,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_DFS:
      
      return {
        ...state,
        algorithm: 'DFS',
        selection: null,
        pseudo: DFS,
        run: action.payload.run,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        algorithm: 'Dijkstra',
        selection: null,
        pseudo: dijkstra,
        run: action.payload.run,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        algorithm: 'Kruskal',
        selection: null,
        pseudo: kruskal,
        run: action.payload.run,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_PRIM:
      return {
        ...state,
        algorithm: 'Prim',
        selection: null,

        pseudo: prim,
        run: action.payload.run,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_HEAP:
      return {
        ...state,
        algorithm: 'Heap',
        selection: null,
        options: action.payload.options,
        pseudo: heap,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_AVL:
      return {
        ...state,
        algorithm: 'AVL',
        selection: null,
        pseudo: avl,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_BUBBLESORT:
      return {
        ...state,
        algorithm: 'BubbleSort',
        selection: null,

        pseudo: bubblesort,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_MERGESORT:
      return {
        ...state,
        algorithm: 'MergeSort',
        selection: null,
        pseudo: mergesort,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_BINARY_SEARCH:
      return {
        ...state,
        algorithm: 'BinarySearch',
        selection: null,
        pseudo: binarySearch,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
      }

    case actions.SELECT_LINKED_LIST:
      const nextState = {
        ...state,
        selection: null,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif,
        undo: action.payload.undo,
        redo: action.payload.redo,
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