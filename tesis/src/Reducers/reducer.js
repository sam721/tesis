import algorithmReducer from './algorithmReducer';
import animationReducer from './animationReducer';
import canvasReducer from './canvasReducer';
import selectionReducer from './selectionReducer';
import notificationsReducer from './notificationsReducer';

const initialState = {
  algorithm: 'BFS',
  selection: null,
  animation: false,
  speed: 1.0,
  loadingGraph: false,
  data: null,
  pseudo: null,
  lines: null,
  run: () => { },
  options: [],
  photo: () => { },
  gif: () => { },
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