import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};

const middeleware = [thunk];
//In DevelopmentEdition, you need ReduxDevTools, so you must add composeWithDevTools, ELSE YOU MUST COMMENT IT !!
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(
  applyMiddleware(...middeleware))
);

export default store;
