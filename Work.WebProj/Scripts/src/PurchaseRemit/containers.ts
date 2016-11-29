import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, callSubmit,
    setInputValue} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        init_data: state.init_data,
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad, callSubmit,
        setInputValue
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


const GridTableToProps = (state, ownProps) => {
    return {
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid
    }
}

const GridTableDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad
    }, dispatch);

    return s;
}
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

