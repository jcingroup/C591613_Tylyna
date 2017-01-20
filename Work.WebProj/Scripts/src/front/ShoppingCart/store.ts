import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';

const grid = (state: Array<server.PurchaseDetail> = [], action): Array<server.PurchaseDetail> => {
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

const discount = (state: Array<server.Discount> = [], action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.discount;
        default:
            return state
    }
}
export const combine = combineReducers({
    grid, discount
})

export default combine;