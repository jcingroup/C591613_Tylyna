import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import { setData, setRowInputValue, addCart} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        field: state.field
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setData,
        setRowInputValue,
        addCart
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


