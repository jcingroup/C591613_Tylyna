import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';
import {Search_Data} from './pub';

let searchData: Search_Data = {
    id: null,
    state: null
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

const grid = (state: Array<any> = [], action): Array<any> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.items;
        default:
            return state;
    }
}

export const combine = combineReducers({
    grid, search
})

export default combine;