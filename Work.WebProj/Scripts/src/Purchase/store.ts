import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../action_type';
import {Init_Params, Search_Data, Init_Data} from './pub';

let searchData: Search_Data = {
    keyword: '',
    order_date: null,
    pay_date: null,
    type: null,
    type_val: null
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
const grid = (state: Array<server.Product> = [], action): Array<server.Product> => {
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
let init_f: server.Product = {
    sort: 0,
    Deatil: []
};
const detail = 'Deatil';
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
        case ac_type_comm.add_dil:
            let f_struct_3 = {
                [detail]: { $push: [action.add_item] }
            };
            let n_state_3 = update(state, f_struct_3);
            return n_state_3;
        case ac_type_comm.update_dil:
            let f_struct_4 = {
                [detail]: {
                    [action.i]: {
                        ["view_mode"]: { $set: InputViewMode.edit }
                    }
                }
            };
            let n_state_4 = update(state, f_struct_4);
            return n_state_4;
        case ac_type_comm.cancel_dil:
            let n_state_5 = state;
            if (action.edit_type == IEditType.insert) {//新增取消為刪除row
                let f_struct_5 = {
                    [detail]: { $splice: [[action.i, 1]] }
                };
                n_state_5 = update(state, f_struct_5);
            } else if (action.edit_type == IEditType.update) {//修改取消為更新row
                let f_struct_5 = {
                    [detail]: { [action.i]: { $set: action.item }}
                };
                n_state_5 = update(state, f_struct_5);
            }
            return n_state_5;
        case ac_type_comm.get_dil_data:
            let f_struct_6 = {
                [detail]: { $set: action.data }
            };
            let n_state_6 = update(state, f_struct_6);
            return n_state_6;
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

// 判斷是否有欄位在編輯中...
export const is_edit = (state = false, action): boolean => {
    switch (action.type) {
        case ac_type_comm.get_dil_data:
            return false;
        case ac_type_comm.add_dil:
            return true;
        case ac_type_comm.update_dil:
            return true;
        case ac_type_comm.cancel_dil:
            return false;
        default:
            return state;
    }
}

let init_params: Init_Params = { no: null };
const params = (state = init_params, action): any => {
    switch (action.type) {
        case ac_type_comm.load: {
            return init_params;
        }
        case ac_type_comm.add:
            let r_a: Init_Params = {
                no: ''
            };
            return r_a;
        case ac_type_comm.update:
            let r_u: Init_Params = {
                no: action.no
            };
            return r_u;
        default:
            return state
    }
}

//暫不使用
let init: Init_Data = {

};
const init_data = (state: Init_Data = init, action): Init_Data => {
    switch (action.type) {
        case ac_type_comm.get_init:
            return action.data;
        default:
            return state
    }
}

export const combine = combineReducers({
    grid, page_operator, search, params,
    field, init_data, edit_type,
    is_edit
})

export default combine;