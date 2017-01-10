import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm, param_type} from '../action_type';
import {Init_Params} from './pub';

const ship_grid = (state: Array<server.Shipment> = [], action): Array<server.Shipment> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.ships;
        case param_type.chg_s_grid_val:
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

const discount_grid = (state: Array<server.Discount> = [], action): Array<server.Discount> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.discounts;
        case param_type.chg_d_grid_val:
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
    ship_grid, discount_grid, params
})

export default combine;