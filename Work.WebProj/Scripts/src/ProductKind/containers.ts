import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';


import { callGridLoad, callDelete, callSubmit, setRowInputValue, setInputValue, setPageInfo,
    updateRowState, addRowState, cancelRowState} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        field: state.field,
        params: state.params
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad,
        callDelete,
        callSubmit,
        setRowInputValue, setInputValue, setPageInfo,
        addRowState,
        updateRowState,
        cancelRowState
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);

