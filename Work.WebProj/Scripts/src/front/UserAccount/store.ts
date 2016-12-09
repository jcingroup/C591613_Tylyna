import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm, customer_type} from '../../action_type';

const field = (state: server.Customer = {}, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.item;
        case ac_type_comm.chg_fld_val:
            let f_struct_1 = {
                [action.name]: { $set: action.value }
            };
            let n_state_1 = update(state, f_struct_1);
            return n_state_1;
        default:
            return state
    }
}

//檢視狀態?
export const email_view_mode = (state = InputViewMode.view, action: Redux.Action): InputViewMode => {
    switch (action.type) {
        case customer_type.email_cancel:
            return InputViewMode.view;
        case customer_type.email_update:
            return InputViewMode.edit;
        case ac_type_comm.load:
            return InputViewMode.view;
        default:
            return state;
    }
}

//檢視狀態?
export const pw_view_mode = (state = InputViewMode.view, action: Redux.Action): InputViewMode => {
    switch (action.type) {
        case customer_type.pw_cancel:
            return InputViewMode.view;
        case customer_type.pw_update:
            return InputViewMode.edit;
        case ac_type_comm.load:
            return InputViewMode.view;
        default:
            return state;
    }
}

export const combine = combineReducers({
    field, email_view_mode, pw_view_mode
})

export default combine;