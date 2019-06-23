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
        algorithm: 'BFS',
      }

    case actions.SELECT_DFS:
      return {
        algorithm: 'DFS',
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
      
    default:
      return state;
  }
}

export default reducer;