import actions from '../Actions/actions'

const selectionReducer = (state = {}, action) => {
  switch (action.type) {
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
    default:
      return state;
  }
}

export default selectionReducer;