import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, callDelete, callSubmit, callUpdateItem,
    setInputValue, editState} from './actions'

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
        callGridLoad, callDelete, callSubmit,
        setInputValue,
        editState,
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


const GridTableToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
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
        callUpdateItem
    }, dispatch);

    return s;
}
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

