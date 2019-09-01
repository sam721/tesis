import actions from '../Actions/actions'

const canvasReducer = (state = {}, action) => {
  switch(action.type){
    case actions.CLEAR_GRAPH:
        return {
          ...state,
          selection: null,
          animation: false,
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

export default canvasReducer;