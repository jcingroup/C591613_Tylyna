import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';


import { callParamLoad, callSubmit, setRowInputValue, setInputValue, addRowState, delRowState} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        ship_grid: state.ship_grid,
        discount_grid: state.discount_grid,
        params: state.params
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callParamLoad, callSubmit,
        setRowInputValue, setInputValue,
        addRowState, delRowState
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);

