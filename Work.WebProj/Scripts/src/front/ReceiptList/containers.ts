import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import { setInputValue, chgOperPage, callSumbit} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        field: state.field,
        oper_page: state.oper_page
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setInputValue,
        chgOperPage,
        callSumbit
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


