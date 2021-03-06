﻿import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import { setInputValue, chgViewMode,
    callSumbit, callChgEmail, callChgPW} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        field: state.field,
        email_view_mode: state.email_view_mode,
        pw_view_mode: state.pw_view_mode
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        chgViewMode,
        callSumbit, callChgEmail, callChgPW
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


