import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, callUpdateItem, callSubmit,
    setInputValue, editState} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        init_data: state.init_data,
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        field: state.field,
        params: state.params,
        is_edit: state.is_edit
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad, callSubmit,
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
        callUpdateItem
    }, dispatch);

    return s;
}
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

