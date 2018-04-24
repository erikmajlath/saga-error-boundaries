import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import sagas from './sagas'


import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const reducer = (state = 0, action) => {
  if (action.type === 'DEFAULT')
    return state + 1

  return state
}
const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
)
sagaMiddleware.run(sagas)


ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
