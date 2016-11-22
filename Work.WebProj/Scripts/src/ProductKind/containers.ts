import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, callDelete, callSubmit, setRowInputValue, setInputValue, setPageInfo,
    updateRowState, addRowState, cancelRowState} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        is_edit: state.is_edit,
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
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


const GridTableToProps = (state, ownProps) => {
    return {
        is_edit: state.is_edit,
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        params: state.params
    }
}

const GridTableDispatch = (dispatch, ownProps) => {
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
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

