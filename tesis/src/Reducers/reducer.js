import actions from '../Actions/actions'

const initialState = {
  algorithm: 'BFS',
  selection: null,
  animation: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.SELECT_BFS:
      return {
        ...state,
        algorithm: 'BFS',
        selection: null,
      }

    case actions.SELECT_DFS:
      return {
        ...state,
        algorithm: 'DFS',
        selection: null,
      }
    
    case actions.SELECT_DIJKSTRA:
      return {
        ...state,
        algorithm: 'Dijkstra',
        selection: null,
      }
    
    case actions.SELECT_KRUSKAL:
      return {
        ...state,
        algorithm: 'Kruskal',
        selection: null,
      }
      
    case actions.SELECT_PRIM:
      return {
        ...state,
        algorithm: 'Prim',
        selection: null,
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
      
    default:
      return state;
  }
}

export default reducer;