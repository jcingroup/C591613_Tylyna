import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';

let init_f: server.Product = {
    Deatil: []
};
const detail = 'Deatil';
const field = (state: server.Product = init_f, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.item;
        case ac_type_comm.chg_dil_fld_val:
            let f_struct_2 = {
                [detail]: {
                    [action.i]: {
                        [action.name]: { $set: action.value }
                    }
                }
            };
            let n_state_2 = update(state, f_struct_2);
            return n_state_2;
        default:
            return state
    }
}
export const combine = combineReducers({
    field
})

export default combine;