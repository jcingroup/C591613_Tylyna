import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

//view
import {AStart} from './vwAStart';
import {EditDetail} from './vwEditDetail';


import {callSubmit, callUpdateItem,
    setInputValue, editState,
    getDetailData,addRowState, delRowState, setRowInputValue, callDetailDel} from './actions'

const m1ToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        field: state.field,
        params: state.params
    }
}

const m1Dispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        callSubmit,
        setInputValue,
        editState,
    }, dispatch);

    return s;
}
export const AStartView = connect(m1ToProps, m1Dispatch)(AStart);

const EditDetailToProps = (state, ownProps) => {
    return {
        edit_type: state.edit_type,
        field: state.field,
        params: state.params
    }
}

const EditDetailDispatch = (dispatch, ownProps) => {
    let s = bindActionCreators({
        setRowInputValue,
        addRowState, delRowState,
        callDetailDel,
        getDetailData
    }, dispatch);

    return s;
}
export const EditDetailView = connect(EditDetailToProps, EditDetailDispatch)(EditDetail);

