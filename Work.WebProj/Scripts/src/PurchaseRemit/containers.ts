import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, updateRemitState,
    setInputValue, setRemitCheck} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        RemitCheck: state.RemitCheck
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad, updateRemitState,
        setInputValue
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


const GridTableToProps = (state, ownProps) => {
    return {
        page_operator: state.page_operator,
        search: state.search,
        grid: state.grid,
        RemitCheck: state.RemitCheck
    }
}

const GridTableDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad, setRemitCheck
    }, dispatch);

    return s;
}
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

