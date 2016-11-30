import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';

import {AStartView} from './containers';
import Reducers from './store';
import { callItem} from './actions';

const store = createStore(Reducers, applyMiddleware(thunkMiddleware));

declare var no: string;
var dom = document.getElementById('page_content');
render(<Provider store={store}><AStartView /></Provider>, dom);
store.dispatch(callItem(no));

