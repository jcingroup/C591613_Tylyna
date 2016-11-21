import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../action_type';
import {Init_Params} from './pub';

let searchData = {
    keyword: '',
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
const grid = (state: Array<server.ProductKind> = [], action): Array<server.ProductKind> => {
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
        case ac_type_comm.add_row:
            let struct_1 = { $push: [action.add_item] };
            let n_state_1 = update(state, struct_1);
            return n_state_1;
        case ac_type_comm.update_row:
            let struct_2 = {
                [action.i]: { ["view_mode"]: { $set: InputViewMode.edit } }
            };
            let n_state_2 = update(state, struct_2);
            return n_state_2;
        case ac_type_comm.cancel_row:
            let n_state_4 = state;
            if (action.edit_type == IEditType.insert) {//新增取消為刪除row
                let struct_4 = { $splice: [[action.i, 1]] };
                n_state_4 = update(state, struct_4);
            } else if (action.edit_type == IEditType.update) {//修改取消為更新row
                let struct_4 = { [action.i]: { $set: action.item } }
                n_state_4 = update(state, struct_4);
            }
            return n_state_4;
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
    //field: null,
    //sort: null
}
export const page_operator = (state = page_operator_state, action) => {

    switch (action.type) {
        case ac_type_comm.load:
            return action.pageinfo;
        default:
            return state
    }
}

// 判斷是否有欄位在編輯中...
export const is_edit = (state = false, action): boolean => {
    switch (action.type) {
        case ac_type_comm.load:
            return false;
        case ac_type_comm.add_row:
            return true;
        case ac_type_comm.update_row:
            return true;
        case ac_type_comm.cancel_row:
            return false;
        default:
            return state;
    }
}

let init_params: Init_Params = { id: null };
const params = (state = init_params, action): any => {
    switch (action.type) {
        case ac_type_comm.load: {
            return init_params;
        }
        case ac_type_comm.add_row:
            let r_a: Init_Params = {
                id: 0
            };
            return r_a;
        case ac_type_comm.update_row:
            let r_u: Init_Params = {
                id: action.id
            };
            return r_u;
        default:
            return state
    }
}

export const combine = combineReducers({
    grid, is_edit, page_operator, search, params
})

export default combine;