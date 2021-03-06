﻿import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import { callGridLoad, setInputValue } from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        grid: state.grid,
        search: state.search
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad,
        setInputValue
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


