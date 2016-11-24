import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';


import { callParamLoad, callSubmit, setRowInputValue, setInputValue} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        grid: state.grid,
        params: state.params
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callParamLoad, callSubmit,
        setRowInputValue, setInputValue
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);

