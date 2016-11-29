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
const grid = (state: Array<server.Purchase> = [], action): Array<server.Product> => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.items;
        default:
            return state;
    }
}

let page_operator_state: server.PageInfo = {
    page: 0,
    startcount: 0,
    endcount: 0,
    total: 0,
    records: 0,
    field: null,
    sort: null
}
export const page_operator = (state = page_operator_state, action) => {

    switch (action.type) {
        case ac_type_comm.load:
            return action.pageinfo;
        case ac_type_comm.update_pageinfo:
            return action.data;
        default:
            return state
    }
}

export const RemitCheck = (state: Array<string> = [], action) => {
    switch (action.type) {
        case remit_type.chg_remit_list:
            return action.data;
        default:
            return state
    }
}

export const combine = combineReducers({
    grid, page_operator, search, RemitCheck
})

export default combine;