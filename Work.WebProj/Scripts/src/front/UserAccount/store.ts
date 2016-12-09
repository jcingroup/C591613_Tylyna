import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';

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

export const combine = combineReducers({
    field
})

export default combine;