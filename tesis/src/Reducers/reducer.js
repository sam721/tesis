import actions from '../Actions/actions'

const initialState = {
  algorithm: 'BFS',
  selection: null,
  animation: false,
  speed: 1.0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SELECT_BFS:
      return {
        ...state,
        algorithm: 'BFS',
        selection: null,
        speed: 1.0,
      }

    case actions.SELECT_DFS:
      return {
        ...state,
        algorithm: 'DFS',
        selection: null,
        speed: 1.0,
      }
    
    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        algorithm: 'Dijkstra',
        selection: null,
        speed: 1.0,
      }
    
    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        algorithm: 'Kruskal',
        selection: null,
        speed: 1.0,

      }
      
    case actions.SELECT_PRIM:
      return {
        ...state,
        algorithm: 'Prim',
        selection: null,
        speed: 1.0,
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
      }
      
    case actions.SELECT_MERGESORT:
      return {
        ...state,
        algorithm: 'MergeSort',
        selection: null,
        speed: 1.0,
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
    default:
      return state;
  }
}

export default reducer;