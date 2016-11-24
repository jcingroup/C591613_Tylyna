import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../action_type';
import {Init_Params} from './pub';

const grid = (state: Array<server.Shipment> = [], action): Array<server.Shipment> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.items;
        case ac_type_comm.chg_grid_val:
            let struct = {
                [action.i]: {
                    [action.name]: { $set: action.value }
                }
            };
            let n_state = update(state, struct);
            return n_state;
        default:
            return state;
    }
}

let init_param: Init_Params = {
    Email: '',
    AccountName: '',
    AccountNumber: '',
    BankCode: '',
    BankName: ''
}
export const params = (state = init_param, action) => {

    switch (action.type) {
        case ac_type_comm.load:
            return action.params;
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
    grid, params
})

export default combine;