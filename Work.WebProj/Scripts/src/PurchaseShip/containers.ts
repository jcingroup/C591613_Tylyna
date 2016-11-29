import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {GridTable} from './vwGridTable';


import { callGridLoad, callDetailLoad,
    setInputValue} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        search: state.search,
        grid: state.grid
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad, callDetailLoad,
        setInputValue
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);


const GridTableToProps = (state, ownProps) => {
    return {
        search: state.search,
        grid: state.grid
    }
}

const GridTableDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callGridLoad,
        callDetailLoad
    }, dispatch);

    return s;
}
export const GridTableView = connect(GridTableToProps, GridTableDispatch)(GridTable);

