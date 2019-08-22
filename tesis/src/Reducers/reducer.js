import actions from '../Actions/actions'

import BFS from '../resources/pseudocodes/BFS';
import DFS from '../resources/pseudocodes/DFS';
import dijkstra from '../resources/pseudocodes/dijkstra';
import kruskal from '../resources/pseudocodes/kruskal';
import bubblesort from '../resources/pseudocodes/bubblesort';
import mergesort from '../resources/pseudocodes/mergesort';
import prim from '../resources/pseudocodes/prim';
const initialState = {
  algorithm: 'BFS',
  selection: null,
  animation: false,
  speed: 1.0,
  loadingGraph: false,
  data: null,
  pseudo: null,
  line: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SELECT_BFS:
      return {
        ...state,
        algorithm: 'BFS',
        selection: null,
        speed: 1.0,
        pseudo: BFS,
      }

    case actions.SELECT_DFS:
      return {
        ...state,
        algorithm: 'DFS',
        selection: null,
        speed: 1.0,
        pseudo: DFS,
      }
    
    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        algorithm: 'Dijkstra',
        selection: null,
        speed: 1.0,
        pseudo: dijkstra,
      }
    
    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        algorithm: 'Kruskal',
        selection: null,
        speed: 1.0,
        pseudo: kruskal,
      }
      
    case actions.SELECT_PRIM:
      return {
        ...state,
        algorithm: 'Prim',
        selection: null,
        speed: 1.0,
        pseudo: prim,
      }
    
    case actions.SELECT_HEAP:
      return {
        ...state,
        algorithm: 'Heap',
        selection: null,
        speed: 1.0,
      }
    
    case actions.SELECT_AVL:
      return {
        ...state,
        algorithm: 'AVL',
        selection: null,
        speed: 1.0,
      }
    
    case actions.SELECT_BUBBLESORT:
      return {
        ...state,
        algorithm: 'BubbleSort',
        selection: null,
        speed: 1.0,
        pseudo: bubblesort,
      }
      
    case actions.SELECT_MERGESORT:
      return {
        ...state,
        algorithm: 'MergeSort',
        selection: null,
        speed: 1.0,
        pseudo: mergesort,
      }

    case actions.NO_SELECTION:
      return {
        ...state,
        selection: null,
      }

    case actions.SELECTION:
      return {
        ...state,
        selection: action.payload.selection,
      }

    case actions.ANIMATION_START:
      return {
        ...state,
        selection: null,
        animation: true,
      }
    
    case actions.ANIMATION_END:
      return {
        ...state,
        animation: false,
        line: null,
      }
    
    case actions.CLEAR_GRAPH:
      return {
        ...state,
        selection: null,
        animation: false,
      }
    
    case actions.DEC_SPEED:
      return {
        ...state,
        speed: Math.min(state.speed + 0.10, 2),
      }
    
    case actions.INC_SPEED:
      return {
        ...state,
        speed: Math.max(state.speed - 0.10, 0),
      }
    
    case actions.CHANGE_SPEED:
      return {
        ...state,
        speed: action.payload.speed,
      }

    case actions.CHANGE_LINE:
      return {
        ...state,
        line: action.payload.line,
      }

    case actions.LOAD_GRAPH:
      return {
        ...state,
        loadingGraph: true,
        data: action.payload.data,
      }
    
    case actions.FINISHED_LOAD:
      return {
        ...state,
        loadingGraph: false,
        data: null,
      }
    default:
      return state;
  }
}

export default reducer;