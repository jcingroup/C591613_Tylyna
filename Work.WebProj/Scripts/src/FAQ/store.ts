import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data} from './pub';

let searchData: Search_Data = {
    name: '',
    i_Hide: null
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
const grid = (state: Array<server.Banner> = [], action): Array<server.Banner> => {
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
let init_f: server.Banner = {
    sort: 0
};

const field = (state: server.Product = init_f, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return init_f;
        case ac_type_comm.add:
            return action.data;
        case ac_type_comm.update:
            return action.data;
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
const edit_type = (state = IEditType.none, action: Redux.Action): IEditType => {
    switch (action.type) {
        case ac_type_comm.load:
            return IEditType.none;
        case ac_type_comm.grid:
            return IEditType.none;
        case ac_type_comm.add:
            return IEditType.insert;
        case ac_type_comm.update:
            return IEditType.update;
        default:
            return state
    }
}


let init_params: Init_Params = { id: null };
const params = (state = init_params, action): any => {
    switch (action.type) {
        case ac_type_comm.load: {
            return init_params;
        }
        case ac_type_comm.add:
            let r_a: Init_Params = {
                id: 0
            };
            return r_a;
        case ac_type_comm.update:
            let r_u: Init_Params = {
                id: action.id
            };
            return r_u;
        default:
            return state
    }
}

export const combine = combineReducers({
    grid, page_operator, search, params,
    field, edit_type
})

export default combine;