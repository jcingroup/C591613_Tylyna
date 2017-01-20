import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';

import {setRowInputValue, delProduct, chgProductQty} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        grid: state.grid,
        discount: state.discount
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setRowInputValue,
        delProduct,
        chgProductQty
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


