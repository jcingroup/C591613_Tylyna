import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';

import {AStartView} from './containers';
import Reducers from './store';
import { callGridLoad, callUpdateItem} from './actions';


declare var no: string;
const store = createStore(Reducers, applyMiddleware(thunkMiddleware));

var dom = document.getElementById('page_content');
render(<Provider store={store}><AStartView /></Provider>, dom);
if (no != null) {
    store.dispatch(callUpdateItem(no));
} else {
    store.dispatch(callGridLoad(null));
}

