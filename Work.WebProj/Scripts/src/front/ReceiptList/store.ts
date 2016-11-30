import update = require('react-addons-update');
import { combineReducers } from 'redux'
import {ac_type_comm} from '../../action_type';

let init_f: server.Purchase = {
    purchase_no: '',
    remit_money: 0
};
const detail = 'Deatil';
const field = (state: server.Purchase = init_f, action) => {
    switch (action.type) {
        case ac_type_comm.load:
            return action.item;
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

//操作頁面
export const oper_page = (state = ListOperatorType.List, action): ListOperatorType => {
    switch (action.type) {
        case ac_type_comm.load:
            return ListOperatorType.List;
        case ac_type_comm.chg_oper_page:
            return action.data;
        default:
            return state;
    }
}

export const combine = combineReducers({
    field, oper_page
})

export default combine;