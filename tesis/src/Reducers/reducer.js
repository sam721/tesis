import algorithmReducer from './algorithmReducer';
import animationReducer from './animationReducer';
import canvasReducer from './canvasReducer';
import selectionReducer from './selectionReducer';
import notificationsReducer from './notificationsReducer';
import { number } from 'prop-types';

const initialState = {
  algorithm: 'none',
  selection: null,
  animation: false,
  speed: 0.75,
  loadingGraph: false,
  data: null,
  pseudo: null,
  lines: null,
  run: () => { },
  options: [],
  photo: () => { },
  gif: () => {},
  gifLength: 0,
  showPseudo: true,

  undo: () => {},
  redo: () => {},
};


const reducer = (state = initialState, action) => {
  let finalState = state;
  finalState = algorithmReducer(finalState, action);
  finalState = animationReducer(finalState, action);
  finalState = canvasReducer(finalState, action);
  finalState = selectionReducer(finalState, action);
  notificationsReducer(action);
  return finalState;
}

export default reducer;