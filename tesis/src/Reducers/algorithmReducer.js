import BFS from '../resources/pseudocodes/BFS';
import DFS from '../resources/pseudocodes/DFS';
import dijkstra from '../resources/pseudocodes/dijkstra';
import kruskal from '../resources/pseudocodes/kruskal';
import bubblesort from '../resources/pseudocodes/bubblesort';
import mergesort from '../resources/pseudocodes/mergesort';
import prim from '../resources/pseudocodes/prim';
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
      }

    case actions.SELECT_HEAP:
      return {
        ...state,
        algorithm: 'Heap',
        selection: null,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif
      }

    case actions.SELECT_AVL:
      return {
        ...state,
        algorithm: 'AVL',
        selection: null,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif
      }

    case actions.SELECT_BUBBLESORT:
      return {
        ...state,
        algorithm: 'BubbleSort',
        selection: null,

        pseudo: bubblesort,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif
      }

    case actions.SELECT_MERGESORT:
      return {
        ...state,
        algorithm: 'MergeSort',
        selection: null,
        pseudo: mergesort,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif
      }

    case actions.SELECT_BINARY_SEARCH:
      return {
        ...state,
        algorithm: 'BinarySearch',
        selection: null,
        options: action.payload.options,
        photo: action.payload.photo,
        gif: action.payload.gif
      }
    default:
      return state;
  }
}

export default algorithmReducer;