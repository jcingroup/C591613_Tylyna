import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import { callLoad, setRowInputValue, delProduct, chgProductQty} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        grid: state.grid
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callLoad,
        setRowInputValue,
        delProduct,
        chgProductQty
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


