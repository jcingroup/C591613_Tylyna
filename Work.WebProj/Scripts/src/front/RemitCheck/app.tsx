import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware  } from 'redux';
import thunkMiddleware from 'redux-thunk';
import * as createLogger from 'redux-logger';

import {AStartView} from './containers';
import Reducers from './store';
import { setData, callLoad} from './actions';

declare var no: string;
const store = createStore(Reducers, applyMiddleware(thunkMiddleware));

var dom = document.getElementById('page_content');
render(<Provider store={store}><AStartView /></Provider>, dom);
if (no != "") {//有帶訂單編號參數
    store.dispatch(callLoad(no));
} else {
    let data: server.Purchase = {
        purchase_no: '',
        remit_money: 0
    };
    store.dispatch(setData(data));
}
