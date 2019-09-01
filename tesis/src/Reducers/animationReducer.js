import actions from '../Actions/actions'

const animationReducer = (state = {}, action) => {
  switch (action.type) {
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
        lines: null,
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
        lines: action.payload.lines,
      }
    default:
      return state;
  }
}

export default animationReducer;