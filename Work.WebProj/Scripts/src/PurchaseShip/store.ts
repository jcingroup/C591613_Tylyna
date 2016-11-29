import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm, remit_type} from '../action_type';
import {Search_Data} from './pub';

let searchData: Search_Data = {
    keyword: null
};

export const search = (state = searchData, action) => {

    switch (action.type) {
        case ac_type_comm.chg_sch_val:
            let struct = {
                [action.name]: { $set: action.value }
            };
            let n_state = update(state, struct);
            return n_state;
        default:
            return state
    }
}
const detail = 'Deatil';
const grid = (state: Array<server.Purchase> = [], action): Array<server.Product> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.items;
        case ac_type_comm.get_dil_data:
            let g_struct_1 = {
                [action.i]: { $set: action.data }
            };
            let g_state_1 = update(state, g_struct_1);
            return g_state_1;
        default:
            return state;
    }
}


export const combine = combineReducers({
    grid, search
})

export default combine;