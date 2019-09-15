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
        animation: false,
        data: action.payload.data,
        selection: null,
      }

    case actions.FINISHED_LOAD:
      return {
        ...state,
        loadingGraph: false,
        data: null,
      }
    
    case actions.INC_GIF_LENGTH:
      return {
        ...state,
        gifLength: state.gifLength + 1,
      }

    case actions.RESET_GIF_LENGTH:
      return {
        ...state,
        gifLength: 0,
      }
  
    case actions.START_GIF_ENCODING:
      return {
        ...state,
        processingGif: true,
      }

    case actions.FINISHED_GIF_ENCODING:
      return {
        ...state,
        processingGif: false,
      }

    case actions.TOGGLE_TUTORIAL_MODAL:
      return {
        ...state,
        showTutorialModal: !state.showTutorialModal,
      }
      
    default: 
      return state;
  }
}

export default canvasReducer;